import * as Q from 'q';
import Session from './../model/Session';
import ChannelApeApiErrorResponse from './../../model/ChannelApeApiErrorResponse';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import RequestClientWrapper from '../../RequestClientWrapper';

export default class SessionsService {

  constructor(private readonly client: RequestClientWrapper, private readonly userId: string) { }

  get(): Q.Promise<Session> {
    const deferred = Q.defer<Session>();
    const requestUrl = `/${Version.V1}${Resource.SESSIONS}/${this.userId}`;

    this.client.get(requestUrl, {}, (error, response, body) => {
      if (error) {
        deferred.reject(error);
      } else if (response.status === 200) {
        deferred.resolve(body as Session);
      } else {
        const channelApeApiErrorResponse = body as ChannelApeApiErrorResponse;
        channelApeApiErrorResponse.statusCode = response.status;
        deferred.reject(channelApeApiErrorResponse);
      }
    });
    return deferred.promise;
  }

}
