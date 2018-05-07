import Order from '../model/Order';
import OrderStatus from '../model/OrderStatus';
import OrdersResponse from '../model/OrdersResponse';
import OrdersRequest from '../model/OrdersRequest';
import OrdersRequestByBusinessId from '../model/OrdersRequestByBusinessId';
import OrdersRequestByChannel from '../model/OrdersRequestByChannel';
import OrdersRequestByChannelOrderId from '../model/OrdersRequestByChannelOrderId';
import QueryUtils from '../../utils/QueryUtils';
import Address from '../model/Address';
import Customer from '../model/Customer';
import LineItem from '../model/LineItem';
import Fulfillment from '../model/Fulfillment';
import FulfillmentStatus from '../model/FulfillmentStatus';
import AdditionalField from '../../model/AdditionalField';
import request = require('request');
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import * as Q from 'q';

const EXPECTED_GET_STATUS: number = 200;
const EXPECTED_UPDATE_STATUS: number = 202;

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
    const deferred = Q.defer<Order[]>();
    this.getOrdersByRequest(orderIdOrRequest, [], deferred);
    return deferred.promise;
  }

  public update(order: Order): Q.Promise<Order> {
    const deferred = Q.defer<Order>();
    const requestUrl = `${Version.V1}${Resource.ORDERS}/${order.id}`;
    const options: request.CoreOptions = {
      body: order
    };
    this.client.put(requestUrl, options, (error, response, body) => {
      this.mapOrderPromise(deferred, error, response, body, EXPECTED_UPDATE_STATUS);
    });
    return deferred.promise;
  }

  private getByOrderId(orderId: string): Q.Promise<Order> {
    const deferred = Q.defer<Order>();
    const requestUrl = `/${Version.V1}${Resource.ORDERS}/${orderId}`;
    this.client.get(requestUrl, (error, response, body) => {
      this.mapOrderPromise(deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise;
  }

  private getOrdersByRequest(ordersRequest: OrdersRequestByBusinessId | OrdersRequestByChannel |
    OrdersRequestByChannelOrderId, orders: Order[], deferred: Q.Deferred<Order[]>): Q.Promise<Order[]> {
    const requestUrl = `/${Version.V1}${Resource.ORDERS}`;
    const ordersQueryParams = ordersRequest as any;
    if (ordersRequest.startDate != null) {
      ordersQueryParams.startDate = QueryUtils.getDateQueryParameter(ordersRequest.startDate);
    }
    if (ordersRequest.endDate != null) {
      ordersQueryParams.endDate = QueryUtils.getDateQueryParameter(ordersRequest.endDate);
    }
    const options: request.CoreOptions = {
      qs: ordersRequest
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      this.mapOrdersPromise(deferred, error, response, body, orders, ordersRequest, EXPECTED_GET_STATUS);
    });
    return deferred.promise;
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

  private mapOrdersPromise(deferred: Q.Deferred<Order[]>, error: any, response: request.Response,
    body: OrdersResponse | ChannelApeErrorResponse, orders: Order[], ordersRequest: OrdersRequestByBusinessId |
      OrdersRequestByChannel | OrdersRequestByChannelOrderId, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === expectedStatusCode) {
      const data: OrdersResponse = body as OrdersResponse;
      const ordersFromThisCall: Order[] = data.orders;
      const mergedOrders: Order[] = orders.concat(ordersFromThisCall);
      if (data.pagination.lastPage) {
        const ordersToReturn = mergedOrders.map(o => this.formatOrder(o));
        deferred.resolve(ordersToReturn);
      } else {
        ordersRequest.lastKey = data.pagination.lastKey;
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
    if (typeof order.canceledAt !== 'undefined') {
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

  private formatFulfillment(fulfillment: any): Fulfillment {
    fulfillment.lineItems = fulfillment.lineItems.map(this.formatLineItem);
    return fulfillment as Fulfillment;
  }

  private formatLineItem(lineItem: any): LineItem {
    lineItem.grams = Number(lineItem.grams);
    lineItem.price = Number(lineItem.price);
    return lineItem as LineItem;
  }
}
