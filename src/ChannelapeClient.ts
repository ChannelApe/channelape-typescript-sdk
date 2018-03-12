import SessionRetrievalService from './auth/service/SessionRetrievalService';
import SessionRequest from './auth/model/SessionRequest';
import ClientConfiguration from './model/ClientConfiguration';
import { Client } from 'node-rest-client';
import SessionResponse from './auth/model/SessionResponse';
import * as Q from 'q';

export class ChannelapeClient{

  private sessionRetrievalService: SessionRetrievalService;
  
  constructor(private config: ClientConfiguration) {  }

  public getSession() {
    const deferred = Q.defer<SessionResponse>();
    const sessionRequest: SessionRequest = {
      email: this.config.email,
      password: this.config.password
    };

    const client = new Client({ user: sessionRequest.email, password: sessionRequest.password });
    this.sessionRetrievalService = new SessionRetrievalService(client, this.config.endpoint);
    this.sessionRetrievalService.retrieveSession(sessionRequest)
    .then((response: SessionResponse) => {
      deferred.resolve(response);
    })
    .catch((e) => {
      deferred.reject(e);
    });
    return deferred.promise;
  }
}
