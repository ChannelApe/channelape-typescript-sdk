import RequestClientWrapper from '../../RequestClientWrapper';
import Version from '../../model/Version';
import Resource from '../../model/Resource';
import { AxiosResponse } from 'axios';
import GenerateApiError from '../../utils/GenerateApiError';
import * as Q from 'q';
import Schedule from '../model/Schedule';

const EXPECTED_GET_STATUS = 200;
export default class SchedulesService {
  constructor(
      private readonly client: RequestClientWrapper
    ) { }
  public get(scheduleId: string): Promise<Schedule> {
    const deferred = Q.defer<Schedule>();
    const requestUrl = `/${Version.V1}${Resource.SCHEDULES}/${scheduleId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapSchedulePromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }
  public getAll(businessId: string): Promise<Schedule[]> {
    const deferred = Q.defer<Schedule[]>();
    const requestUrl = `/${Version.V1}${Resource.SCHEDULES}?businessId=${businessId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapSchedulesPromise(requestUrl, deferred, error, response, body, EXPECTED_GET_STATUS);
    });
    return deferred.promise as any;
  }
  private mapSchedulePromise(requestUrl: string, deferred: Q.Deferred<Schedule>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const schedule: Schedule = body;
      deferred.resolve(schedule);
    } else {
      const scheduleApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(scheduleApeErrorResponse);
    }
  }
  private mapSchedulesPromise(requestUrl: string, deferred: Q.Deferred<Schedule[]>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const schedules: Schedule[] = body.schedules;
      deferred.resolve(schedules);
    } else {
      const scheduleApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(scheduleApeErrorResponse);
    }
  }
}
