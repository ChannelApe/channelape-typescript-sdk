import { AxiosResponse } from 'axios';
import ChannelApeApiError from '../model/ChannelApeApiError';

export default class ChannelApeError extends Error {
  private readonly apiErrors: ChannelApeApiError[];
  private readonly responseStatusCode: number;
  private readonly responseStatusMessage: string;

  constructor(
    message: string,
    response: AxiosResponse | undefined,
    uri: string,
    apiErrors: ChannelApeApiError[]
  ) {
    super(getMessage());
    this.apiErrors = apiErrors;
    if (typeof response === 'undefined') {
      this.responseStatusCode = -1;
      this.responseStatusMessage = 'There was an error with the API';
    } else {
      this.responseStatusCode = response.status == null ? -1 : response.status;
      this.responseStatusMessage = response.statusText == null
        ? 'There was an error with the API' : response.statusText;
    }

    function getMessage(): string {
      let ret = message;
      if (apiErrors.length > 0) {
        const messageParts = apiErrors.map(getApiError).join('\n');
        ret += `\n${messageParts}`;
      }
      let method: string;
      let statusCode: number;
      let statusMessage: string;
      if (typeof response === 'undefined' || response.config === undefined) {
        method = '';
        statusCode = 0;
        statusMessage = '';
      } else {
        method = typeof response.config.method === 'undefined' ? '' : response.config.method;
        statusCode = typeof response.status === 'undefined' ? 0 : response.status;
        statusMessage = typeof response.statusText === 'undefined' ? '' : ` ${response.statusText}`;
      }
      return `${method} ${uri}
  Status: ${statusCode}${statusMessage}
  Response Body:
  ${ret}`;
    }

    function getApiError(apiError: ChannelApeApiError, index: number): string {
      return `Code: ${apiError.code} Message: ${apiError.message}`;
    }
  }

  public get Response(): { statusCode: number, statusMessage: string } {
    return {
      statusCode: this.responseStatusCode,
      statusMessage: this.responseStatusMessage
    };
  }

  public get ApiErrors(): ChannelApeApiError[] {
    return this.apiErrors;
  }
}
