import RequestClientWrapper from '../../RequestClientWrapper';
import GenerateApiError from '../../utils/GenerateApiError';
import * as Q from 'q';
import Version from '../../model/Version';
import Resource from '../../model/Resource';
import User from '../model/User';
import { AxiosResponse } from 'axios';

export default class UsersService {

  private readonly EXPECTED_GET_STATUS = 200;

  constructor(private readonly client: RequestClientWrapper) { }

  public get(userId: string): Promise<User> {
    const deferred = Q.defer<User>();
    const requestUrl = `/${Version.V1}${Resource.USERS}/${userId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapUserPromise(requestUrl, deferred, error, response, body, this.EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private mapUserPromise(requestUrl: string, deferred: Q.Deferred<User>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      deferred.resolve(body);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, this.EXPECTED_GET_STATUS);
      deferred.reject(channelApeErrorResponse);
    }
  }

}
