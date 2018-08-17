import LogLevel from './model/LogLevel';
import RequestClientWrapper from './RequestClientWrapper';
import ActionsService from './actions/service/ActionsService';
import ChannelsService from './channels/service/ChannelsService';
import ClientConfiguration from './model/ClientConfiguration';
import OrdersService from './orders/service/OrdersService';
import Environment from './model/Environment';

const INVALID_CONFIGURATION_ERROR_MESSAGE = 'Invalid configuration. sessionId is required.';
const THREE_MINUTES_IN_MS = 180000;
const TWO_SECONDS_IN_MS = 2000;
const JITTER_DELAY_MS_MINIMUM_DEFAULT = 1000;
const JITTER_DELAY_MS_MAXIMUM_DEFAULT = 5000;
export default class ChannelApeClient {

  private readonly sessionId: string;
  private readonly timeout: number;
  private readonly maximumRequestRetryTimeout: number;
  private readonly jitterDelayMsMinimum: number;
  private readonly jitterDelayMsMaximum: number;
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
    this.timeout = (clientConfiguration.timeout == null || clientConfiguration.timeout < TWO_SECONDS_IN_MS)
      ? THREE_MINUTES_IN_MS : clientConfiguration.timeout;
    this.maximumRequestRetryTimeout =
      (clientConfiguration.maximumRequestRetryTimeout == null ||
        clientConfiguration.maximumRequestRetryTimeout < TWO_SECONDS_IN_MS)
        ? THREE_MINUTES_IN_MS : clientConfiguration.maximumRequestRetryTimeout;
    this.logLevel = (clientConfiguration.logLevel == null) ? LogLevel.OFF : clientConfiguration.logLevel;
    this.jitterDelayMsMinimum = (clientConfiguration.jitterDelayMsMinimum == null)
      ? JITTER_DELAY_MS_MINIMUM_DEFAULT : clientConfiguration.jitterDelayMsMinimum;
    this.jitterDelayMsMaximum = (clientConfiguration.jitterDelayMsMaximum == null)
      ? JITTER_DELAY_MS_MAXIMUM_DEFAULT : clientConfiguration.jitterDelayMsMaximum;

    this.requestClientWrapper = new RequestClientWrapper(
      this.timeout,
      this.sessionId,
      this.logLevel,
      this.endpoint,
      this.maximumRequestRetryTimeout,
      this.jitterDelayMsMinimum,
      this.jitterDelayMsMaximum
    );
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

  get MaximumRequestRetryTimeout(): number {
    return this.maximumRequestRetryTimeout;
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
