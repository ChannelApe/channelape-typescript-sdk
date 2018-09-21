import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as Q from 'q';

import Resource from '../../model/Resource';
import Channel from '../model/Channel';
import Version from '../../model/Version';
import RequestClientWrapper from '../../RequestClientWrapper';
import ChannelsQueryRequestByBusinessId from '../model/ChannelsQueryRequestByBusinessId';
import RequestCallbackParams from '../../model/RequestCallbackParams';
import ChannelsResponse from '../model/ChannelsResponse';
import GenerateApiError from '../../utils/GenerateApiError';

const EXPECTED_GET_STATUS = 200;

export default class ChannelsService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(channelId: string): Promise<Channel>;
  public get(channelsQueryRequestByBusinessId: ChannelsQueryRequestByBusinessId): Promise<ChannelsResponse>;
  public get(channelIdOrRequest: string | ChannelsQueryRequestByBusinessId):
    Promise<Channel> | Promise<ChannelsResponse> {
    if (typeof channelIdOrRequest === 'string') {
      return this.getChannelById(channelIdOrRequest);
    }
    return this.getChannelsByRequest(channelIdOrRequest);
  }

  private getChannelById(channelId: string): Promise<Channel> {
    const deferred = Q.defer<Channel>();
    const requestUrl = `/${Version.V1}${Resource.CHANNELS}/${channelId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapChannelPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private getChannelsByRequest(channelsRequest: ChannelsQueryRequestByBusinessId): Promise<ChannelsResponse> {
    return new Promise((resolve) => {
      const requestUrl = `/${Version.V1}${Resource.CHANNELS}`;
      const options: AxiosRequestConfig = {
        params: channelsRequest
      };
      this.client.get(requestUrl, options, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body
        };
        resolve(this.mapChannelsPromise(requestUrl, requestResponse, EXPECTED_GET_STATUS));
      });
    });
  }

  private mapChannelPromise(requestUrl: string, deferred: Q.Deferred<Channel>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const channel: Channel = this.formatChannel(body);
      deferred.resolve(channel);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapChannelsPromise(
    requestUrl: string,
    requestCallbackParams: RequestCallbackParams,
    expectedStatusCode: number
  ): Promise<ChannelsResponse> {
    return new Promise((resolve, reject) => {
      if (requestCallbackParams.error) {
        reject(requestCallbackParams.error);
      } else if (requestCallbackParams.response.status === expectedStatusCode) {
        const data: ChannelsResponse = requestCallbackParams.body as ChannelsResponse;
        resolve({
          channels: data.channels.map(channel => this.formatChannel(channel)),
          errors: data.errors
        });
      } else {
        const channelApeErrorResponse =
          GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body,
              EXPECTED_GET_STATUS);
        reject(channelApeErrorResponse);
      }
    });
  }

  private formatChannel(channel: any): Channel {
    channel.createdAt = new Date(channel.createdAt);
    channel.updatedAt = new Date(channel.updatedAt);
    return channel as Channel;
  }
}
