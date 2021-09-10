import RequestClientWrapper from '../../../RequestClientWrapper';
import Resource from '../../../model/Resource';
import Version from '../../../model/Version';
import q = require('q');
import { AxiosResponse } from 'axios';
import GenerateApiError from '../../../utils/GenerateApiError';
import ApiAccount from '../model/ApiAccount';

const EXPECTED_GET_STATUS = 200;

export default class ApiAccountsService {

  constructor(private readonly client: RequestClientWrapper) {}

  public get(businessId: string, apiAccountId: string): Promise<ApiAccount> {
    const deferred = q.defer<ApiAccount>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}/${apiAccountId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapApiAccountPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private mapApiAccountPromise(requestUrl: string, deferred: Q.Deferred<ApiAccount>, error: any,
    response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const apiAccount: ApiAccount = this.formatApiAccount(body);
      deferred.resolve(apiAccount);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private formatApiAccount(apiAccount: any): ApiAccount {
    apiAccount.creationTime = new Date(apiAccount.creationTime);
    apiAccount.lastAccessedTime = new Date(apiAccount.lastAccessedTime);
    return apiAccount as ApiAccount;
  }
}
