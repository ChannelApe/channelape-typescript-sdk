import axios, { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
import { LogLevel } from 'channelape-logger';
import RequestLogger from './utils/RequestLogger';
import ChannelApeError from './model/ChannelApeError';
import * as util from 'util';
import RequestRetryInfo from './model/RequestRetryInfo';
import HttpRequestMethod from './model/HttpRequestMethod';
import RequestResponse from './model/RequestResponse';
import { RequestCallback } from './model/RequestCallback';
import { Environment } from './model/Environment';

const GENERIC_ERROR_CODE = -1;
const CHANNEL_APE_API_RETRY_TIMEOUT_MESSAGE = `A problem with the ChannelApe API has been encountered.
Your request was tried a total of %s times over the course of %s milliseconds`;

export default class RequestClientWrapper {

  private readonly requestLogger: RequestLogger;

  constructor(
    timeout: number,
    session: string,
    private readonly logLevel: LogLevel, endpoint: string, private readonly maximumRequestRetryTimeout: number
  ) {
    axios.defaults = {
      timeout,
      baseURL: endpoint,
      responseType: 'json',
      headers: {
        'X-Channel-Ape-Authorization-Token': session
      }
    };
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
      HttpRequestMethod.GET,
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
    callBackOrUndefined: RequestCallback | undefined
  ): void {
    const callDetails = { callStart, callCountForThisRequest: numberOfCalls };
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
            body: response.data
          }
          this.handleResponse(requestResponse, callBackOrUndefined, url, callDetails, method);
        });
    } catch (e) {
      const requestResponse: RequestResponse = {
        error: e,
        body: {},
        response: undefined
      };
      if (typeof callBackOrUndefined === 'function') {
        this.handleResponse(requestResponse, callBackOrUndefined, '', callDetails, method);
      }
      return;
    }
  }

  private handleResponse(
    requestResponse: RequestResponse,
    callBackOrUndefined: RequestCallback | undefined,
    uri: string,
    callDetails: { callStart: Date, callCountForThisRequest: number },
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
      this.retryRequest(
        method, uri, callBackOrUndefined, requestResponse.response, requestResponse.body
      );
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
    if (typeof callBackOrUndefined === 'function') {
      callBackOrUndefined(finalError, requestResponse.response as any, requestResponse.body);
    }
  }

  private getMaximumRetryLimitExceededMessage(callStart: Date, numberOfCalls: number): string {
    const elapsedTimeMs = new Date().getTime() - callStart.getTime();
    return util.format(CHANNEL_APE_API_RETRY_TIMEOUT_MESSAGE, numberOfCalls, elapsedTimeMs);
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
    method: string | undefined,
    uri: string,
    callBackOrUndefined: RequestCallback | undefined,
    response: AxiosResponse,
    body: any
  ) {
    if (method == null) {
      if (typeof callBackOrUndefined === 'function') {
        const e = new ChannelApeError('HTTP Request Method could not be determined', response, uri, []);
        callBackOrUndefined(e, response, body);
      }
      return;
    }
    const requestRetryInfo: RequestRetryInfo = {
      method,
      endpoint: uri
    };
    // exponentialBackoff.backoff(requestRetryInfo);
  }
}
