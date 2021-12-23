import RequestClientWrapper from '../../RequestClientWrapper';
import { AxiosResponse } from 'axios';
import * as Q from 'q';
import Version from '../../model/Version';

import Resource from '../../model/Resource';
import Play from '../model/Play';
import GenerateApiError from '../../utils/GenerateApiError';
import StepsService from '../../steps/service/StepsService';

const EXPECTED_GET_STATUS = 200;

export default class PlaysService {
  constructor(private readonly client: RequestClientWrapper, private readonly stepsService: StepsService) { }

  public get(playId: string): Promise<Play> {
    const deferred = Q.defer<Play>();
    const requestUrl = `/${Version.V1}${Resource.PLAYS}/${playId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapPlayPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }
  private mapPlayPromise(requestUrl: string, deferred: Q.Deferred<Play>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const play: Play = this.formatPlay(body);
      play.steps.map((item)=>{
        item = this.stepsService.formatStep(item);
      });
      deferred.resolve(play);
    } else {
      const playApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(playApeErrorResponse);
    }
  }

  private formatPlay(play: any): Play {
    play.createdAt = new Date(play.createdAt);
    play.updatedAt = new Date(play.updatedAt);
    return play as Play;
  }

}
