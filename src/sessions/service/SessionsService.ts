import * as Q from 'q';
import Session from './../model/Session';
import ChannelApeApiErrorResponse from './../../model/ChannelApeApiErrorResponse';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import request = require('request');

export default class SessionsService {

  constructor(private readonly client: request.RequestAPI<request.Request, 
    request.CoreOptions, request.RequiredUriUrl>, private readonly sessionId: string) { }
  get(): Q.Promise<Session> {
    const deferred = Q.defer<Session>();
    const requestUrl = `/${Version.V1}${Resource.SESSIONS}/${this.sessionId}`;

    this.client.get(requestUrl, (error, response, body) => {
      if (error) {
        deferred.reject(error);
      } else if (response.statusCode === 200) {
        deferred.resolve(body as Session);
      } else {
        const channelApeApiErrorResponse = body as ChannelApeApiErrorResponse;
        channelApeApiErrorResponse.statusCode = response.statusCode;
        deferred.reject(channelApeApiErrorResponse);
      }
    });
    return deferred.promise;
  }

}
