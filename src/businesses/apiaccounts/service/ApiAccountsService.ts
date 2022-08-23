import RequestClientWrapper from '../../../RequestClientWrapper';
import Resource from '../../../model/Resource';
import Version from '../../../model/Version';
import q = require('q');
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import GenerateApiError from '../../../utils/GenerateApiError';
import ApiAccount from '../model/ApiAccount';

const EXPECTED_GET_STATUS = 200;
const EXPECTED_POST_STATUS = 201;

export default class ApiAccountsService {

  constructor(private readonly client: RequestClientWrapper) {}

  /**
   * Do Not Use. This is for internal use only
   *
   */
  public getById(apiAccountId: string) {
    const deferred = q.defer<any>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}${Resource.API_ACCOUNTS}`;
    this.client.get(requestUrl, {
      params: {
        apiAccountId
      }
    }, (error, response, body) => {
      this.mapApiAccountPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  public get(businessId: string, apiAccountId?: string): Promise<ApiAccount | ApiAccount[]> {
    if (typeof (apiAccountId) === 'undefined') {
      const deferred = q.defer<any>();
      const requestUrl = `/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}`;
      this.client.get(requestUrl, {}, (error, response, body) => {
        if (apiAccountId) {
          this.mapApiAccountPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
        } else {
          this.mapApiAccountPromises(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
        }
      });
      return deferred.promise as any;
    }
    const deferred = q.defer<ApiAccount>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}/${apiAccountId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapApiAccountPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  public delete(businessId: string, apiAccountId: string): Promise<ApiAccount> {
    const deferred = q.defer<ApiAccount>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}/${apiAccountId}`;
    this.client.delete(requestUrl, {}, (error, response, body) => {
      this.mapApiAccountPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  public create(name: string, businessId: string): Promise<ApiAccount> {
    const deferred = q.defer<ApiAccount>();
    const requestUrl = `/${Version.V1}${Resource.BUSINESSES}/${businessId}${Resource.API_ACCOUNTS}`;
    const options: AxiosRequestConfig = {
      data: {
        name
      }
    };
    this.client.post(requestUrl, options, (error, response, body) => {
      this.mapApiAccountPromise(requestUrl, deferred, error, response, body, EXPECTED_POST_STATUS);
    });
    return deferred.promise as any;
  }

  private mapApiAccountPromise(requestUrl: string, deferred: Q.Deferred<ApiAccount>, error: any,
    response: AxiosResponse,
    body: any, expectedStatusCode: number
  ) {
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

  private mapApiAccountPromises(
    requestUrl: string,
    deferred: Q.Deferred<ApiAccount[]>,
    error: any,
    response: AxiosResponse,
    body: any, expectedStatusCode: number
  ) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const apiAccounts = this.formatApiAccounts(body.apiAccounts);
      deferred.resolve(apiAccounts);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private formatApiAccounts(apiAccounts: ApiAccount[]): ApiAccount[] {
    return apiAccounts.map((apiAccount:ApiAccount) => this.formatApiAccount(apiAccount));
  }

  private formatApiAccount(apiAccount: any): ApiAccount {
    apiAccount.creationTime = apiAccount.creationTime ? new Date(apiAccount.creationTime) : undefined;
    apiAccount.lastAccessedTime = apiAccount.lastAccessedTime ? new Date(apiAccount.lastAccessedTime) : undefined;
    return apiAccount;
  }

}
