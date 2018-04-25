

import  Action from '../model/Action';
import * as log4js from 'log4js';
import request = require('request');
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import * as Q from 'q';
export default class ActionRetrievalService {

  private static readonly LOGGER: log4js.Logger = log4js.getLogger('ActionRetrievalService');
  private FATAL_ERROR_MESSAGE: string = 'FATAL ERROR making restful request to retrieve: ';

  constructor(private readonly client: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>,
        private readonly endpoint: string) { }

  public retrieveAction(sessionId: string, id: string): Q.Promise<Action> {

    ActionRetrievalService.LOGGER.info('Retrieving action with id: ' + id);
    const deferred = Q.defer<Action>();
    const requestUrl = `${this.endpoint}/${Version.V1}${Resource.ACTIONS}/${id}`;
    ActionRetrievalService.LOGGER.debug(`HTTP Request: GET ${requestUrl}`);

    const options : request.CoreOptions = {
      headers: {
        'X-Channel-Ape-Authorization-Token' : sessionId
      }
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      if (error) {
        ActionRetrievalService.LOGGER.error(`${this.FATAL_ERROR_MESSAGE}${error}`);
        deferred.reject(error);
      } else if (response.statusCode === 200) {
        deferred.resolve(body as Action);
      } else {
        const channelApeErrorResponse = body as ChannelApeErrorResponse;
        channelApeErrorResponse.statusCode = response.statusCode;
        deferred.reject(channelApeErrorResponse);
      }
    });

    return deferred.promise;
  }
}
