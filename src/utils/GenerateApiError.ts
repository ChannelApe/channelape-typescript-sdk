import ChannelApeError from '../model/ChannelApeError';
import ChannelApeApiError from '../model/ChannelApeApiError';
import * as request from 'request';

export default function generateApiError(url: string, response: request.Response, body: any,
  expectedStatusCode: number): ChannelApeError {
  if (body.errors === undefined) {
    body.errors = [];
  }
  return new ChannelApeError(
    getErrorMessage(response, expectedStatusCode),
    response,
    url,
    body.errors as ChannelApeApiError[]
  );
}

function getErrorMessage(response: request.Response, expectedStatusCode: number): string {
  return `Expected Status ${expectedStatusCode} but got ${response.statusCode}`;
}
