import Order from '../model/Order';
import OrderCreateRequest from '../model/OrderCreateRequest';
import OrderUpdateRequest from '../model/OrderUpdateRequest';
import OrdersPage from '../model/OrdersPage';
import OrdersQueryRequest from '../model/OrdersQueryRequest';
import OrdersQueryRequestByBusinessId from '../model/OrdersQueryRequestByBusinessId';
import OrdersQueryRequestByChannel from '../model/OrdersQueryRequestByChannel';
import OrdersQueryRequestByChannelOrderId from '../model/OrdersQueryRequestByChannelOrderId';
import RequestClientWrapper from '../../RequestClientWrapper';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import RequestCallbackParams from '../../model/RequestCallbackParams';
import GenerateApiError from '../../utils/GenerateApiError';
import * as Q from 'q';
import * as Qs from 'qs';
import GenericOrdersQueryRequest from './model/GenericOrdersQueryRequest';
import OrderPatchRequest from '../model/OrderPatchRequest';
import JsonOrderFormatterService from './JsonOrderFormatterService';
import OrdersQueryRequestByPurchaseOrderNumber from '../model/OrdersQueryRequestByPurchaseOrderNumber';

const EXPECTED_GET_STATUS = 200;
const EXPECTED_CREATE_STATUS = 202;
const EXPECTED_UPDATE_STATUS = 202;

export default class OrdersCrudService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(orderId: string): Promise<Order>;
  public get(ordersRequestByBusinessId: OrdersQueryRequestByBusinessId): Promise<Order[]>;
  public get(ordersRequestByChannel: OrdersQueryRequestByChannel): Promise<Order[]>;
  public get(ordersRequestByChannelOrderId: OrdersQueryRequestByChannelOrderId): Promise<Order[]>;
  public get(ordersQueryRequestByPurchaseOrderNumber: OrdersQueryRequestByPurchaseOrderNumber): Promise<Order[]>;
  public get(orderIdOrRequest: string | GenericOrdersQueryRequest): Promise<Order> | Promise<Order[]> {
    if (typeof orderIdOrRequest === 'string') {
      return this.getByOrderId(orderIdOrRequest);
    }
    const deferred: Q.Deferred<Order[]> = Q.defer<Order[]>();
    const getSinglePage = false;
    this.getOrdersByRequest(orderIdOrRequest, [], deferred, getSinglePage);
    return deferred.promise as any;
  }

  public getPage(ordersRequestByBusinessId: OrdersQueryRequestByBusinessId): Promise<OrdersPage>;
  public getPage(ordersRequestByChannel: OrdersQueryRequestByChannel): Promise<OrdersPage>;
  public getPage(ordersRequestByChannelOrderId: OrdersQueryRequestByChannelOrderId): Promise<OrdersPage>;
  public getPage(orderRequest: OrdersQueryRequestByBusinessId | OrdersQueryRequestByChannel |
    OrdersQueryRequestByChannelOrderId): Promise<OrdersPage> {
    const deferred = Q.defer<OrdersPage>();
    const getSinglePage = true;
    this.getOrdersByRequest(orderRequest, [], deferred, getSinglePage);
    return deferred.promise as any;
  }

  public update(order: OrderUpdateRequest): Promise<Order> {
    const deferred = Q.defer<Order>();
    const requestUrl = `${Version.V1}${Resource.ORDERS}/${order.id}`;
    const options: AxiosRequestConfig = {
      data: order
    };
    if (order.actionId) {
      options.headers = {
        'X-Channel-Ape-Action-Id': order.actionId
      };
    }
    this.client.put(requestUrl, options, (error, response, body) => {
      this.mapOrderPromise(requestUrl, deferred, error, response, body, EXPECTED_UPDATE_STATUS);
    });
    return deferred.promise as any;
  }

  public patch(order: OrderPatchRequest): Promise<Order> {
    const deferred = Q.defer<Order>();
    const requestUrl = `${Version.V1}${Resource.ORDERS}/${order.id}`;
    const options: AxiosRequestConfig = {
      data: order
    };
    if (order.actionId) {
      options.headers = {
        'X-Channel-Ape-Action-Id': order.actionId
      };
    }
    this.client.patch(requestUrl, options, (error, response, body) => {
      this.mapOrderPromise(requestUrl, deferred, error, response, body, EXPECTED_UPDATE_STATUS);
    });
    return deferred.promise as any;
  }

  public create(order: OrderCreateRequest): Promise<Order> {
    const deferred = Q.defer<Order>();
    const requestUrl = `${Version.V1}${Resource.ORDERS}`;
    const options: AxiosRequestConfig = {
      data: order
    };
    if (order.actionId) {
      options.headers = {
        'X-Channel-Ape-Action-Id': order.actionId
      };
    }
    this.client.post(requestUrl, options, (error, response, body) => {
      this.mapOrderPromise(requestUrl, deferred, error, response, body, EXPECTED_CREATE_STATUS);
    });
    return deferred.promise as any;
  }

  private getByOrderId(orderId: string): Promise<Order> {
    const deferred = Q.defer<Order>();
    const requestUrl = `/${Version.V1}${Resource.ORDERS}/${orderId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapOrderPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private getOrdersByRequest(ordersRequest: OrdersQueryRequestByBusinessId | OrdersQueryRequestByChannel |
    OrdersQueryRequestByChannelOrderId | OrdersQueryRequestByPurchaseOrderNumber,
    orders: Order[], deferred: Q.Deferred<any>, getSinglePage: boolean): void {
    const requestUrl = `/${Version.V1}${Resource.ORDERS}`;
    const ordersQueryParams = ordersRequest as any;
    if (ordersQueryParams.startDate != null && typeof ordersQueryParams.startDate !== 'string') {
      ordersQueryParams.startDate = ordersQueryParams.startDate.toISOString();
    }
    if (ordersQueryParams.endDate != null && typeof ordersQueryParams.endDate !== 'string') {
      ordersQueryParams.endDate = ordersQueryParams.endDate.toISOString();
    }
    if (ordersQueryParams.updatedAtStartDate != null && typeof ordersQueryParams.updatedAtStartDate !== 'string') {
      ordersQueryParams.updatedAtStartDate = ordersQueryParams.updatedAtStartDate.toISOString();
    }
    if (ordersQueryParams.updatedAtEndDate != null && typeof ordersQueryParams.updatedAtEndDate !== 'string') {
      ordersQueryParams.updatedAtEndDate = ordersQueryParams.updatedAtEndDate.toISOString();
    }

    const options: AxiosRequestConfig = {
      params: ordersQueryParams,
      paramsSerializer: this.paramsSerializer
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      const requestResponse: RequestCallbackParams = {
        error,
        response,
        body
      };
      this.mapOrdersPromise(requestUrl, deferred, requestResponse, orders, ordersRequest, EXPECTED_GET_STATUS,
          getSinglePage);
    });
  }

  private mapOrderPromise(requestUrl: string, deferred: Q.Deferred<Order>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const order: Order = JsonOrderFormatterService.formatOrder(body);
      deferred.resolve(order);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapOrdersPromise(
    requestUrl: string,
    deferred: Q.Deferred<any>, requestCallbackParams: RequestCallbackParams,
    orders: Order[],
    ordersRequest: GenericOrdersQueryRequest | (OrdersQueryRequestByChannelOrderId & OrdersQueryRequest),
    expectedStatusCode: number,
    getSinglePage: boolean
  ): void {
    if (requestCallbackParams.error) {
      deferred.reject(requestCallbackParams.error);
    } else if (requestCallbackParams.response.status === expectedStatusCode) {
      const data: OrdersPage = requestCallbackParams.body as OrdersPage;
      const mergedOrders: Order[] = orders.concat(data.orders);
      if (getSinglePage) {
        deferred.resolve({
          orders: mergedOrders.map(o => JsonOrderFormatterService.formatOrder(o)),
          pagination: data.pagination
        });
      } else if (data.pagination.lastPage) {
        const ordersToReturn = mergedOrders.map(o => JsonOrderFormatterService.formatOrder(o));
        deferred.resolve(ordersToReturn);
      } else {
        const newOrdersRequest: GenericOrdersQueryRequest |
          (OrdersQueryRequestByChannelOrderId & OrdersQueryRequest) = {
            ...ordersRequest,
            lastKey: data.pagination.lastKey
          };
        this.getOrdersByRequest(newOrdersRequest, mergedOrders, deferred, getSinglePage);
      }
    } else {
      const channelApeErrorResponse =
        GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private paramsSerializer(params: any): string {
    // Remove brackets from duplicate query parameters
    // e.g. ?foo[]=5&foo[]=2 becomes ?foo=5&foo=2
    return Qs.stringify(params, { arrayFormat: 'repeat' });
  }
}
