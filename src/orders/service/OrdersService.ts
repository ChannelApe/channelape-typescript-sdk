import Order from '../model/Order';
import OrdersRequest from '../model/OrdersRequest';
import OrdersRequestByBusinessId from '../model/OrdersRequestByBusinessId';
import OrdersRequestByChannel from '../model/OrdersRequestByChannel';
import OrdersRequestByChannelOrderId from '../model/OrdersRequestByChannelOrderId';
import request = require('request');
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import * as Q from 'q';

export default class OrdersService {

  constructor(private readonly client: request.RequestAPI<request.Request,
    request.CoreOptions, request.RequiredUriUrl>) { }

  public get(orderId: string): Q.Promise<Order>;
  public get(ordersRequestByBusinessId: OrdersRequestByBusinessId): Q.Promise<Order[]>;
  public get(ordersRequestByChannel: OrdersRequestByChannel): Q.Promise<Order[]>;
  public get(ordersRequestByChannelOrderId: OrdersRequestByChannelOrderId): Q.Promise<Order[]>;
  public get(orderIdOrRequest: string | OrdersRequestByBusinessId | OrdersRequestByChannel |
    OrdersRequestByChannelOrderId): Q.Promise<Order> | Q.Promise<Order[]> {
    if (typeof orderIdOrRequest === 'string') {
      return this.getByOrderId(orderIdOrRequest);
    }
    return this.getOrdersByRequest(orderIdOrRequest);
  }

  private getByOrderId(orderId: string): Q.Promise<Order> {
    const deferred = Q.defer<Order>();
    const requestUrl = `/${Version.V1}${Resource.ORDERS}/${orderId}`;
    this.client.get(requestUrl, (error, response, body) => {
      this.mapOrderPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  private getOrdersByRequest(orderRequest: OrdersRequestByBusinessId | OrdersRequestByChannel): Q.Promise<Order[]> {
    const deferred = Q.defer<Order[]>();
    const requestUrl = `/${Version.V1}${Resource.ORDERS}`;
    const options: request.CoreOptions = {
      qs: orderRequest
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      this.mapOrdersPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  private mapOrderPromise(deferred: Q.Deferred<Order>, error: any, response: request.Response, body: any) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === 200) {
      const order: Order = body;
      deferred.resolve(order);
    } else {
      const channelApeErrorResponse = body as ChannelApeErrorResponse;
      channelApeErrorResponse.statusCode = response.statusCode;
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapOrdersPromise(deferred: Q.Deferred<Order[]>, error: any, response: request.Response, body: any) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === 200) {
      const orders: Order[] = body.orders;
      deferred.resolve(orders);
    } else {
      const channelApeErrorResponse = body as ChannelApeErrorResponse;
      channelApeErrorResponse.statusCode = response.statusCode;
      deferred.reject(channelApeErrorResponse);
    }
  }
}
