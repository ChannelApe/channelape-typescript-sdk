import * as request from 'request';
import LogLevel, { getLogLevelName } from './model/LogLevel';

export default class RequestClientWrapper {

  constructor(private readonly client: request.RequestAPI<request.Request,
    request.CoreOptions, request.RequiredUriUrl>) {
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
    if (typeof uriOrOptions === 'string') {
      if (typeof callbackOrOptionsOrUndefined === 'function') {
        return this.client.get(uriOrOptions, callbackOrOptionsOrUndefined);
      }
      return this.client.get(uriOrOptions, callbackOrOptionsOrUndefined, callBackOrUndefined);
    }
    if (typeof callbackOrOptionsOrUndefined === 'function') {
      return this.client.get(uriOrOptions, callbackOrOptionsOrUndefined);
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
    if (typeof uriOrOptions === 'string') {
      if (typeof callbackOrOptionsOrUndefined === 'function') {
        return this.client.put(uriOrOptions, callbackOrOptionsOrUndefined);
      }
      return this.client.put(uriOrOptions, callbackOrOptionsOrUndefined, callBackOrUndefined);
    }
    if (typeof callbackOrOptionsOrUndefined === 'function') {
      return this.client.put(uriOrOptions, callbackOrOptionsOrUndefined);
    }
    return this.client.put(uriOrOptions);
  }
}
