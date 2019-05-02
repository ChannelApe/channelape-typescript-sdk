import * as Q from 'q';
import OrderActivity from './model/OrderActivity';
import OrderActivityCreateRequestByChannel from './model/OrderActivityCreateRequestByChannel';
import OrderActivityCreateRequestByOrderId from './model/OrderActivityCreateRequestByOrderId';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import RequestClientWrapper from '../../../RequestClientWrapper';
import Resource from '../../../model/Resource';
import Version from '../../../model/Version';
import GenerateApiError from '../../../utils/GenerateApiError';
import OrderActivityCreateRequestByBusiness
  from './model/OrderActivityCreateRequestByBusiness';
import OrdersCrudService from '../OrdersCrudService';

const EXPECTED_CREATE_STATUS = 202;

export default class OrdersActivitiesService {

  constructor(
    private readonly client: RequestClientWrapper,
    private readonly ordersCrudService: OrdersCrudService
  ) { }

  public async create(orderActivityCreateRequest: OrderActivityCreateRequestByChannel): Promise<OrderActivity>;
  public async create(orderActivityCreateRequest: OrderActivityCreateRequestByOrderId): Promise<OrderActivity>;
  public async create(orderActivityCreateRequest: OrderActivityCreateRequestByBusiness): Promise<OrderActivity>;
  public async create(
    orderActivityCreateRequest:
      OrderActivityCreateRequestByChannel &
      OrderActivityCreateRequestByOrderId &
      OrderActivityCreateRequestByBusiness
  ): Promise<OrderActivity> {
    const deferred = Q.defer<OrderActivity>();
    if (orderActivityCreateRequest.businessId && orderActivityCreateRequest.channelOrderId) {
      const order = await this.ordersCrudService.get({
        businessId: orderActivityCreateRequest.businessId,
        channelOrderId: orderActivityCreateRequest.channelOrderId
      });
      if (order.length === 0) {
        deferred.reject(new Error(`Order could not be discerned,
          no orders exist on businessId ${orderActivityCreateRequest.businessId} with channelOrderId of
          ${orderActivityCreateRequest.channelOrderId}`
        ));
        return deferred.promise as any;
      }
      if (order.length > 1) {
        deferred.reject(new Error(`Order could not be discerned,
          ${order.length} orders exist on businessId ${orderActivityCreateRequest.businessId} with channelOrderId of
          ${orderActivityCreateRequest.channelOrderId}`
        ));
        return deferred.promise as any;
      }
      orderActivityCreateRequest.orderId = order[0].id;
    }
    const requestUrl = `${Version.V1}${Resource.ORDERS_ACTIVITY}`;
    const options: AxiosRequestConfig = {
      data: orderActivityCreateRequest
    };
    if (orderActivityCreateRequest.actionId) {
      options.headers = {
        'X-Channel-Ape-Action-Id': orderActivityCreateRequest.actionId
      };
    }
    this.client.post(requestUrl, options, (error, response, body) => {
      this.mapOrderActivityPromise(requestUrl, deferred, error, response, body, EXPECTED_CREATE_STATUS);
    });
    return deferred.promise as any;
  }

  private mapOrderActivityPromise(
    requestUrl: string,
    deferred: Q.Deferred<OrderActivity>,
    error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number
  ) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const orderActivity: OrderActivity = this.formatOrderActivity(body);
      deferred.resolve(orderActivity);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, expectedStatusCode);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private formatOrderActivity(orderActivity: any): OrderActivity {
    orderActivity.completionTime = new Date(orderActivity.completionTime);
    return orderActivity as OrderActivity;
  }
}
