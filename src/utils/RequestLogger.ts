import { Logger, LogLevel } from 'channelape-logger';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import RequestRetryInfo from '../model/RequestRetryInfo';

export default class RequestLogger {
  private readonly logger: Logger;

  constructor (logLevel: LogLevel, private readonly endpoint: string) {
    this.logger = new Logger('ChannelApe API', logLevel);
  }

  public logDelay(callCount: number, delay: number, requestRetryInfo: RequestRetryInfo) {
    const methodAndUrl = `${requestRetryInfo.method} ${this.endpoint}${requestRetryInfo.endpoint}`;
    this.logger.warn(`DELAYING ${methodAndUrl} for ${delay}ms. Delayed ${callCount} times`);
  }

  public logCall(
    method: string,
    url: string,
    options?: AxiosRequestConfig
  ): void {
    let methodToLog: string = '';
    if (typeof method !== 'undefined') {
      methodToLog = method.toUpperCase();
    }
    let uri: string;
    let queryParams = '';
    uri = `${this.endpoint}${url}`;
    if (options !== undefined) {
      queryParams = this.getQueryParamString(options.params);
    }
    this.logger.info(`${methodToLog} ${uri}${queryParams} -- STARTED`);
  }

  public logResponse(error: any, response: AxiosResponse | undefined | null, body: any | undefined): void {
    let errorMessage: string;
    let infoMessage = '';
    if (response != null && typeof response.config !== 'undefined') {
      if (!this.responseIsLevel200(response.status)) {
        const errorMessage =
          `${response.config.method} ${response.config.url} ` +
          `-- FAILED WITH STATUS: ${response.status} and BODY OF: ${JSON.stringify(body)}`;
        this.logger.warn(errorMessage);
      } else {
        infoMessage = `${response.config.method} ${response.config.url} -- COMPLETED`;
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

  public logCallbackError(error: Error): void {
    this.logger.error(`Your callback threw the following uncaught error: ${error}`);
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
    const queryParams = Object.keys(params).map((k) => {
      return `${k}=${params[k]}`;
    }).join('&');
    return `?${queryParams}`;
  }
}
