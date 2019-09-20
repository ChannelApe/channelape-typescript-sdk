import { AxiosResponse } from 'axios';
import GenerateApiError from './utils/GenerateApiError';

export default abstract class DalService {

  constructor() { }

  public mapResponseToPromise<T>(
    requestUrl: string,
    deferred: Q.Deferred<T>,
    error: any,
    response: AxiosResponse,
    body: any,
    expectedStatusCode: number
  ): void {
    if (error) {
      throw error;
    } else if (response.status === expectedStatusCode) {
      deferred.resolve(body);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }

}
