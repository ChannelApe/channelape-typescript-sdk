import RequestClientWrapper from '../../RequestClientWrapper';
import { AxiosResponse } from 'axios';
import * as Q from 'q';
import Version from '../../model/Version';

import Resource from '../../model/Resource';
import Play from '../model/Play';
import GenerateApiError from '../../utils/GenerateApiError';
import StepsService from '../../steps/service/StepsService';
import PlayScheduleConfiguration from '../model/PlayScheduleConfiguration';
import PlayUpdateRequest from '../model/PlayUpdateRequest';
import PlayCreateRequest from '../model/PlayCreateRequest';

const EXPECTED_GET_STATUS = 200;
const EXPECTED_PUT_STATUS = 200;
const EXPECTED_POST_STATUS = 200;

export default class PlaysService {
  constructor(
    private readonly client: RequestClientWrapper,
    private readonly stepsService: StepsService
  ) { }

  public get(playId?: string): Promise<Play | Play[]> {
    const deferred = Q.defer<Play | Play[]>();
    const requestUrl = playId ? `/${Version.V2}${Resource.PLAYS}/${playId}` : `/${Version.V2}${Resource.PLAYS}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapPlayPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }
  public create(play: PlayCreateRequest): Promise<Play> {
    const deferred = Q.defer<Play | Play[]>();
    const requestUrl = `/${Version.V2}${Resource.PLAYS}`;
    this.client.put(requestUrl, { data: play }, (error, response, body) => {
      this.mapPlayPromise(requestUrl, deferred, error, response, body, EXPECTED_POST_STATUS);
    });
    return deferred.promise as any;
  }
  public update(play: PlayUpdateRequest): Promise<Play> {
    const deferred = Q.defer<Play | Play[]>();
    const requestUrl = `/${Version.V2}${Resource.PLAYS}/${play.id}`;
    this.client.put(requestUrl, { data: play }, (error, response, body) => {
      this.mapPlayPromise(requestUrl, deferred, error, response, body, EXPECTED_PUT_STATUS);
    });
    return deferred.promise as any;
  }
  private mapPlayPromise(requestUrl: string, deferred: Q.Deferred<Play | Play[]>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const plays: Play | Play[] = body.plays ? body.plays.map((play:Play) => this. formatPlay(play))
      :  this.formatPlay(body);
      deferred.resolve(plays);
    } else {
      const playApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(playApeErrorResponse);
    }
  }
  private formatPlay(play: any): Play {
    play.createdAt = new Date(play.createdAt);
    play.updatedAt = new Date(play.updatedAt);
    if (play.steps) {
      play.steps = play.steps.map((item: any) => this.stepsService.formatStep(item));
    }
    if (play.scheduleConfigurations) {
      play.scheduleConfigurations = play.scheduleConfigurations.map((item: any) => this.formatPlaySchedule(item));
    }
    return play as Play;
  }

  private formatPlaySchedule(playScheduleConfiguration: any): PlayScheduleConfiguration {
    playScheduleConfiguration.createdAt = new Date(playScheduleConfiguration.createdAt);
    playScheduleConfiguration.updatedAt = new Date(playScheduleConfiguration.updatedAt);
    return playScheduleConfiguration as PlayScheduleConfiguration;
  }

}
