

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

  public get(sessionId: string, actionId: string): Q.Promise<Action> {
    const deferred = Q.defer<Action>();
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}`;
    const options = this.getOptions(sessionId);
    this.client.get(requestUrl, options, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  public updateHealthCheck(sessionId: string, actionId: string): Q.Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.HEALTH_CHECK}`;
    const options = this.getOptions(sessionId);
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, options, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  public complete(sessionId: string, actionId: string): Q.Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.COMPLETE}`;
    const options = this.getOptions(sessionId);
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, options, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  public error(sessionId: string, actionId: string): Q.Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.ERROR}`;
    const options = this.getOptions(sessionId);
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, options, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  private getOptions(sessionId: string): request.CoreOptions {
    return {
      headers: {
        'X-Channel-Ape-Authorization-Token' : sessionId
      }
    };
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
