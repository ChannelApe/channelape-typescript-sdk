import axios, { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
import RequestLogger from './utils/RequestLogger';
import ChannelApeError from './model/ChannelApeError';
import HttpRequestMethod from './model/HttpRequestMethod';
import RequestResponse from './model/RequestResponse';
import { RequestCallback } from './model/RequestCallback';
import RequestClientWrapperConfiguration from './model/RequestClientWrapperConfiguration';
import { RequestConfig } from './model/RequestConfig';

const GENERIC_ERROR_CODE = -1;

interface CallDetails {
  callStart: Date;
  callCountForThisRequest: number;
  options: AxiosRequestConfig;
}

export default class RequestClientWrapper {

  private readonly maximumConcurrentConnections: number;
  private readonly requestLogger: RequestLogger;
  requestQueue: RequestConfig[];
  pendingRequests: number;

  constructor(
    private readonly requestClientWrapperConfiguration: RequestClientWrapperConfiguration
  ) {
    this.requestQueue = [];
    this.pendingRequests = 0;
    this.requestLogger = new RequestLogger(
      this.requestClientWrapperConfiguration.logLevel,
      this.requestClientWrapperConfiguration.endpoint
    );
    this.maximumConcurrentConnections = requestClientWrapperConfiguration.maximumConcurrentConnections;
  }

  public get(url: string, params: AxiosRequestConfig, callback: RequestCallback): void {
    this.handleRequest({
      url,
      params,
      callback,
      method: HttpRequestMethod.GET
    });
  }

  public put(url: string, params: AxiosRequestConfig, callback: RequestCallback): void {
    this.handleRequest({
      url,
      params,
      callback,
      method: HttpRequestMethod.PUT
    });
  }

  public patch(url: string, params: AxiosRequestConfig, callback: RequestCallback): void {
    this.handleRequest({
      url,
      params,
      callback,
      method: HttpRequestMethod.PATCH
    });
  }

  public post(url: string, params: AxiosRequestConfig, callback: RequestCallback): void {
    this.handleRequest({
      url,
      params,
      callback,
      method: HttpRequestMethod.POST
    });
  }

  private handleRequest(requestConfig: RequestConfig): void {
    if (this.pendingRequests < this.maximumConcurrentConnections) {
      this.prepareRequest(requestConfig);
    } else {
      this.requestQueue.unshift(requestConfig);
    }
  }
  public delete(url:string, params:AxiosRequestConfig, callback:RequestCallback):void {
    this.handleRequest({
      url,
      params,
      callback,
      method: HttpRequestMethod.DELETE
    });
  }
  prepareRequest(requestConfig: RequestConfig): void {
    this.pendingRequests = this.pendingRequests + 1;
    this.makeRequest(
      requestConfig.method,
      new Date(),
      0,
      requestConfig.url,
      requestConfig.params,
      requestConfig.callback
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
    options.baseURL = this.requestClientWrapperConfiguration.endpoint;
    if (options.headers === undefined) {
      options.headers = {};
    }
    options.headers['X-Channel-Ape-Authorization-Token'] = this.requestClientWrapperConfiguration.session;
    options.headers['Content-Type'] = 'application/json';
    options.timeout = this.requestClientWrapperConfiguration.timeout;
    options.method = method;
    try {
      this.requestLogger.logCall(method, url, options);

      let requestPromise: AxiosPromise;

      switch (method) {
        case HttpRequestMethod.GET:
          requestPromise = axios.get(url, options);
          break;
        case HttpRequestMethod.PUT:
          const putData = options.data === undefined ? '' : options.data;
          requestPromise = axios.put(url, putData, options);
          break;
        case HttpRequestMethod.POST:
          const postData = options.data === undefined ? '' : options.data;
          requestPromise = axios.post(url, postData, options);
          break;
        case HttpRequestMethod.PATCH:
          const patchData = options.data === undefined ? '' : options.data;
          requestPromise = axios.patch(url, patchData, options);
          break;
        case HttpRequestMethod.DELETE:
          requestPromise = axios.delete(url, options);
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
          if (e.code || e.message === 'Network Error') {
            e.code = e.code ? e.code : e.message;
            this.handleResponse(
              { body: {}, error: undefined, response: { config: e.config } as any, code: e.code },
              callback, url, callDetails, method);
            return;
          }
          if (this.shouldRequestBeRetried(e.error, e.response) && e.response) {
            this.handleResponse(e, callback, url, callDetails, method);
          } else {
            try {
              const apiErrors = e.response == null || e.response.data == null || e.response.data.errors == null
                ? [] : e.response.data.errors;
              const finalError = new ChannelApeError(e.message, e.response, url, apiErrors);
              this.requestCompleted();
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
    this.requestLogger.logResponse(requestResponse.error, requestResponse.response, requestResponse.body,
      requestResponse.code);
    let finalError: ChannelApeError | null = null;

    if (this.didRequestFail(requestResponse)) {
      if (this.didRequestTimeout(callDetails.callStart)) {
        const maximumRetryLimitExceededMessage =
          this.getMaximumRetryLimitExceededMessage(callDetails.callStart, callDetails.callCountForThisRequest);
        finalError = new ChannelApeError(maximumRetryLimitExceededMessage, requestResponse.response, uri, []);
      } else if (
        this.shouldRequestBeRetried(
          requestResponse.error, requestResponse.response, requestResponse.code)
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
    }

    this.requestCompleted();

    try {
      callback(finalError, requestResponse.response as any, requestResponse.body);
    } catch (e) {
      callback(new Error('API Error'), e, {});
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
    return totalElapsedTime > this.requestClientWrapperConfiguration.maximumRequestRetryTimeout;
  }

  private requestCompleted(): void {
    this.pendingRequests = this.pendingRequests - 1;
    if (this.requestQueue.length > 0) {
      const nextRequestConfig = this.requestQueue.pop();
      if (nextRequestConfig) {
        this.prepareRequest(nextRequestConfig);
      }
    }
  }

  private shouldRequestBeRetried(
    error: Error | undefined,
    response: AxiosResponse | undefined,
    code?: string
  ): boolean {
    if (code) {
      return true;
    }
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
    const range = (this.requestClientWrapperConfiguration.maximumRequestRetryRandomDelay -
      this.requestClientWrapperConfiguration.minimumRequestRetryRandomDelay) + 1;
    return (Math.floor(Math.random() * (range))) +
      this.requestClientWrapperConfiguration.minimumRequestRetryRandomDelay;
  }

  private didRequestFail(requestResponse: RequestResponse): boolean {
    if (
      (requestResponse.error || requestResponse instanceof Error) ||
      (requestResponse.code && !doesValueStartWithNumber(requestResponse.code, 2)) ||
      (requestResponse.response && !doesValueStartWithNumber(requestResponse.response.status, 2))
    ) {
      return true;
    }

    return false;

    function doesValueStartWithNumber(value: any, number: number): boolean {
      if (value === undefined || value === null || value === '') {
        return false;
      }

      let stringValue = value;
      if (Number.isInteger(value)) {
        stringValue = value.toString();
      }

      return stringValue.startsWith(number.toString());
    }
  }
}
