import { AxiosResponse, AxiosRequestConfig } from 'axios';
import * as Q from 'q';

import Resource from '../../model/Resource';
import Version from '../../model/Version';
import RequestClientWrapper from '../../RequestClientWrapper';
import GenerateApiError from '../../utils/GenerateApiError';
import Embed from '../model/Embed';
import Report from '../model/Report';

const EXPECTED_GET_STATUS = 200;
const EXPECTED_POST_STATUS = 201;

export default class AnalyticsService {

  constructor(private readonly client: RequestClientWrapper) { }

  public generateEmbed(embedCode: string, timezone: string): Promise<Embed> {
    return this.getEmbed(embedCode, timezone);
  }

  public get(): Promise<Report[]> {
    return this.getReports();
  }

  private getReports(): Promise<Report[]> {
    const deferred = Q.defer<Report[]>();
    const requestUrl = `/${Version.V1}${Resource.ANALYTICS}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapReportsPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }

  private getEmbed(embedCode: string, timezone: string): Promise<Embed> {
    const deferred = Q.defer<Embed>();
    const embedGenerationRequest = {
      embedCode,
      timezone
    };
    const options: AxiosRequestConfig = {
      data: embedGenerationRequest
    };
    const requestUrl = `/${Version.V2}${Resource.ANALYTICS}`;
    this.client.post(requestUrl, options, (error, response, body) => {
      this.mapEmbedPromise(requestUrl, deferred, error, response, body, EXPECTED_POST_STATUS);
    });
    return deferred.promise as any;
  }

  private mapEmbedPromise(requestUrl: string, deferred: Q.Deferred<Embed>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const embed: Embed = this.formatEmbed(body);
      deferred.resolve(embed);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_POST_STATUS);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private mapReportsPromise(requestUrl: string, deferred: Q.Deferred<Report[]>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (body.errors.length > 0) {
      deferred.reject(body.errors);
    } else if (response.status === expectedStatusCode) {
      deferred.resolve(body.reports);
    } else {
      const channelApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_POST_STATUS);
      deferred.reject(channelApeErrorResponse);
    }
  }

  private formatEmbed(embed: any): Embed {
    embed.expiration = new Date(embed.expiration);
    return embed as Embed;
  }
}
