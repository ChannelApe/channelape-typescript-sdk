import SessionRetrievalService from './auth/service/SessionRetrievalService';
import CredentialSessionRequest from './auth/model/CredentialSessionRequest';
import ClientConfiguration from './model/ClientConfiguration';
import { Client } from 'node-rest-client';
import SessionResponse from './auth/model/SessionResponse';
import * as Q from 'q';
import SessionIdSessionRequest from './auth/model/SessionIdSessionRequest';

export class ChannelapeClient{

  private sessionRetrievalService: SessionRetrievalService;
  
  constructor(private config: ClientConfiguration) {  }

  public getSession() {
    const deferred = Q.defer<SessionResponse>();

    if (this.config.email && this.config.password) {
      const sessionRequest: CredentialSessionRequest = {
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
    }else {
      const sessionRequest: SessionIdSessionRequest = {
        sessionId: this.config.sessionId
      };
      const client = new Client();
      this.sessionRetrievalService = new SessionRetrievalService(client, this.config.endpoint);
      this.sessionRetrievalService.retrieveSession(sessionRequest)
      .then((response: SessionResponse) => {
        deferred.resolve(response);
      })
      .catch((e) => {
        deferred.reject(e);
      });
    }
    

    
    return deferred.promise;
  }
}
