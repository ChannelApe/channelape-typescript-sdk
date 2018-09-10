import LogLevel from './model/LogLevel';
import RequestClientWrapper from './RequestClientWrapper';
import ActionsService from './actions/service/ActionsService';
import ChannelsService from './channels/service/ChannelsService';
import ClientConfiguration from './model/ClientConfiguration';
import OrdersService from './orders/service/OrdersService';
import Environment from './model/Environment';

const MISSING_SESSION_ID_ERROR_MESSAGE = 'sessionId is required.';
const MINIMUM_REQUEST_RETRY_RANDOM_DELAY_TOO_SMALL_ERROR_MESSAGE =
  'minimumRequestRetryRandomDelay must be 1000 or greater';
const MAXIMUM_REQUEST_RETRY_RANDOM_DELAY_TOO_LARGE_ERROR_MESSAGE =
  'maximumRequestRetryRandomDelay must be 5000 or less';
const MINIMUM_REQUEST_RETRY_RANDOM_DELAY_GREATER_THAN_MAXIMUM_REQUEST_RETRY_RANDOM_ERROR_MESSAGE =
  'minimumRequestRetryRandomDelay cannot be greater than maximumRequestRetryRandomDelay';
const THREE_MINUTES_IN_MS = 180000;
const TWO_SECONDS_IN_MS = 2000;
const ONE_SECOND_IN_MS = 1000;
const FIVE_SECONDS_IN_MS = 5000;
export default class ChannelApeClient {

  private readonly sessionId: string;
  private readonly timeout: number;
  private readonly maximumRequestRetryTimeout: number;
  private readonly minimumRequestRetryRandomDelay: number;
  private readonly maximumRequestRetryRandomDelay: number;
  private readonly endpoint: string;
  private readonly logLevel: LogLevel;
  private readonly requestClientWrapper: RequestClientWrapper;
  private readonly actionsService: ActionsService;
  private readonly channelsService: ChannelsService;
  private readonly ordersService: OrdersService;

  constructor(clientConfiguration: ClientConfiguration) {
    const configurationErrors = this.validateConfiguration(clientConfiguration);
    if (configurationErrors !== undefined) {
      throw new Error(`Invalid configuration. ${configurationErrors}`);
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
    this.minimumRequestRetryRandomDelay =
      clientConfiguration.minimumRequestRetryRandomDelay ?
      clientConfiguration.minimumRequestRetryRandomDelay : ONE_SECOND_IN_MS;
    this.maximumRequestRetryRandomDelay =
      clientConfiguration.maximumRequestRetryRandomDelay ?
      clientConfiguration.maximumRequestRetryRandomDelay : FIVE_SECONDS_IN_MS;

    this.requestClientWrapper = new RequestClientWrapper({
      timeout: this.timeout,
      session: this.sessionId,
      logLevel: this.logLevel,
      endpoint: this.endpoint,
      maximumRequestRetryTimeout: this.maximumRequestRetryTimeout,
      jitterDelayMsMinimum: this.minimumRequestRetryRandomDelay,
      jitterDelayMsMaximum: this.maximumRequestRetryRandomDelay
    });
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

  private validateConfiguration(clientConfiguration: ClientConfiguration): string | undefined {
    const errors: string[] = [];
    if (clientConfiguration.sessionId.length === 0) {
      errors.push(MISSING_SESSION_ID_ERROR_MESSAGE);
    }
    if (clientConfiguration.minimumRequestRetryRandomDelay &&
        clientConfiguration.minimumRequestRetryRandomDelay < ONE_SECOND_IN_MS) {
      errors.push(MINIMUM_REQUEST_RETRY_RANDOM_DELAY_TOO_SMALL_ERROR_MESSAGE);
    }
    if (clientConfiguration.maximumRequestRetryRandomDelay &&
        clientConfiguration.maximumRequestRetryRandomDelay > FIVE_SECONDS_IN_MS) {
      errors.push(MAXIMUM_REQUEST_RETRY_RANDOM_DELAY_TOO_LARGE_ERROR_MESSAGE);
    }
    if (clientConfiguration.maximumRequestRetryRandomDelay && clientConfiguration.minimumRequestRetryRandomDelay &&
        clientConfiguration.minimumRequestRetryRandomDelay > clientConfiguration.maximumRequestRetryRandomDelay) {
      errors.push(MINIMUM_REQUEST_RETRY_RANDOM_DELAY_GREATER_THAN_MAXIMUM_REQUEST_RETRY_RANDOM_ERROR_MESSAGE);
    }
    if (errors.length > 0) {
      return errors.join('\n');
    }
    return undefined;
  }
}
