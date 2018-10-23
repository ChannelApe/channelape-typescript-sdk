import Business from '../model/Business';
import RequestClientWrapper from '../../RequestClientWrapper';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import GenerateApiError from '../../utils/GenerateApiError';
import * as Q from 'q';

const EXPECTED_GET_STATUS = 200;

export default class BusinessesService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(userId: string): Promise<Business[]> {
    const deferred = Q.defer<Business[]>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}`;
    const requestOptions: AxiosRequestConfig = { params: { userId } };
    this.client.get(requestUrl, requestOptions, (error, response, body) => {
      this.mapBusinessesPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private mapBusinessesPromise(requestUrl: string, deferred: Q.Deferred<Business[]>, error: any,
    response: AxiosResponse, body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const businesses: Business[] = body.businesses;
      deferred.resolve(businesses);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }
}
