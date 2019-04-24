import Order from '../model/Order';
import OrderCreateRequest from '../model/OrderCreateRequest';
import OrdersPage from '../model/OrdersPage';
import OrdersQueryRequestByBusinessId from '../model/OrdersQueryRequestByBusinessId';
import OrdersQueryRequestByChannel from '../model/OrdersQueryRequestByChannel';
import OrdersQueryRequestByChannelOrderId from '../model/OrdersQueryRequestByChannelOrderId';
import OrdersActivitiesService from './activities/OrdersActivitiesService';
import RequestClientWrapper from '../../RequestClientWrapper';
import GenericOrdersQueryRequest from './model/GenericOrdersQueryRequest';
import OrdersCrudService from './OrdersCrudService';

export default class OrdersService {
  private ordersCrudService: OrdersCrudService;
  private ordersActivitiesService: OrdersActivitiesService;

  constructor(client: RequestClientWrapper) {
    this.ordersCrudService = new OrdersCrudService(client);
    this.ordersActivitiesService = new OrdersActivitiesService(client, this.ordersCrudService);
  }

  public get Activities(): OrdersActivitiesService {
    return this.ordersActivitiesService;
  }

  public get(orderId: string): Promise<Order>;
  public get(ordersRequestByBusinessId: OrdersQueryRequestByBusinessId): Promise<Order[]>;
  public get(ordersRequestByChannel: OrdersQueryRequestByChannel): Promise<Order[]>;
  public get(ordersRequestByChannelOrderId: OrdersQueryRequestByChannelOrderId): Promise<Order[]>;
  public get(orderIdOrRequest: string | GenericOrdersQueryRequest): Promise<Order> | Promise<Order[]> {
    return this.ordersCrudService.get(orderIdOrRequest as any);
  }

  public getPage(ordersRequestByBusinessId: OrdersQueryRequestByBusinessId): Promise<OrdersPage>;
  public getPage(ordersRequestByChannel: OrdersQueryRequestByChannel): Promise<OrdersPage>;
  public getPage(ordersRequestByChannelOrderId: OrdersQueryRequestByChannelOrderId): Promise<OrdersPage>;
  public getPage(orderRequest: OrdersQueryRequestByBusinessId | OrdersQueryRequestByChannel |
    OrdersQueryRequestByChannelOrderId): Promise<OrdersPage> {
    return this.ordersCrudService.getPage(orderRequest as any);
  }

  public update(order: Order): Promise<Order> {
    return this.ordersCrudService.update(order);
  }

  public create(order: OrderCreateRequest): Promise<Order> {
    return this.ordersCrudService.create(order);
  }
}
