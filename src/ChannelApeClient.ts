import LogLevel from './model/LogLevel';
import RequestClientWrapper from './RequestClientWrapper';
import ActionsService from './actions/service/ActionsService';
import ChannelsService from './channels/service/ChannelsService';
import ClientConfiguration from './model/ClientConfiguration';
import OrdersService from './orders/service/OrdersService';
import VariantsService from './variants/service/VariantsService';
import BusinessesService from './businesses/service/BusinessesService';
import Environment from './model/Environment';
import SessionsService from './sessions/service/SessionsService';
import SubscriptionsService from './subscriptions/service/SubscriptionsService';
import AnalyticsService from './analytics/service/AnalyticsService';
import SuppliersService from './suppliers/service/SuppliersService';
import ProductFiltersService from './products/filters/service/ProductFiltersService';
import UsersService from './users/service/UsersService';
import InventoriesService from './inventories/service/InventoriesService';
import LocationsService from './locations/service/LocationsService';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';
import * as https from 'https';
import * as http from 'http';

const MISSING_SESSION_ID_ERROR_MESSAGE = 'sessionId is required.';
const MINIMUM_REQUEST_RETRY_RANDOM_DELAY_TOO_SMALL_ERROR_MESSAGE =
  'minimumRequestRetryRandomDelay must be 1000 or greater';
const MAXIMUM_REQUEST_RETRY_RANDOM_DELAY_TOO_SMALL_ERROR_MESSAGE =
  'maximumRequestRetryRandomDelay must be 2000 or greater';
const MINIMUM_REQUEST_RETRY_RANDOM_DELAY_GREATER_THAN_MAXIMUM_REQUEST_RETRY_RANDOM_ERROR_MESSAGE =
  'minimumRequestRetryRandomDelay cannot be greater than maximumRequestRetryRandomDelay';
const MAXIMUM_CONCURRENT_CONNECTIONS_MINIMUM_VALUE_MESSAGE =
  'maximumConcurrentConnections must be 1 or greater';
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
  private readonly maximumConcurrentConnections: number;
  private readonly endpoint: string;
  private readonly logLevel: LogLevel;
  private readonly requestClientWrapper: RequestClientWrapper;
  private readonly actionsService: ActionsService;
  private readonly channelsService: ChannelsService;
  private readonly suppliersService: SuppliersService;
  private readonly ordersService: OrdersService;
  private readonly variantsService: VariantsService;
  private readonly businessesService: BusinessesService;
  private readonly sessionsService: SessionsService;
  private readonly subscriptionsService: SubscriptionsService;
  private readonly analyticsService: AnalyticsService;
  private readonly productFiltersService: ProductFiltersService;
  private readonly usersService: UsersService;
  private readonly inventoriesService: InventoriesService;
  private readonly locationsService: LocationsService;

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
    this.maximumConcurrentConnections =
      clientConfiguration.maximumConcurrentConnections ?
      clientConfiguration.maximumConcurrentConnections : 5;
    const httpAgent = new http.Agent(
      { keepAlive: true, maxSockets: this.maximumConcurrentConnections });
    const httpsAgent = new https.Agent(
      { keepAlive: true, maxSockets: this.maximumConcurrentConnections });
    const axiosInstance = axios.create({
      httpAgent,
      httpsAgent
    });

    this.requestClientWrapper = new RequestClientWrapper({
      timeout: this.timeout,
      session: this.sessionId,
      logLevel: this.logLevel,
      endpoint: this.endpoint,
      maximumRequestRetryTimeout: this.maximumRequestRetryTimeout,
      minimumRequestRetryRandomDelay: this.minimumRequestRetryRandomDelay,
      maximumRequestRetryRandomDelay: this.maximumRequestRetryRandomDelay,
      maximumConcurrentConnections: this.maximumConcurrentConnections
    }, axiosInstance);
    this.actionsService = new ActionsService(this.requestClientWrapper);
    this.channelsService = new ChannelsService(this.requestClientWrapper);
    this.suppliersService = new SuppliersService(this.requestClientWrapper);
    this.ordersService = new OrdersService(this.requestClientWrapper);
    this.variantsService = new VariantsService(this.requestClientWrapper);
    this.businessesService = new BusinessesService(this.requestClientWrapper);
    this.sessionsService = new SessionsService(this.requestClientWrapper);
    this.subscriptionsService = new SubscriptionsService(this.requestClientWrapper);
    this.analyticsService = new AnalyticsService(this.requestClientWrapper);
    this.productFiltersService = new ProductFiltersService(this.requestClientWrapper);
    this.usersService = new UsersService(this.requestClientWrapper);
    this.inventoriesService = new InventoriesService(this.requestClientWrapper);
    this.locationsService = new LocationsService(this.requestClientWrapper);
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

  get MaximumConcurrentConnections(): number {
    return this.maximumConcurrentConnections;
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

  suppliers(): SuppliersService {
    return this.suppliersService;
  }

  actions(): ActionsService {
    return this.actionsService;
  }

  orders(): OrdersService {
    return this.ordersService;
  }

  variants(): VariantsService {
    return this.variantsService;
  }

  businesses(): BusinessesService {
    return this.businessesService;
  }

  sessions(): SessionsService {
    return this.sessionsService;
  }

  subscriptions(): SubscriptionsService {
    return this.subscriptionsService;
  }

  analytics(): AnalyticsService {
    return this.analyticsService;
  }

  productFilters(): ProductFiltersService {
    return this.productFiltersService;
  }

  users(): UsersService {
    return this.usersService;
  }

  inventories(): InventoriesService {
    return this.inventoriesService;
  }

  locations(): LocationsService {
    return this.locationsService;
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
        clientConfiguration.maximumRequestRetryRandomDelay < TWO_SECONDS_IN_MS) {
      errors.push(MAXIMUM_REQUEST_RETRY_RANDOM_DELAY_TOO_SMALL_ERROR_MESSAGE);
    }
    if (clientConfiguration.maximumRequestRetryRandomDelay && clientConfiguration.minimumRequestRetryRandomDelay &&
        clientConfiguration.minimumRequestRetryRandomDelay > clientConfiguration.maximumRequestRetryRandomDelay) {
      errors.push(MINIMUM_REQUEST_RETRY_RANDOM_DELAY_GREATER_THAN_MAXIMUM_REQUEST_RETRY_RANDOM_ERROR_MESSAGE);
    }
    if (clientConfiguration.maximumConcurrentConnections &&
        clientConfiguration.maximumConcurrentConnections < 1) {
      errors.push(MAXIMUM_CONCURRENT_CONNECTIONS_MINIMUM_VALUE_MESSAGE);
    }
    if (errors.length > 0) {
      return errors.join('\n');
    }
    return undefined;
  }
}
