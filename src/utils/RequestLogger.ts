import { AxiosRequestConfig, AxiosResponse } from 'axios';
import RequestRetryInfo from '../model/RequestRetryInfo';

export default class RequestLogger {
  private readonly channelapeLogger: any;
  private logger: any = undefined;

  constructor(logLevel: string, private readonly endpoint: string) {
    try {
      this.channelapeLogger = require('channelape-logger');
    } catch (e) {
      this.channelapeLogger = undefined;
    }
    this.getLogger(logLevel);
  }

  public logDelay(callCount: number, delay: number, requestRetryInfo: RequestRetryInfo) {
    const methodAndUrl = `${requestRetryInfo.method} ${this.endpoint}${requestRetryInfo.endpoint}`;
    if (this.logger !== undefined) {
      this.logger.warn(`DELAYING ${methodAndUrl} for ${delay}ms. Delayed ${callCount} times`);
    }
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
    if (this.logger !== undefined) {
      this.logger.info(`${methodToLog} ${uri}${queryParams} -- STARTED`);
    }
  }

  public logResponse(
    error: any,
    response: AxiosResponse | undefined | null,
    body: any | undefined,
    code?: string | undefined
  ): void {
    let errorMessage: string;
    let infoMessage = '';
    if (code && response) {
      const errorMessage =
        `${response.config.method} ${response.config.url} ` +
        `-- FAILED WITH STATUS: ${code}`;
      if (this.logger !== undefined) {
        this.logger.warn(errorMessage);
      }
    } else if (response != null && typeof response.config !== 'undefined') {
      if (!this.responseIsLevel200(response.status)) {
        const errorMessage =
          `${response.config.method} ${response.config.url} ` +
          `-- FAILED WITH STATUS: ${response.status} and BODY OF: ${JSON.stringify(body)}`;
        if (this.logger !== undefined) {
          this.logger.warn(errorMessage);
        }
      } else {
        infoMessage = `${response.config.method} ${response.config.url} -- COMPLETED`;
      }
    }
    if (infoMessage !== '' && this.logger) {
      this.logger.info(infoMessage);
    }
    if (error != null && this.logger !== undefined) {
      errorMessage = error.message;
      this.logger.error(errorMessage);
    }
  }

  public logCallbackError(error: Error): void {
    if (this.logger !== undefined) {
      this.logger.error(`Your callback threw the following uncaught error: ${error}`);
    }
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

  private getLogger(logLevel: string): void {
    if (this.channelapeLogger !== undefined) {
      this.logger = new this.channelapeLogger.Logger('ChannelApe API', logLevel);
    }
  }
}
