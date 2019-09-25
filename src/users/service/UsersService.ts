import RequestClientWrapper from '../../RequestClientWrapper';
import * as Q from 'q';
import Version from '../../model/Version';
import Resource from '../../model/Resource';
import User from '../model/User';
import DalService from '../../DalService';

export default class UsersService extends DalService {

  private readonly EXPECTED_GET_STATUS = 200;
  private readonly EXPECTED_POST_STATUS = 201;

  constructor(private readonly client: RequestClientWrapper) {
    super();
  }

  public get(userId: string): Promise<User> {
    const deferred = Q.defer<User>();
    const requestUrl = `/${Version.V1}${Resource.USERS}/${userId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapResponseToPromise(requestUrl, deferred, error, response, body, this.EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  public create(email: string, password: string): Promise<User> {
    const deferred = Q.defer<User>();
    const requestUrl = `/${Version.V1}${Resource.USERS}`;
    const authTokenEncoded = Buffer.from(`${email}:${password}`).toString('base64');
    const options = {
      headers: {
        Authorization: `Basic ${authTokenEncoded}`
      }
    };
    this.client.post(requestUrl, options, (error, response, body) => {
      this.mapResponseToPromise(requestUrl, deferred, error, response, body, this.EXPECTED_POST_STATUS);
    });
    return deferred.promise as any;
  }

  public verify(verficiationToken: string): Promise<void> {
    const deferred = Q.defer<void>();
    const requestUrl = `${Resource.VERIFICATION}/${verficiationToken}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapResponseToPromise(requestUrl, deferred, error, response, body, this.EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

}
