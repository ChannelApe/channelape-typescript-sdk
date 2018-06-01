import { Logger, LogLevel } from 'channelape-logger';
import { Response, Request, UriOptions, CoreOptions, RequestCallback } from 'request';

export default class RequestLogger {
  private readonly logger: Logger;

  constructor (private readonly logLevel: LogLevel, private readonly endpoint: string) {
    this.logger = new Logger('ChannelApe API', logLevel);
  }

  public logCall(
    method: string,
    uriOrOptions: string | (UriOptions & CoreOptions),
    callbackOrOptionsOrUndefined?: RequestCallback | CoreOptions | undefined
  ): void {
    let uri: string;
    let queryParams = '';
    if (typeof uriOrOptions === 'string') {
      uri = `${this.endpoint}${uriOrOptions}`;
      if (typeof callbackOrOptionsOrUndefined !== 'undefined' && typeof callbackOrOptionsOrUndefined !== 'function') {
        queryParams = this.getQueryParamString(callbackOrOptionsOrUndefined.qs);
      }
    } else {
      uri = `${this.endpoint}${uriOrOptions.uri.toString()}`;
      queryParams = this.getQueryParamString(uriOrOptions.qs);
    }
    this.logger.info(`${method} ${uri}${queryParams} -- STARTED`);
  }

  public logResponse(error: any, response: Response | undefined, body: any | undefined): void {
    let errorMessage: string;
    let infoMessage = '';
    if (typeof response !== 'undefined' && typeof response.request !== 'undefined') {
      if (!this.responseIsLevel200(response.statusCode)) {
        const errorMessage =
          `${response.request.method} ${response.request.href} -- FAILED WITH STATUS: ${response.statusCode}`;
        this.logger.error(errorMessage);
      } else {
        infoMessage = `${response.request.method} ${response.request.href} -- COMPLETED`;
      }
    }
    if (infoMessage !== '') {
      this.logger.info(infoMessage);
    }
    if (error != null) {
      errorMessage = error.message;
      this.logger.error(errorMessage);
    }
  }

  public logError(): void {
    
  }

  private responseIsLevel200(statusCode: number): boolean {
    return (statusCode >= 200 && statusCode <= 299);
  }

  private getQueryParamString(params: any): string {
    if (typeof params === 'undefined') {
      return '';
    }
    if (Object.keys(params).length === 0) {
      return '';
    }
    const queryParms = Object.keys(params).map((k) => {
      return k + '=' + params[k];
    }).join('&');
    return `?${queryParms}`;
  }
}
