import SessionRetrievalService from './auth/service/SessionRetrievalService';
import CredentialSessionRequest from './auth/model/CredentialSessionRequest';
import ClientConfiguration from './model/ClientConfiguration';
import { Client } from 'node-rest-client';
import SessionResponse from './auth/model/SessionResponse';
import * as Q from 'q';
import SessionIdSessionRequest from './auth/model/SessionIdSessionRequest';

export class ChannelapeClient{

  private sessionRetrievalService: SessionRetrievalService;
  
  constructor(private config: ClientConfiguration) { 
    if (!config.endpoint) {
      config.endpoint = 'https://api.channelape.com';
    }
  }

  public getSession() : Promise<SessionResponse> {
    if (this.config.email && this.config.password) {
      const sessionRequest: CredentialSessionRequest = {
        email: this.config.email,
        password: this.config.password
      };
      const client = new Client({ user: sessionRequest.email, password: sessionRequest.password });
      this.sessionRetrievalService = new SessionRetrievalService(client, this.config.endpoint);
      return new Promise((resolve, reject) => {
        
        this.sessionRetrievalService.retrieveSession(sessionRequest)
        .then((response: SessionResponse) => {
          resolve(response);
        })
        .catch((e) => {
          reject(e);
        });
      });
    }

    const sessionRequest: SessionIdSessionRequest = {
      sessionId: this.config.sessionId
    };
    const client = new Client();
    this.sessionRetrievalService = new SessionRetrievalService(client, this.config.endpoint);
    return new Promise((resolve, reject) => {
      this.sessionRetrievalService.retrieveSession(sessionRequest)
      .then((response: SessionResponse) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
    });
  }
}
