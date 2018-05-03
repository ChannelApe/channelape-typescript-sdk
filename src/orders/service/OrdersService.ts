

import Order from '../model/Order';
import request = require('request');
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import * as Q from 'q';

export default class OrdersService {

  constructor(private readonly client: request.RequestAPI<request.Request,
    request.CoreOptions, request.RequiredUriUrl>) { }

  public get(actionId: string): Q.Promise<Action> {
    const deferred = Q.defer<Action>();
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}`;
    this.client.get(requestUrl, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  private mapOrder(deferred: Q.Deferred<Order>, error: any, response: request.Response, body: any) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === 200) {
      const action = body as Action;
      action.lastHealthCheckTime = new Date(body.lastHealthCheckTime);
      action.startTime = new Date(body.startTime);
      if (action.endTime != null) {
        action.endTime = new Date(body.endTime);
      }
      deferred.resolve(action);
    } else {
      const channelApeErrorResponse = body as ChannelApeErrorResponse;
      channelApeErrorResponse.statusCode = response.statusCode;
      deferred.reject(channelApeErrorResponse);
    }
  }
}
