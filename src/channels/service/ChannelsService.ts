import Resource from '../../model/Resource';
import Channel from '../model/Channel';
import Version from '../../model/Version';
import ChannelApeApiErrorResponse from './../../model/ChannelApeApiErrorResponse';
import RequestClientWrapper from '../../RequestClientWrapper';
import * as Q from 'q';
import { AxiosResponse } from '../../../node_modules/axios';

export default class ChannelsService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(channelId: string): Q.Promise<Channel> {
    const deferred = Q.defer<Channel>();
    const requestUrl = `/${Version.V1}${Resource.CHANNELS}/${channelId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapPromise(deferred, error, response, body);
    });
    return deferred.promise;
  }

  private mapPromise(deferred: Q.Deferred<Channel>, error: any, response: AxiosResponse, body : any) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === 200) {
      const channel = body as Channel;
      channel.createdAt = new Date(body.createdAt);
      channel.updatedAt = new Date(body.updatedAt);
      deferred.resolve(channel);
    } else {
      const channelApeErrorResponse = body as ChannelApeApiErrorResponse;
      channelApeErrorResponse.statusCode = response.status;
      deferred.reject(channelApeErrorResponse);
    }
  }
}
