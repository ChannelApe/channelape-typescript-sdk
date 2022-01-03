import RequestClientWrapper from '../../RequestClientWrapper';
import { AxiosResponse } from 'axios';
import * as Q from 'q';
import Version from '../../model/Version';

import Resource from '../../model/Resource';
import Play from '../model/Play';
import GenerateApiError from '../../utils/GenerateApiError';
import StepsService from '../../steps/service/StepsService';
import Plays from '../model/Plays';

const EXPECTED_GET_STATUS = 200;

export default class PlaysService {
  constructor(
    private readonly client: RequestClientWrapper,
    private readonly stepsService: StepsService
  ) { }

  public get(playId?: string): Promise<Play | Plays[]> {
    if (typeof(playId) === 'undefined') {
      const deferred = Q.defer<Plays[]>();
      const requestUrl = `/${Version.V2}${Resource.PLAYS}`;
      this.client.get(requestUrl, {}, (error, response, body) => {
        this.mapPlayPromises(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
      });
      return deferred.promise as any;
    }
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
      deferred.resolve(play);
    } else {
      const playApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(playApeErrorResponse);
    }
  }
  private mapPlayPromises(requestUrl: string, deferred: Q.Deferred<Plays[]>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const plays: Plays [] = this.formatPlays(body.plays);
      deferred.resolve(plays);
    } else {
      const playApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(playApeErrorResponse);
    }
  }
  private formatPlays(plays: Plays[]): Plays[] {
    return plays.map((play:Plays) => this.formatAllPlay(play));
  }
  private formatAllPlay(play: Plays): Plays {
    play.createdAt = new Date(play.createdAt);
    play.updatedAt = new Date(play.updatedAt);
    return play as Plays;
  }
  private formatPlay(play: any): Play {
    play.createdAt = new Date(play.createdAt);
    play.updatedAt = new Date(play.updatedAt);
    play.steps = play.steps.map((item: any) => this.stepsService.formatStep(item));
    return play as Play;
  }

}
