import request = require('request');
import * as Q from 'q';
import ClientConfiguration from './model/ClientConfiguration';
import SessionsService from './sessions/service/SessionsService';
import ActionsService from './actions/service/ActionsService';
import Session from './sessions/model/Session';
import Action from './actions/model/Action';
import LogLevel, { getLogLevelName } from './model/LogLevel';
import { Environment } from '.';

const INVALID_CONFIGURATION_ERROR_MESSAGE = 'Invalid configuration. sessionId is required.';
export default class ChannelApeClient {

  private readonly actionsService: ActionsService;
  private readonly sessionId: string;
  private readonly timeout: number;
  private readonly endpoint: string;
  private readonly logLevel: LogLevel;


  constructor(clientConfiguration: ClientConfiguration) {
    if (clientConfiguration.sessionId.length === 0) {
      throw new Error(INVALID_CONFIGURATION_ERROR_MESSAGE);
    }

    this.sessionId = clientConfiguration.sessionId;
    this.endpoint = (clientConfiguration.endpoint == null) ? Environment.PRODUCTION : clientConfiguration.endpoint;
    this.timeout = (clientConfiguration.timeout == null || clientConfiguration.timeout < 2000)
      ? 180000 : clientConfiguration.timeout;
    this.logLevel = (clientConfiguration.logLevel == null) ? LogLevel.OFF : clientConfiguration.logLevel;

    const client = request.defaults({
      baseUrl: this.endpoint,
      timeout: this.timeout,
      json: true,
      headers: {
        'X-Channel-Ape-Authorization-Token': this.sessionId
      }
    });
    this.actionsService = new ActionsService(client);
  }

  get SessionId(): string {
    return this.sessionId;
  }

  get Timeout(): number {
    return this.timeout;
  }

  get Endpoint(): string {
    return this.endpoint;
  }

  get LogLevel(): LogLevel {
    return this.logLevel;
  }

  get LogLevelName(): string {
    return getLogLevelName(this.logLevel);
  }

  actions(): ActionsService {
    return this.actionsService;
  }
}
