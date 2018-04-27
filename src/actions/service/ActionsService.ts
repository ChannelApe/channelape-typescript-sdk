

import  Action from '../model/Action';
import request = require('request');
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import * as Q from 'q';
export default class ActionsService {

  constructor(private readonly client: request.RequestAPI<request.Request, 
    request.CoreOptions, request.RequiredUriUrl>) { }

  public retrieveAction(sessionId: string, id: string): Q.Promise<Action> {

    const deferred = Q.defer<Action>();
    const requestUrl = `/${Version.V1}${Resource.ACTIONS}/${id}`;

    const options : request.CoreOptions = {
      headers: {
        'X-Channel-Ape-Authorization-Token' : sessionId
      }
    };
    this.client.get(requestUrl, options, (error, response, body) => {
      if (error) {
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
