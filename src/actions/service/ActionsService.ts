import Action from '../model/Action';
import ActionsPage from '../model/ActionsPage';
import ActionsQueryRequest from '../model/ActionsQueryRequest';
import * as request from 'request';
import Resource from '../../model/Resource';
import Subresource from '../model/Subresource';
import Version from '../../model/Version';
import ChannelApeApiErrorResponse from './../../model/ChannelApeApiErrorResponse';
import RequestClientWrapper from '../../RequestClientWrapper';
import * as Q from 'q';

export default class ActionsService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(actionId: string): Promise<Action>;
  public get(actionsRequest: ActionsQueryRequest): Promise<Action[]>;
  public get(actionIdOrRequest: string | ActionsQueryRequest): Promise<Action> | Promise<Action[]> {
    if (typeof actionIdOrRequest === 'string') {
      return this.getByActionId(actionIdOrRequest);
    }
    const deferred = Q.defer<Action[]>();
    const getSinglePage = false;
    this.getByRequest(actionIdOrRequest, [], deferred, getSinglePage);
    return deferred.promise as any;
  }

  public getPage(actionRequest: ActionsQueryRequest): Promise<ActionsPage> {
    const deferred = Q.defer<ActionsPage>();
    const getSinglePage = true;
    this.getByRequest(actionRequest, [], deferred, getSinglePage);
    return deferred.promise as any;
  }

  private getByActionId(actionId: string): Promise<Action> {
    const deferred = Q.defer<Action>();
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}`;
    this.client.get(requestUrl, (error, response, body) => {
      this.mapActionPromise(deferred, error, response, body);
    });
    return deferred.promise as any;
  }

  private getByRequest(actionsRequest: ActionsQueryRequest, actions: Action[],
    deferred: Q.Deferred<any>, getSinglePage: boolean): Promise<Action[]> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}`;
    const queryParams = actionsRequest as any;
    if (typeof actionsRequest.startDate !== 'undefined' && typeof actionsRequest.startDate !== 'string') {
      queryParams.startDate = actionsRequest.startDate.toISOString();
    }
    if (typeof actionsRequest.endDate !== 'undefined' && typeof actionsRequest.endDate !== 'string') {
      queryParams.endDate = actionsRequest.endDate.toISOString();
    }
    const options: request.CoreOptions = {
      qs: queryParams
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      this.mapActionsPromise(deferred, error, response, body, actions, actionsRequest, getSinglePage);
    });
    return deferred.promise as any;
  }

  public updateHealthCheck(actionId: string): Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.HEALTH_CHECK}`;
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, (error, response, body) => {
      this.mapActionPromise(deferred, error, response, body);
    });
    return deferred.promise as any;
  }

  public complete(actionId: string): Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.COMPLETE}`;
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, (error, response, body) => {
      this.mapActionPromise(deferred, error, response, body);
    });
    return deferred.promise as any;
  }

  public error(actionId: string): Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.ERROR}`;
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, (error, response, body) => {
      this.mapActionPromise(deferred, error, response, body);
    });
    return deferred.promise as any;
  }

  private mapActionPromise(deferred: Q.Deferred<Action>, error: any, response: request.Response, body: any) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === 200) {
      const action = this.formatAction(body);
      deferred.resolve(action);
    } else {
      const channelApeErrorResponse = body as ChannelApeApiErrorResponse;
      channelApeErrorResponse.statusCode = response.statusCode;
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapActionsPromise(deferred: Q.Deferred<Action[] | ActionsPage>,error: any, response: request.Response,
    body: any, actions: Action[], actionsRequest: ActionsQueryRequest, getSinglePage: boolean) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === 200) {
      const actionsFromThisCall: Action[] = body.actions.map(this.formatAction);
      const mergedActions: Action[] = actions.concat(actionsFromThisCall);
      if (getSinglePage) {
        deferred.resolve({
          actions: actionsFromThisCall,
          pagination: body.pagination
        });
      } else if (body.pagination.lastPage) {
        deferred.resolve(mergedActions);
      } else {
        actionsRequest.lastKey = body.pagination.lastKey;
        this.getByRequest(actionsRequest, mergedActions, deferred, getSinglePage);
      }
    } else {
      const channelApeErrorResponse = body as ChannelApeApiErrorResponse;
      channelApeErrorResponse.statusCode = response.statusCode;
      deferred.reject(channelApeErrorResponse);
    }
  }

  private formatAction(actionBody: any): Action {
    const action: Action = actionBody as Action;
    action.lastHealthCheckTime = new Date(actionBody.lastHealthCheckTime);
    action.startTime = new Date(actionBody.startTime);
    if (action.endTime != null) {
      action.endTime = new Date(actionBody.endTime);
    }
    return action;
  }
}
