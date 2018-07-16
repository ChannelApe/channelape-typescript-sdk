import * as request from 'request';
import { LogLevel } from 'channelape-logger';
import RequestLogger from './utils/RequestLogger';
import ChannelApeError from './model/ChannelApeError';
import * as util from 'util';
import * as backoff from 'backoff';
import RequestRetryInfo from './model/RequestRetryInfo';
import HttpRequestMethod from './model/HttpRequestMethod';
import RequestResponse from './model/RequestResponse';

const GENERIC_ERROR_CODE = -1;
const CHANNEL_APE_API_RETRY_TIMEOUT_MESSAGE = `A problem with the ChannelApe API has been encountered.
Your request was tried a total of %s times over the course of %s milliseconds`;

type CallbackOrOptionsOrUndefined = request.RequestCallback | request.CoreOptions | undefined;

export default class RequestClientWrapper {

  private readonly requestLogger: RequestLogger;

  constructor(
    private readonly client: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>,
    private readonly logLevel: LogLevel, endpoint: string, private readonly maximumRequestRetryTimeout: number
  ) {
    this.requestLogger = new RequestLogger(this.logLevel, endpoint);
  }

  public get(
    uri: string,
    options?: request.CoreOptions | undefined,
    callback?: request.RequestCallback | undefined
  ): void;
  public get(
    uri: string,
    callback?: request.RequestCallback | undefined
  ): void;
  public get(
    options: (request.UriOptions & request.CoreOptions),
    callback?: request.RequestCallback | undefined
  ): void;
  public get(
    uriOrOptions: string | (request.UriOptions & request.CoreOptions),
    callbackOrOptionsOrUndefined?: CallbackOrOptionsOrUndefined,
    callBackOrUndefined?: request.RequestCallback | undefined
  ): void {
    const callStart = new Date();
    const exponentialBackoff = this.getExponentialBackoff();
    exponentialBackoff.on('backoff', (callCount, delay, requestRetryInfo) => {
      this.requestLogger.logDelay(callCount, delay, requestRetryInfo);
    });
    exponentialBackoff.on('ready', (callCount, delay) => {
      this.makeRequest(
        HttpRequestMethod.GET,
        callStart,
        callCount,
        uriOrOptions,
        exponentialBackoff,
        callbackOrOptionsOrUndefined,
        callBackOrUndefined
      );
    });
    this.makeRequest(
      HttpRequestMethod.GET,
      callStart,
      0,
      uriOrOptions,
      exponentialBackoff,
      callbackOrOptionsOrUndefined,
      callBackOrUndefined
    );
  }

  public put(
    uri: string,
    options?: request.CoreOptions | undefined,
    callback?: request.RequestCallback | undefined
  ): void;
  public put(
    uri: string,
    callback?: request.RequestCallback | undefined
  ): void;
  public put(
    options: (request.UriOptions & request.CoreOptions),
    callback?: request.RequestCallback | undefined
  ): void;
  public put(
    uriOrOptions: string | (request.UriOptions & request.CoreOptions),
    callbackOrOptionsOrUndefined?: CallbackOrOptionsOrUndefined,
    callBackOrUndefined?: request.RequestCallback | undefined
  ): void {
    const callStart = new Date();
    const exponentialBackoff = this.getExponentialBackoff();
    exponentialBackoff.on('backoff', (callCount, delay, requestRetryInfo: RequestRetryInfo) => {
      this.requestLogger.logDelay(callCount, delay, requestRetryInfo);
    });
    exponentialBackoff.on('ready', (callCount, delay) => {
      this.makeRequest(
        HttpRequestMethod.PUT,
        callStart,
        callCount,
        uriOrOptions,
        exponentialBackoff,
        callbackOrOptionsOrUndefined,
        callBackOrUndefined
      );
    });
    this.makeRequest(
      HttpRequestMethod.PUT,
      callStart,
      0,
      uriOrOptions,
      exponentialBackoff,
      callbackOrOptionsOrUndefined,
      callBackOrUndefined
    );
  }

  private makeRequest(
    method: HttpRequestMethod,
    callStart: Date,
    numberOfCalls: number,
    uriOrOptions: string | (request.UriOptions & request.CoreOptions),
    exponentialBackoff: backoff.Backoff,
    callbackOrOptionsOrUndefined?: CallbackOrOptionsOrUndefined,
    callBackOrUndefined?: request.RequestCallback | undefined,
  ): void {
    const callDetails = { callStart, callCountForThisRequest: numberOfCalls };
    let callableRequestMethod: Function;
    try {
      callableRequestMethod = this.getCallableRequestMethod(method);
    } catch (e) {
      const requestResponse: RequestResponse = {
        error: e,
        body: {},
        response: undefined
      };
      if (typeof callbackOrOptionsOrUndefined === 'function') {
        this.handleResponse(requestResponse, callbackOrOptionsOrUndefined, '', callDetails, method, exponentialBackoff);
      } else if (typeof callBackOrUndefined === 'function') {
        this.handleResponse(requestResponse, callBackOrUndefined, '', callDetails, method, exponentialBackoff);
      }
      return;
    }

    this.requestLogger.logCall(method, uriOrOptions, callbackOrOptionsOrUndefined);
    if (typeof uriOrOptions === 'string') {
      if (typeof callbackOrOptionsOrUndefined === 'function') {
        return callableRequestMethod(uriOrOptions, (error: Error, response: request.Response, body: any) => {
          const requestResponse = { error, response, body };
          this.handleResponse(requestResponse, callbackOrOptionsOrUndefined,
            uriOrOptions, callDetails, method, exponentialBackoff);
        });
      }
      return callableRequestMethod(
        uriOrOptions,
        callbackOrOptionsOrUndefined,
        (error: Error, response: request.Response, body: any) => {
          const requestResponse = { error, response, body };
          this.handleResponse(requestResponse, callBackOrUndefined,
            uriOrOptions, callDetails, method, exponentialBackoff);
        });
    }
    if (typeof callbackOrOptionsOrUndefined === 'function') {
      return callableRequestMethod(uriOrOptions, (error: Error, response: request.Response, body: any) => {
        const requestResponse = { error, response, body };
        this.handleResponse(requestResponse, callbackOrOptionsOrUndefined,
          uriOrOptions.uri.toString(), callDetails, method, exponentialBackoff);
      });
    }
    return callableRequestMethod(uriOrOptions);
  }

  private getExponentialBackoff(): backoff.Backoff {
    return backoff.exponential({
      initialDelay: 100,
      maxDelay: (this.maximumRequestRetryTimeout / 2)
    });
  }

  private getCallableRequestMethod(method: string): Function {
    let callableRequestMethod: Function;
    switch (method.toUpperCase()) {
      case ('GET'):
        callableRequestMethod = this.client.get;
        break;
      case ('PUT'):
        callableRequestMethod = this.client.put;
        break;
      default:
        throw new ChannelApeError('HTTP Request Method could not be determined', {} as any, '', []);
    }
    return callableRequestMethod;
  }

  private handleResponse(
    requestResponse: RequestResponse,
    callBackOrUndefined: request.RequestCallback | undefined,
    uri: string,
    callDetails: { callStart: Date, callCountForThisRequest: number },
    method: HttpRequestMethod,
    exponentialBackoff: backoff.Backoff
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
        method, uri, callBackOrUndefined, requestResponse.response, requestResponse.body, exponentialBackoff
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
        `${requestResponse.response.statusCode} ${requestResponse.response.statusMessage}`,
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

  private shouldRequestBeRetried(error: Error, response: request.Response | undefined): boolean {
    if (response == null) {
      return false;
    }
    return (!error && ((response.statusCode >= 500 && response.statusCode <= 599) || response.statusCode === 429));
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
    callBackOrUndefined: request.RequestCallback | undefined,
    response: request.Response,
    body: any,
    exponentialBackoff: backoff.Backoff
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
    exponentialBackoff.backoff(requestRetryInfo);
  }
}
