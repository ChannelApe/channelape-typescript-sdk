import Action from '../model/Action';
import ActionsPage from '../model/ActionsPage';
import ActionsQueryRequest from '../model/ActionsQueryRequest';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Resource from '../../model/Resource';
import Subresource from '../model/Subresource';
import Version from '../../model/Version';
import RequestClientWrapper from '../../RequestClientWrapper';
import RequestCallbackParams from '../../model/RequestCallbackParams';
import GenerateApiError from '../../utils/GenerateApiError';
import * as Q from 'q';

const EXPECTED_STATUS_CODE = 200;

export default class ActionsService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(actionId: string): Promise<Action>;
  public get(actionsRequest: ActionsQueryRequest): Promise<Action[]>;
  public get(actionIdOrRequest: string | ActionsQueryRequest): Promise<Action> | Promise<Action[]> {
    if (typeof actionIdOrRequest === 'string') {
      return this.getByActionId(actionIdOrRequest);
    }
    const deferred = Q.defer<Action[]>();
    const singlePage = false;
    this.getByRequest(actionIdOrRequest, [], deferred, singlePage);
    return deferred.promise as any;
  }

  public getPage(actionRequest: ActionsQueryRequest): Promise<ActionsPage> {
    const deferred = Q.defer<ActionsPage>();
    const singlePage = true;
    this.getByRequest(actionRequest, [], deferred, singlePage);
    return deferred.promise as any;
  }

  private getByActionId(actionId: string): Promise<Action> {
    const deferred = Q.defer<Action>();
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapActionPromise(requestUrl, deferred, error, response, body);
    });
    return deferred.promise as any;
  }

  private getByRequest(actionsRequest: ActionsQueryRequest, actions: Action[],
    deferred: Q.Deferred<any>, singlePage: boolean): Promise<Action[]> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}`;
    const queryParams = actionsRequest as any;
    if (typeof actionsRequest.startDate !== 'undefined' && typeof actionsRequest.startDate !== 'string') {
      queryParams.startDate = actionsRequest.startDate.toISOString();
    }
    if (typeof actionsRequest.endDate !== 'undefined' && typeof actionsRequest.endDate !== 'string') {
      queryParams.endDate = actionsRequest.endDate.toISOString();
    }
    const options: AxiosRequestConfig = {
      params: queryParams
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      const requestCallbackParams = {
        error, response, body
      };
      this.mapActionsPromise(requestUrl, deferred, requestCallbackParams, actions, actionsRequest, singlePage);
    });
    return deferred.promise as any;
  }

  public updateHealthCheck(actionId: string): Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.HEALTH_CHECK}`;
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, {}, (error, response, body) => {
      this.mapActionPromise(requestUrl, deferred, error, response, body);
    });
    return deferred.promise as any;
  }

  public complete(actionId: string): Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.COMPLETE}`;
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, {}, (error, response, body) => {
      this.mapActionPromise(requestUrl, deferred, error, response, body);
    });
    return deferred.promise as any;
  }

  public error(actionId: string): Promise<Action> {
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${actionId}/${Subresource.ERROR}`;
    const deferred = Q.defer<Action>();
    this.client.put(requestUrl, {}, (error, response, body) => {
      this.mapActionPromise(requestUrl, deferred, error, response, body);
    });
    return deferred.promise as any;
  }

  private mapActionPromise(requestUrl: string, deferred: Q.Deferred<Action>, error: any, response: AxiosResponse,
    body: any) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === EXPECTED_STATUS_CODE) {
      const action = this.formatAction(body);
      deferred.resolve(action);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_STATUS_CODE);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapActionsPromise(requestUrl: string, deferred: Q.Deferred<Action[] | ActionsPage>,
    requestCallbackParams: RequestCallbackParams, actions: Action[], actionsRequest: ActionsQueryRequest,
    singlePage: boolean) {
    if (requestCallbackParams.error) {
      deferred.reject(requestCallbackParams.error);
    } else if (requestCallbackParams.response.status === EXPECTED_STATUS_CODE) {
      const actionsFromThisCall: Action[] = requestCallbackParams.body.actions.map(this.formatAction);
      const mergedActions: Action[] = actions.concat(actionsFromThisCall);
      if (singlePage) {
        deferred.resolve({
          actions: actionsFromThisCall,
          pagination: requestCallbackParams.body.pagination
        });
      } else if (requestCallbackParams.body.pagination.lastPage) {
        deferred.resolve(mergedActions);
      } else {
        actionsRequest.lastKey = requestCallbackParams.body.pagination.lastKey;
        this.getByRequest(actionsRequest, mergedActions, deferred, singlePage);
      }
    } else {
      const channelApeErrorResponse =
        GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body, EXPECTED_STATUS_CODE);
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
