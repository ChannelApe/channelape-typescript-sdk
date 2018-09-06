import axios, { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
import LogLevel from './model/LogLevel';
import RequestLogger from './utils/RequestLogger';
import ChannelApeError from './model/ChannelApeError';
import HttpRequestMethod from './model/HttpRequestMethod';
import RequestResponse from './model/RequestResponse';
import { RequestCallback } from './model/RequestCallback';

const GENERIC_ERROR_CODE = -1;

interface CallDetails {
  callStart: Date;
  callCountForThisRequest: number;
  options: AxiosRequestConfig;
}

export default class RequestClientWrapper {

  private readonly requestLogger: RequestLogger;

  constructor(
    private readonly timeout: number,
    private readonly session: string,
    private readonly logLevel: LogLevel,
    private readonly endpoint: string,
    private readonly maximumRequestRetryTimeout: number,
    private readonly jitterDelayMsMinimum: number,
    private readonly jitterDelayMsMaximum: number
  ) {
    this.requestLogger = new RequestLogger(this.logLevel, endpoint);
  }

  public get(url: string, params: AxiosRequestConfig, callback: RequestCallback): void {
    this.makeRequest(
      HttpRequestMethod.GET,
      new Date(),
      0,
      url,
      params,
      callback
    );
  }

  public put(url: string, params: AxiosRequestConfig, callback: RequestCallback): void {
    this.makeRequest(
      HttpRequestMethod.PUT,
      new Date(),
      0,
      url,
      params,
      callback
    );
  }

  private makeRequest(
    method: HttpRequestMethod,
    callStart: Date,
    numberOfCalls: number,
    url: string,
    options: AxiosRequestConfig,
    callback: RequestCallback
  ): void {
    const callDetails: CallDetails = { options, callStart, callCountForThisRequest: numberOfCalls };
    options.baseURL = this.endpoint;
    options.headers = { 'X-Channel-Ape-Authorization-Token': this.session };
    options.timeout = this.timeout;
    options.method = method;
    try {
      this.requestLogger.logCall(method, url, options);

      let requestPromise: AxiosPromise;

      switch (method) {
        case HttpRequestMethod.GET:
          requestPromise = axios.get(url, options);
          break;
        case HttpRequestMethod.PUT:
          requestPromise = axios.put(url, undefined, options);
          break;
        default:
          throw new ChannelApeError('HTTP Request Method could not be determined', {} as any, '', []);
      }
      requestPromise
        .then((response) => {
          const requestResponse: RequestResponse = {
            response,
            error: undefined,
            body: response == null ? {} : response.data
          };
          this.handleResponse(requestResponse, callback, url, callDetails, method);
        })
        .catch((e) => {
          if (this.shouldRequestBeRetried(e.error, e.response) && e.response) {
            this.handleResponse(e, callback, url, callDetails, method);
          } else {
            try {
              const apiErrors = e.response == null || e.response.data == null || e.response.data.errors == null
                ? [] : e.response.data.errors;
              const finalError = new ChannelApeError(e.message, e.response, url, apiErrors);
              callback(finalError, e, e.body);
            } catch (e) {
              callback(new Error('API Error'), e, {});
              this.requestLogger.logCallbackError(e);
            }
          }
        });
    } catch (e) {
      const requestResponse: RequestResponse = {
        error: e,
        body: {},
        response: undefined
      };
      this.handleResponse(requestResponse, callback, '', callDetails, method);
      return;
    }
  }

  private handleResponse(
    requestResponse: RequestResponse,
    callback: RequestCallback,
    uri: string,
    callDetails: CallDetails,
    method: HttpRequestMethod
  ): void {
    this.requestLogger.logResponse(requestResponse.error, requestResponse.response, requestResponse.body);
    let finalError: ChannelApeError | null = null;
    if (this.didRequestTimeout(callDetails.callStart)) {
      const maximumRetryLimitExceededMessage =
        this.getMaximumRetryLimitExceededMessage(callDetails.callStart, callDetails.callCountForThisRequest);
      finalError = new ChannelApeError(maximumRetryLimitExceededMessage, requestResponse.response, uri, []);
    } else if (requestResponse.response == null) {
      const badResponseMessage = 'No response was received from the server';
      finalError = new ChannelApeError(badResponseMessage, undefined, uri, [{
        code: 504,
        message: badResponseMessage
      }]);
    } else if (
      this.shouldRequestBeRetried(requestResponse.error, requestResponse.response) && requestResponse.response
    ) {
      this.retryRequest(method, uri, callback, callDetails);
      return;
    }
    if (requestResponse.error) {
      finalError = new ChannelApeError(requestResponse.error.message, requestResponse.response, uri, [{
        code: GENERIC_ERROR_CODE,
        message: requestResponse.error.message
      }]);
    } else if (this.isApiError(requestResponse.body) && requestResponse.response && requestResponse.body) {
      finalError = new ChannelApeError(
        `${requestResponse.response.status} ${requestResponse.response.statusText}`,
        requestResponse.response, uri, requestResponse.body.errors);
    }
    try {
      callback(finalError, requestResponse.response as any, requestResponse.body);
    } catch (e) {
      this.requestLogger.logCallbackError(e);
    }
  }

  private getMaximumRetryLimitExceededMessage(callStart: Date, numberOfCalls: number): string {
    const elapsedTimeMs = new Date().getTime() - callStart.getTime();
    return `A problem with the ChannelApe API has been encountered.
    Your request was tried a total of ${numberOfCalls} times over the course of ${elapsedTimeMs} milliseconds`;
  }

  private didRequestTimeout(callStart: Date): boolean {
    const now = new Date();
    const totalElapsedTime = now.getTime() - callStart.getTime();
    return totalElapsedTime > this.maximumRequestRetryTimeout;
  }

  private shouldRequestBeRetried(error: Error | undefined, response: AxiosResponse | undefined): boolean {
    if (response == null) {
      return false;
    }
    return (!error && ((response.status >= 500 && response.status <= 599) || response.status === 429));
  }

  private isApiError(body: any): boolean {
    if (typeof body === 'undefined' || typeof body.errors === 'undefined') {
      return false;
    }
    return body.errors.length > 0;
  }

  private retryRequest(
    method: HttpRequestMethod,
    url: string,
    callback: RequestCallback,
    callDetails: CallDetails
  ) {
    const jitterDelayAmountMs = this.getJitterDelayMs();
    setTimeout(() => {
      callDetails.callCountForThisRequest += 1;
      this.requestLogger.logDelay(callDetails.callCountForThisRequest, jitterDelayAmountMs, {
        method,
        endpoint: url
      });
      this.makeRequest(
        method,
        callDetails.callStart,
        callDetails.callCountForThisRequest,
        url,
        callDetails.options,
        callback
      );
    }, jitterDelayAmountMs);
  }

  private getJitterDelayMs(): number {
    const range = this.jitterDelayMsMaximum - this.jitterDelayMsMinimum + 1;
    return Math.floor(Math.random() * (range)) + this.jitterDelayMsMinimum;
  }
}
