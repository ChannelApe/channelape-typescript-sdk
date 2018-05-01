

import  Action from '../model/Action';
import request = require('request');
import Resource from '../../model/Resource';
import Subresource from '../model/Subresource';
import Version from '../../model/Version';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import * as Q from 'q';

export default class ActionsService {

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

  public updateHealthCheck(actionId: string): Q.Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.HEALTH_CHECK}`;
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  public complete(actionId: string): Q.Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.COMPLETE}`;
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  public error(actionId: string): Q.Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.ERROR}`;
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  private mapPromise(deferred: Q.Deferred<Action>, error: any, response: request.Response, body : any) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === 200) {
      deferred.resolve(body as Action);
    } else {
      const channelApeErrorResponse = body as ChannelApeErrorResponse;
      channelApeErrorResponse.statusCode = response.statusCode;
      deferred.reject(channelApeErrorResponse);
    }
  }
}
