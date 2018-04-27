import CredentialSessionRequest from './../model/CredentialSessionRequest';
import * as Q from 'q';
import Session from './../model/Session';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import SessionIdSessionRequest from './../model/SessionIdSessionRequest';
import request = require('request');

export default class SessionsService {

  constructor(private readonly client: request.RequestAPI<request.Request, 
    request.CoreOptions, request.RequiredUriUrl>) { }

  retrieveSession(
    sessionRequest: SessionIdSessionRequest | CredentialSessionRequest) {
    if ((sessionRequest as SessionIdSessionRequest).sessionId != null) {
      return this.retrieveSessionBySessionId((sessionRequest as SessionIdSessionRequest));
    }

    return this.retrieveSessionByCredentials(sessionRequest as CredentialSessionRequest);
  }

  private retrieveSessionByCredentials(
    sessionRequest: CredentialSessionRequest): Q.Promise<Session> {

    const deferred = Q.defer<Session>();
    const requestUrl = `/${Version.V1}${Resource.SESSIONS}`;

    const options: request.CoreOptions = {
      auth: {
        username: sessionRequest.username,
        password: sessionRequest.password
      },
      json: true
    };
    this.client.post(requestUrl, options, (error, response, body) => {
      if (error) {
        deferred.reject(error);
      } else if (response.statusCode === 201) {
        deferred.resolve(body as Session);
      } else {
        const channelApeErrorResponse = body as ChannelApeErrorResponse;
        channelApeErrorResponse.statusCode = response.statusCode;
        deferred.reject(channelApeErrorResponse);
      }
    });

    return deferred.promise;
  }
  private retrieveSessionBySessionId(
    sessionRequest: SessionIdSessionRequest): Q.Promise<Session> {

    const deferred = Q.defer<Session>();
    const requestUrl = `/${Version.V1}${Resource.SESSIONS}/${sessionRequest.sessionId}`;

    const options: request.CoreOptions = {
      json: true
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      if (error) {
        deferred.reject(error);
      } else if (response.statusCode === 200) {
        deferred.resolve(body as Session);
      } else {
        const channelApeErrorResponse = body as ChannelApeErrorResponse;
        channelApeErrorResponse.statusCode = response.statusCode;
        deferred.reject(channelApeErrorResponse);
      }
    });

    return deferred.promise;
  }

}
