import * as request from 'request';
import { LogLevel } from 'channelape-logger';
import RequestLogger from './utils/RequestLogger';
import ChannelApeError from './model/ChannelApeError';
import { RateLimiter, Interval } from 'limiter';

const GENERIC_ERROR_CODE = -1;
const IMMEDIATELY_FIRE_CALLBACK = false;
const DEFAULT_API_CALLS_PER_INTERVAL = 20;
const DEFAULT_API_LIMIT_INTERVAL: Interval = 'second';

export default class RequestClientWrapper {

  private readonly requestLogger: RequestLogger;
  private readonly limiter: RateLimiter;

  constructor(
    private readonly client: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>,
    private readonly logLevel: LogLevel, endpoint: string, private readonly maximumRequestRetryTimeout: number
  ) {
    this.requestLogger = new RequestLogger(this.logLevel, endpoint);
    this.limiter =
      new RateLimiter(DEFAULT_API_CALLS_PER_INTERVAL, DEFAULT_API_LIMIT_INTERVAL, IMMEDIATELY_FIRE_CALLBACK);
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
    callbackOrOptionsOrUndefined?: request.RequestCallback | request.CoreOptions | undefined,
    callBackOrUndefined?: request.RequestCallback | undefined
  ): void {
    this.limiter.removeTokens(1, (err, remainingRequest) => {
      this.requestLogger.logCall('GET', uriOrOptions, callbackOrOptionsOrUndefined);
      if (typeof uriOrOptions === 'string') {
        if (typeof callbackOrOptionsOrUndefined === 'function') {
          return this.client.get(uriOrOptions, (error, response, body) => {
            this.handleResponse(error, response, body, callbackOrOptionsOrUndefined,
              uriOrOptions, undefined);
          });
        }
        return this.client.get(uriOrOptions, callbackOrOptionsOrUndefined, (error, response, body) => {
          this.handleResponse(error, response, body, callBackOrUndefined,
            uriOrOptions, callbackOrOptionsOrUndefined);
        });
      }
      if (typeof callbackOrOptionsOrUndefined === 'function') {
        return this.client.get(uriOrOptions, (error, response, body) => {
          this.handleResponse(error, response, body, callbackOrOptionsOrUndefined,
            uriOrOptions.uri.toString(), undefined);
        });
      }
      return this.client.get(uriOrOptions);
    });
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
    callbackOrOptionsOrUndefined?: request.RequestCallback | request.CoreOptions | undefined,
    callBackOrUndefined?: request.RequestCallback | undefined
  ): void {
    this.limiter.removeTokens(1, (err, remainingRequest) => {
      this.requestLogger.logCall('PUT', uriOrOptions, callbackOrOptionsOrUndefined);
      if (typeof uriOrOptions === 'string') {
        if (typeof callbackOrOptionsOrUndefined === 'function') {
          return this.client.put(uriOrOptions, (error, response, body) => {
            this.handleResponse(error, response, body, callbackOrOptionsOrUndefined,
              uriOrOptions, undefined);
          });
        }
        return this.client.put(uriOrOptions, callbackOrOptionsOrUndefined, (error, response, body) => {
          this.handleResponse(error, response, body, callBackOrUndefined,
            uriOrOptions, callbackOrOptionsOrUndefined);
        });
      }
      if (typeof callbackOrOptionsOrUndefined === 'function') {
        return this.client.put(uriOrOptions, (error, response, body) => {
          this.handleResponse(error, response, body, callbackOrOptionsOrUndefined,
            uriOrOptions.uri.toString(), undefined);
        });
      }
      return this.client.put(uriOrOptions);
    });
  }

  private handleResponse(
    error: Error,
    response: request.Response,
    body: any,
    callBackOrUndefined: request.RequestCallback | undefined,
    uri: string,
    options: (request.UriOptions & request.CoreOptions) | request.CoreOptions | undefined
  ): void {
    this.requestLogger.logResponse(error, response, body);
    if (this.shouldRequestBeRetried(error, response)) {
      this.retryRequest(response.method, uri, options, callBackOrUndefined, response, body);
      return;
    }
    let finalError: ChannelApeError | null = null;
    if (error) {
      finalError = new ChannelApeError(error.message, response, uri, [{
        code: GENERIC_ERROR_CODE,
        message: error.message
      }]);
    } else if (this.isApiError(body)) {
      finalError = new ChannelApeError(`${response.statusCode} ${response.statusMessage}`,
        response, uri, body.errors);
    }
    if (typeof callBackOrUndefined === 'function') {
      callBackOrUndefined(finalError, response, body);
    }
  }

  private shouldRequestBeRetried(error: Error, response: request.Response): boolean {
    return (!error && ((response.statusCode >= 500 && response.statusCode <= 599) || response.statusCode === 429));
  }

  private isApiError(body: any): boolean {
    if (typeof body.errors === 'undefined') {
      return false;
    }
    return body.errors.length > 0;
  }

  private retryRequest(
    method: string | undefined,
    uri: string,
    options: (request.UriOptions & request.CoreOptions) | request.CoreOptions | undefined,
    callBackOrUndefined: request.RequestCallback | undefined,
    response: request.Response,
    body: any
  ) {
    switch (method) {
      case ('GET'):
        this.get(uri, options, callBackOrUndefined);
        break;
      case ('PUT'):
        this.put(uri, options, callBackOrUndefined);
        break;
      default:
        if (typeof callBackOrUndefined === 'function') {
          const e = new ChannelApeError('HTTP Request Method could not be determined', response, uri, []);
          callBackOrUndefined(e, response, body);
        }
        break;
    }
  }
}
