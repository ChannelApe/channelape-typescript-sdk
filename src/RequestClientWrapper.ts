import * as request from 'request';
import { LogLevel } from 'channelape-logger';
import RequestLogger from './utils/RequestLogger';
import ChannelApeError from './model/ChannelApeError';

const GENERIC_ERROR_CODE = -1;

export default class RequestClientWrapper {

  private requestLogger: RequestLogger;

  constructor(
    private readonly client: request.RequestAPI<request.Request,
    request.CoreOptions, request.RequiredUriUrl>, private logLevel: LogLevel, endpoint: string
  ) {
    this.requestLogger = new RequestLogger(this.logLevel, endpoint);
  }

  public get(
    uri: string,
    options?: request.CoreOptions | undefined,
    callback?: request.RequestCallback | undefined
  ): request.Request;
  public get(
    uri: string,
    callback?: request.RequestCallback | undefined
  ): request.Request;
  public get(
    options: (request.UriOptions & request.CoreOptions),
    callback?: request.RequestCallback | undefined
  ): request.Request;
  public get(
    uriOrOptions: string | (request.UriOptions & request.CoreOptions),
    callbackOrOptionsOrUndefined?: request.RequestCallback | request.CoreOptions | undefined,
    callBackOrUndefined?: request.RequestCallback | undefined
  ): request.Request {
    this.requestLogger.logCall('GET', uriOrOptions, callbackOrOptionsOrUndefined);
    if (typeof uriOrOptions === 'string') {
      if (typeof callbackOrOptionsOrUndefined === 'function') {
        return this.client.get(uriOrOptions, (error, response, body) => {
          this.responseHandler(error, response, body, callbackOrOptionsOrUndefined,
            uriOrOptions, undefined);
        });
      }
      return this.client.get(uriOrOptions, callbackOrOptionsOrUndefined, (error, response, body) => {
        this.responseHandler(error, response, body, callBackOrUndefined,
          uriOrOptions, callbackOrOptionsOrUndefined);
      });
    }
    if (typeof callbackOrOptionsOrUndefined === 'function') {
      return this.client.get(uriOrOptions, (error, response, body) => {
        this.responseHandler(error, response, body, callbackOrOptionsOrUndefined,
          uriOrOptions.uri.toString(), undefined);
      });
    }
    return this.client.get(uriOrOptions);
  }

  public put(
    uri: string,
    options?: request.CoreOptions | undefined,
    callback?: request.RequestCallback | undefined
  ): request.Request;
  public put(
    uri: string,
    callback?: request.RequestCallback | undefined
  ): request.Request;
  public put(
    options: (request.UriOptions & request.CoreOptions),
    callback?: request.RequestCallback | undefined
  ): request.Request;
  public put(
    uriOrOptions: string | (request.UriOptions & request.CoreOptions),
    callbackOrOptionsOrUndefined?: request.RequestCallback | request.CoreOptions | undefined,
    callBackOrUndefined?: request.RequestCallback | undefined
  ): request.Request {
    this.requestLogger.logCall('PUT', uriOrOptions, callbackOrOptionsOrUndefined);
    if (typeof uriOrOptions === 'string') {
      if (typeof callbackOrOptionsOrUndefined === 'function') {
        return this.client.put(uriOrOptions, (error, response, body) => {
          this.responseHandler(error, response, body, callbackOrOptionsOrUndefined,
            uriOrOptions, undefined);
        });
      }
      return this.client.put(uriOrOptions, callbackOrOptionsOrUndefined, (error, response, body) => {
        this.responseHandler(error, response, body, callBackOrUndefined,
          uriOrOptions, callbackOrOptionsOrUndefined);
      });
    }
    if (typeof callbackOrOptionsOrUndefined === 'function') {
      return this.client.put(uriOrOptions, (error, response, body) => {
        this.responseHandler(error, response, body, callbackOrOptionsOrUndefined,
          uriOrOptions.uri.toString(), undefined);
      });
    }
    return this.client.put(uriOrOptions);
  }

  private responseHandler(
    error: Error,
    response: request.Response,
    body: any,
    callBackOrUndefined: request.RequestCallback | undefined,
    uri: string,
    options: (request.UriOptions & request.CoreOptions) | request.CoreOptions | undefined
  ): void {
    this.requestLogger.logResponse(error, response, body);
    if (this.requestShouldBeRetried(error, response)) {
      this.retryRequest(response.method, uri, options, callBackOrUndefined);
      return;
    }
    let finalError: ChannelApeError | null = null;
    if (error) {
      finalError = new ChannelApeError(error.message, response, uri, [{
        code: GENERIC_ERROR_CODE,
        message: error.message
      }]);
    } else if (this.requestHadAnApiError(body)) {
      finalError = new ChannelApeError(`API Error: ${response.statusCode} ${response.statusMessage}`,
        response, uri, body.errors);
    }
    if (typeof callBackOrUndefined === 'function') {
      callBackOrUndefined(finalError, response, body);
    }
  }

  private requestShouldBeRetried(error: Error, response: request.Response): boolean {
    return (!error && ((response.statusCode >= 500 && response.statusCode <= 599) || response.statusCode === 429));
  }

  private requestHadAnApiError(body: any): boolean {
    if (typeof body.errors === 'undefined') {
      return false;
    }
    return body.errors.length > 0;
  }

  private retryRequest(
    method: string | undefined,
    uri: string,
    options: (request.UriOptions & request.CoreOptions) | request.CoreOptions | undefined,
    callBackOrUndefined: request.RequestCallback | undefined
  ) {
    switch (method) {
      case ('GET'):
        this.get(uri, options, callBackOrUndefined);
        break;
      case ('PUT'):
        this.put(uri, options, callBackOrUndefined);
        break;
      case ('POST'):
        // TODO
        break;
      default:
        this.get(uri, options, callBackOrUndefined);
        break;
    }
  }
}
