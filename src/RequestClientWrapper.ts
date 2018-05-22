import * as request from 'request';
import LogLevel from './model/LogLevel';
import RequestLogger from './utils/RequestLogger';

export default class RequestClientWrapper {

  private requestLogger: RequestLogger;

  constructor(
    private readonly client: request.RequestAPI<request.Request,
    request.CoreOptions, request.RequiredUriUrl>, private logLevel: LogLevel
  ) {
    this.requestLogger = new RequestLogger(this.logLevel);
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
          this.responseHandler(error, response, body, callbackOrOptionsOrUndefined);
        });
      }
      return this.client.get(uriOrOptions, callbackOrOptionsOrUndefined, (error, response, body) => {
        this.responseHandler(error, response, body, callBackOrUndefined);
      });
    }
    if (typeof callbackOrOptionsOrUndefined === 'function') {
      return this.client.get(uriOrOptions, (error, response, body) => {
        this.responseHandler(error, response, body, callbackOrOptionsOrUndefined);
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
          this.responseHandler(error, response, body, callbackOrOptionsOrUndefined);
        });
      }
      return this.client.put(uriOrOptions, callbackOrOptionsOrUndefined, (error, response, body) => {
        this.responseHandler(error, response, body, callBackOrUndefined);
      });
    }
    if (typeof callbackOrOptionsOrUndefined === 'function') {
      return this.client.put(uriOrOptions, (error, response, body) => {
        this.responseHandler(error, response, body, callbackOrOptionsOrUndefined);
      });
    }
    return this.client.put(uriOrOptions);
  }

  private responseHandler(
    error: Error,
    response: request.Response,
    body: any,
    callBackOrUndefined: Function | undefined
  ): void {
    this.requestLogger.logResponse(error, response, body);
    if (typeof callBackOrUndefined === 'function') {
      callBackOrUndefined(error, response, body);
    }
  }
}
