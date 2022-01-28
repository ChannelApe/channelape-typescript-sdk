import { AxiosResponse } from 'axios';
import * as Q from 'q';
import ResponseStatus from '../../model/ResponseStatus';

import Resource from '../../model/Resource';
import Version from '../../model/Version';
import RequestClientWrapper from '../../RequestClientWrapper';
import GenerateApiError from '../../utils/GenerateApiError';
import Step from '../model/Step';
import StepCreateRequest from '../model/StepCreateRequest';
import StepUpdateRequest from '../model/StepUpdateRequest';

const EXPECTED_GET_STATUS = 200;

export default class StepsService {

  constructor(private readonly client: RequestClientWrapper) { }

  public get(stepId: string): Promise<Step> {
    const deferred = Q.defer<Step>();
    const requestUrl = `/${Version.V1}${Resource.STEPS}/${stepId}`;
    this.client.get(requestUrl, {}, (error, response, body) => {
      this.mapStepPromise(requestUrl, deferred, error, response, body, ResponseStatus.OK);
    });
    return deferred.promise as any;
  }

  public create(step: StepCreateRequest): Promise<Step> {
    const deferred = Q.defer<Step>();
    const requestUrl = `/${Version.V1}${Resource.STEPS}`;
    this.client.post(requestUrl, { data: step }, (error, response, body) => {
      this.mapStepPromise(requestUrl, deferred, error, response, body, ResponseStatus.CREATED);
    });
    return deferred.promise as any;
  }

  public update(step: StepUpdateRequest): Promise<Step> {
    const deferred = Q.defer<Step>();
    const requestUrl = `/${Version.V1}${Resource.STEPS}/${step.id}`;
    this.client.put(requestUrl, { data: step }, (error, response, body) => {
      this.mapStepPromise(requestUrl, deferred, error, response, body, ResponseStatus.OK);
    });
    return deferred.promise as any;
  }

  public formatStep(step: any): Step {
    step.createdAt = new Date(step.createdAt);
    step.updatedAt = new Date(step.updatedAt);
    return step as Step;
  }

  private mapStepPromise(requestUrl: string, deferred: Q.Deferred<Step>, error: any, response: AxiosResponse,
    body: any, expectedStatusCode: number) {
    if (error) {
      deferred.reject(error);
    } else if (response.status === expectedStatusCode) {
      const step: Step = this.formatStep(body);
      deferred.resolve(step);
    } else {
      const stepApeErrorResponse = GenerateApiError(requestUrl, response, body, EXPECTED_GET_STATUS);
      deferred.reject(stepApeErrorResponse);
    }
  }

}
