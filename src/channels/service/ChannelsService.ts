import * as request from 'request';
import Resource from '../../model/Resource';
import Channel from '../model/Channel';
import Version from '../../model/Version';
import ChannelApeErrorResponse from './../../model/ChannelApeErrorResponse';
import RequestClientWrapper from '../../RequestClientWrapper';
import * as Q from 'q';

export default class ChannelsService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(channelId: string): Q.Promise<Channel> {
    const deferred = Q.defer<Channel>();
    const requestUrl = `/${Version.V1}${Resource.CHANNELS}/${channelId}`;
    this.client.get(requestUrl, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  private mapPromise(deferred: Q.Deferred<Channel>, error: any, response: request.Response, body : any) {
    if (error) {
      deferred.reject(error);
    } else if (response.statusCode === 200) {
      const channel = body as Channel;
      channel.createdAt = new Date(body.createdAt);
      channel.updatedAt = new Date(body.updatedAt);
      deferred.resolve(channel);
    } else {
      const channelApeErrorResponse = body as ChannelApeErrorResponse;
      channelApeErrorResponse.statusCode = response.statusCode;
      deferred.reject(channelApeErrorResponse);
    }
  }
}
