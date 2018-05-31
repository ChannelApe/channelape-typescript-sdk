import { Response } from 'request';
import ChannelApeApiError from '../model/ChannelApeApiError';

export default class ChannelApeError extends Error {
  constructor(
    message: string,
    private response: Response,
    private uri: string,
    private apiErrors: ChannelApeApiError[]
  ) {
    super(message);
  }

  public get message(): string {
    const message =
`${this.response.method} ${this.uri}
  Status: ${this.response.statusCode} ${this.response.statusMessage}
  Response:
  ${this.getResponseMessage()}`;
    return message;
  }

  private getResponseMessage(): string {
    const responseMessage = this.message;
    if (this.apiErrors.length > 0) {
      const messageParts = this.apiErrors.map(this.getApiError).join('\n');
    }
    return responseMessage;
  }

  private getApiError(apiError: ChannelApeApiError, index: number): string {
    return `Code: ${apiError.code} Message: ${apiError.message}`;
  }
}
