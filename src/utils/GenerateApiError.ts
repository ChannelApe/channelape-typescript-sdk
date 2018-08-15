import ChannelApeError from '../model/ChannelApeError';
import ChannelApeApiError from '../model/ChannelApeApiError';
import { AxiosResponse } from 'axios';

export default function generateApiError(url: string, response: AxiosResponse, body: any,
  expectedStatusCode: number): ChannelApeError {
  let thisBody = body;
  if (thisBody === undefined) {
    thisBody = {};
  }
  if (typeof thisBody === 'string') {
    thisBody = {
      body: thisBody,
      errors: []
    };
  }
  if (thisBody.errors === undefined) {
    thisBody.errors = [];
  }
  return new ChannelApeError(
    getErrorMessage(response, expectedStatusCode),
    response,
    url,
    thisBody.errors as ChannelApeApiError[]
  );
}

function getErrorMessage(response: AxiosResponse, expectedStatusCode: number): string {
  return `Expected Status ${expectedStatusCode} but got ${response.status}`;
}
