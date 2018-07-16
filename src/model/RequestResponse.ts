import * as request from 'request';

export default interface RequestResponse {
  error: Error;
  response: request.Response | undefined;
  body: any;
}
