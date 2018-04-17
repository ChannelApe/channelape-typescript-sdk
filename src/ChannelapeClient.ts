import SessionRetrievalService from './auth/service/SessionRetrievalService';
import CredentialSessionRequest from './auth/model/CredentialSessionRequest';
import ClientConfiguration from './../src/model/ClientConfiguration';
import { Client } from 'node-rest-client';
import SessionResponse from './auth/model/SessionResponse';
import * as Q from 'q';
import SessionIdSessionRequest from './auth/model/SessionIdSessionRequest';

const INVALID_CONFIGURATION_ERROR_MESSAGE = 'Invalid configuration. email and password or session ID is required.';
export default class ChannelapeClient {

  constructor(private config: ClientConfiguration) {  }

  getSession() {
    const deferred = Q.defer<SessionResponse>();

    if (this.config.hasCredentials()) {
      const sessionRequest: CredentialSessionRequest = {
        email: this.config.Email,
        password: this.config.Password
      };
      const client = new Client({ user: sessionRequest.email, password: sessionRequest.password });
      const sessionRetrievalService = new SessionRetrievalService(client, this.config.Endpoint);
      sessionRetrievalService.retrieveSession(sessionRequest)
      .then((response: SessionResponse) => {
        deferred.resolve(response);
      })
      .catch((e) => {
        deferred.reject(e);
      });
    } else if (this.config.hasSession()) {
      const sessionRequest: SessionIdSessionRequest = {
        sessionId: this.config.SessionId
      };
      const sessionRetrievalService = new SessionRetrievalService(Client, this.config.Endpoint);
      sessionRetrievalService.retrieveSession(sessionRequest)
      .then((response: SessionResponse) => {
        deferred.resolve(response);
      })
      .catch((e) => {
        deferred.reject(e);
      });
    } else {
      deferred.reject(INVALID_CONFIGURATION_ERROR_MESSAGE);
    }

    return deferred.promise;
  }
  
}
