import request = require('request');
import * as Q from 'q';
import ClientConfiguration from './model/ClientConfiguration';
import SessionsService from './sessions/service/SessionsService';
import ActionsService from './actions/service/ActionsService';
import Session from './sessions/model/Session';
import Action from './actions/model/Action';

const INVALID_CONFIGURATION_ERROR_MESSAGE = 'Invalid configuration. username and password or session ID is required.';
export default class ChannelapeClient {

  private readonly client : request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>;
  private readonly sessionsService: SessionsService;
  private readonly actionsService: ActionsService;

  constructor(private readonly config: ClientConfiguration) { 
    this.client = request.defaults({
      baseUrl: config.Endpoint,
      timeout: 60000,
      json: true
    });
    this.sessionsService = new SessionsService(this.client);
    this.actionsService = new ActionsService(this.client);
  }

  getSession() {
    if (this.config.hasCredentials()) {
      return this.sessionsService.create(this.config.Username, this.config.Password);
    }

    if (this.config.hasSession()) {
      return this.sessionsService.get(this.config.SessionId);
    } 
      
    const deferred = Q.defer<Session>();
    deferred.reject(INVALID_CONFIGURATION_ERROR_MESSAGE);
    return deferred.promise;
  }

  getAction(actionId: string) {
    return this.getSession().then(session => this.actionsService.get(session.sessionId, actionId));
  }

}
