import Order from '../model/Order';
import OrderStatus from '../model/OrderStatus';
import Orders from '../model/Orders';
import OrdersQueryRequest from '../model/OrdersQueryRequest';
import OrdersQueryRequestByBusinessId from '../model/OrdersQueryRequestByBusinessId';
import OrdersQueryRequestByChannel from '../model/OrdersQueryRequestByChannel';
import OrdersQueryRequestByChannelOrderId from '../model/OrdersQueryRequestByChannelOrderId';
import SinglePageRequest from '../../../src/model/SinglePageRequest';
import Address from '../model/Address';
import Customer from '../model/Customer';
import LineItem from '../model/LineItem';
import Fulfillment from '../model/Fulfillment';
import FulfillmentStatus from '../model/FulfillmentStatus';
import AdditionalField from '../../model/AdditionalField';
import RequestClientWrapper from '../../RequestClientWrapper';
import * as request from 'request';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import * as Q from 'q';

const EXPECTED_GET_STATUS = 200;
const EXPECTED_UPDATE_STATUS = 202;

export default class OrdersService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(orderId: string):
    Promise<Order>;
  public get(ordersRequestByBusinessId: OrdersQueryRequestByBusinessId):
    Promise<Order[]>;
  public get(ordersRequestByChannel: OrdersQueryRequestByChannel):
    Promise<Order[]>;
  public get(ordersRequestByChannelOrderId: OrdersQueryRequestByChannelOrderId):
    Promise<Order[]>;
  public get(ordersPageRequestByBusinessId: OrdersQueryRequestByBusinessId & SinglePageRequest):
    Promise<Orders>;
  public get(ordersPageRequestByChannel: OrdersQueryRequestByChannel & SinglePageRequest):
    Promise<Orders>;
  public get(ordersPageRequestByChannelOrderId: OrdersQueryRequestByChannelOrderId & SinglePageRequest):
    Promise<Orders>;
  public get(orderIdOrRequest: string | OrdersQueryRequestByBusinessId | OrdersQueryRequestByChannel |
    OrdersQueryRequestByChannelOrderId | OrdersQueryRequestByBusinessId & SinglePageRequest |
    OrdersQueryRequestByChannel & SinglePageRequest | OrdersQueryRequestByChannelOrderId & SinglePageRequest
  ): Promise<Order> | Promise<Order[]> | Promise<Orders> {
    if (typeof orderIdOrRequest === 'string') {
      return this.getByOrderId(orderIdOrRequest);
    }
    const deferred = Q.defer<Order[] | Orders>();
    this.getOrdersByRequest(orderIdOrRequest, [], deferred);
    return deferred.promise as any;
  }

  public update(order: Order): Promise<Order> {
    const deferred = Q.defer<Order>();
    const requestUrl = `${Version.V1}${Resource.ORDERS}/${order.id}`;
    const options: request.CoreOptions = {
      body: order
    };
    this.client.put(requestUrl, options, (error, response, body) => {
      this.mapOrderPromise(deferred, error, response, body, EXPECTED_UPDATE_STATUS);
    });
    return deferred.promise as any;
  }

  private getByOrderId(orderId: string): Promise<Order> {
    const deferred = Q.defer<Order>();
    const requestUrl = `/${Version.V1}${Resource.ORDERS}/${orderId}`;
    this.client.get(requestUrl, (error, response, body) => {
      this.mapOrderPromise(deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private getOrdersByRequest(ordersRequest: OrdersQueryRequestByBusinessId | OrdersQueryRequestByChannel |
    OrdersQueryRequestByChannelOrderId, orders: Order[],
    deferred: Q.Deferred<Order[] | Orders>): Promise<Order[]> {
    const requestUrl = `/${Version.V1}${Resource.ORDERS}`;
    const ordersQueryParams = ordersRequest as any;
    if (ordersRequest.startDate != null && typeof ordersRequest.startDate !== 'string') {
      ordersQueryParams.startDate = ordersRequest.startDate.toISOString();
    }
    if (ordersRequest.endDate != null && typeof ordersRequest.endDate !== 'string') {
      ordersQueryParams.endDate = ordersRequest.endDate.toISOString();
    }
    const options: request.CoreOptions = {
      qs: ordersQueryParams
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      this.mapOrdersPromise(deferred, error, response, body, orders, ordersRequest, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private mapOrderPromise(deferred: Q.Deferred<Order>, error: any, response: request.Response,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === expectedStatusCode) {
      const order: Order = this.formatOrder(body);
      deferred.resolve(order);
    } else {
      const channelApeErrorResponse = body as ChannelApeErrorResponse;
      channelApeErrorResponse.statusCode = response.statusCode;
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapOrdersPromise(deferred: Q.Deferred<Order[] | Orders>,
    error: any, response: request.Response,
    body: Orders | ChannelApeErrorResponse, orders: Order[], ordersRequest: OrdersQueryRequestByBusinessId |
      OrdersQueryRequestByChannel | OrdersQueryRequestByChannelOrderId |
      (OrdersQueryRequestByBusinessId & SinglePageRequest) | (OrdersQueryRequestByChannel & SinglePageRequest) |
      (OrdersQueryRequestByChannelOrderId & SinglePageRequest), expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === expectedStatusCode) {
      const data: Orders = body as Orders;
      const mergedOrders: Order[] = orders.concat(data.orders);
      if (ordersRequest.hasOwnProperty('singlePage')) {
        deferred.resolve({
          orders: mergedOrders.map(o => this.formatOrder(o)),
          pagination: data.pagination
        });
      } else if (data.pagination.lastPage) {
        const ordersToReturn = mergedOrders.map(o => this.formatOrder(o));
        deferred.resolve(ordersToReturn);
      } else {
        this.getOrdersByRequest(ordersRequest, mergedOrders, deferred);
      }
    } else {
      const channelApeErrorResponse = body as ChannelApeErrorResponse;
      channelApeErrorResponse.statusCode = response.statusCode;
      deferred.reject(channelApeErrorResponse);
    }
  }

  private formatOrder(order: any): Order {
    order.purchasedAt = new Date(order.purchasedAt);
    if (order.canceledAt != null) {
      order.canceledAt = new Date(order.canceledAt);
    }
    order.updatedAt = new Date(order.updatedAt);
    order.createdAt = new Date(order.createdAt);
    order.status = order.status as OrderStatus;
    order.totalPrice = Number(order.totalPrice);
    order.subtotalPrice = Number(order.subtotalPrice);
    order.totalShippingPrice = Number(order.totalShippingPrice);
    if (typeof order.totalShippingTax !== 'undefined') {
      order.totalShippingTax = Number(order.totalShippingTax);
    }
    order.totalTax = Number(order.totalTax);
    order.totalGrams = Number(order.totalGrams);
    order.lineItems = order.lineItems.map(this.formatLineItem);
    order.fulfillments = order.fulfillments.map((f: any) => this.formatFulfillment(f));
    return order as Order;
  }

  private formatFulfillment(fulfillment: Fulfillment): Fulfillment {
    fulfillment.lineItems = fulfillment.lineItems.map(this.formatLineItem);
    return fulfillment;
  }

  private formatLineItem(lineItem: LineItem): LineItem {
    lineItem.grams = Number(lineItem.grams);
    lineItem.price = Number(lineItem.price);
    return lineItem;
  }
}
