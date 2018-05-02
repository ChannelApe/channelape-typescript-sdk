import request = require('request');
import * as Q from 'q';
import ClientConfiguration from './model/ClientConfiguration';
import SessionsService from './sessions/service/SessionsService';
import ActionsService from './actions/service/ActionsService';
import Session from './sessions/model/Session';
import Action from './actions/model/Action';
import { Environment } from '.';
import ChannelsService from './channels/service/ChannelsService';

const INVALID_CONFIGURATION_ERROR_MESSAGE = 'Invalid configuration. sessionId is required.';
export default class ChannelApeClient {

  private readonly sessionId: string;
  private readonly timeout: number;
  private readonly endpoint: string;
  private readonly sessionsService: SessionsService;
  private readonly actionsService: ActionsService;
  private readonly channelsService: ChannelsService;

  constructor(clientConfiguration: ClientConfiguration) {
    if (clientConfiguration.sessionId.length === 0) {
      throw new Error(INVALID_CONFIGURATION_ERROR_MESSAGE);
    }

    this.sessionId = clientConfiguration.sessionId;
    this.endpoint = (clientConfiguration.endpoint == null) ? Environment.PRODUCTION : clientConfiguration.endpoint;
    this.timeout = (clientConfiguration.timeout == null || clientConfiguration.timeout < 2000)
      ? 180000 : clientConfiguration.timeout;

    const client = request.defaults({
      baseUrl: this.endpoint,
      timeout: this.timeout,
      json: true,
      headers: {
        'X-Channel-Ape-Authorization-Token': this.sessionId
      }
    });

    this.sessionsService = new SessionsService(client, this.sessionId);
    this.actionsService = new ActionsService(client);
    this.channelsService = new ChannelsService(client);
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
  
  sessions(): SessionsService {
    return this.sessionsService;
  }
  actions(): ActionsService {
    return this.actionsService;
  }

  channels(): ChannelsService {
    return this.channelsService;
  }

}
