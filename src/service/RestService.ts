import { AxiosResponse } from 'axios';
import GenerateApiError from '../utils/GenerateApiError';

export default abstract class RestService {
  constructor() {}

  /**
   * @deprecated This method is deprecated because it uses the legacy Q library.
   * Use {@link mapResponsePromise}
   */
  public mapResponseToPromise<T>(
    requestUrl: string,
    deferred: Q.Deferred<T>,
    error: any,
    response: AxiosResponse,
    body: T,
    expectedStatusCode: number
  ): void {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      deferred.resolve(body as T);
    } else {
      const channelApeErrorResponse = GenerateApiError(
        requestUrl,
        response,
        body,
        expectedStatusCode
      );
      deferred.reject(channelApeErrorResponse);
    }
  }

  /**
   * For mapping the axios callback event into a promise
   */
  public mapResponsePromise<T>(
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void,
    error: any,
    response: any,
    body: any,
    requestUrl: string,
    expectedStatusCode: number
  ) {
    if (error) {
      reject(error);
    } else if (response.status === expectedStatusCode) {
      resolve(body as T);
    } else {
      const channelApeErrorResponse = GenerateApiError(
        requestUrl,
        response,
        body,
        expectedStatusCode
      );
      reject(channelApeErrorResponse);
    }
  }
}
