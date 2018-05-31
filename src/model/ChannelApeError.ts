import { Response } from 'request';
import ChannelApeApiError from '../model/ChannelApeApiError';

export default class ChannelApeError extends Error {
  private response: Response;
  private apiErrors: ChannelApeApiError[];

  constructor(
    message: string,
    response: Response,
    uri: string,
    apiErrors: ChannelApeApiError[]
  ) {
    super(getMessage());
    this.response = response;
    this.apiErrors = apiErrors;

    function getMessage(): string {
      let ret = message;
      if (apiErrors.length > 0) {
        const messageParts = apiErrors.map(getApiError).join('\n');
        ret += `\n${messageParts}`;
      }
      let method: string;
      let statusCode: number;
      let statusMessage: string;
      if (typeof response === 'undefined') {
        method = '';
        statusCode = 0;
        statusMessage = '';
      } else {
        method = typeof response.method === 'undefined' ? '' : response.method;
        statusCode = typeof response.statusCode === 'undefined' ? 0 : response.statusCode;
        statusMessage = typeof response.statusMessage === 'undefined' ? '' : response.statusMessage;
      }
      const finalMessage =
`${method} ${uri}
  Status: ${statusCode} ${statusMessage}
  Response Body:
  ${ret}`;
      return finalMessage;
    }

    function getApiError(apiError: ChannelApeApiError, index: number): string {
      return `Code: ${apiError.code} Message: ${apiError.message}`;
    }
  }

  public get Response(): Response {
    return this.response;
  }

  public get ApiErrors(): ChannelApeApiError[] {
    return this.apiErrors;
  }
}
