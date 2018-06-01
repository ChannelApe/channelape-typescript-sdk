import * as request from 'request';
import * as Q from 'q';
import RequestClientWrapper from './RequestClientWrapper';
import ClientConfiguration from './model/ClientConfiguration';
import SessionsService from './sessions/service/SessionsService';
import ActionsService from './actions/service/ActionsService';
import Session from './sessions/model/Session';
import Action from './actions/model/Action';
import { LogLevel } from 'channelape-logger';
import { Environment } from '.';
import ChannelsService from './channels/service/ChannelsService';
import OrdersService from './orders/service/OrdersService';

const INVALID_CONFIGURATION_ERROR_MESSAGE = 'Invalid configuration. sessionId is required.';
export default class ChannelApeClient {

  private readonly sessionId: string;
  private readonly timeout: number;
  private readonly endpoint: string;
  private readonly logLevel: LogLevel;
  private readonly requestClientWrapper: RequestClientWrapper;
  private readonly actionsService: ActionsService;
  private readonly channelsService: ChannelsService;
  private readonly ordersService: OrdersService;

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
    this.requestClientWrapper = new RequestClientWrapper(client, this.logLevel, this.endpoint);
    this.actionsService = new ActionsService(this.requestClientWrapper);
    this.channelsService = new ChannelsService(this.requestClientWrapper);
    this.ordersService = new OrdersService(this.requestClientWrapper);
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

  channels(): ChannelsService {
    return this.channelsService;
  }

  actions(): ActionsService {
    return this.actionsService;
  }

  orders(): OrdersService {
    return this.ordersService;
  }
}
