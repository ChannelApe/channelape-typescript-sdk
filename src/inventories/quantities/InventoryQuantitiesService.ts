import RestService from './../../../src/service/RestService';
import RequestClientWrapper from './../../RequestClientWrapper';
import Adjustment from './model/Adjustment';
import { AxiosRequestConfig } from 'axios';
import AdjustmentRequest from './model/AdjustmentRequest';
import * as Q from 'q';
import Resource from './../../../src/model/Resource';
import Version from './../../../src/model/Version';
import SubResource from './../../model/SubResource';
import * as uuidV4 from 'uuid/v4';

export default class InventoryQuantitiesService extends RestService {
  EXPECTED_POST_STATUS: number = 201;

  constructor(private readonly client: RequestClientWrapper) {
    super();
  }

  public adjust(adjustmentRequest: AdjustmentRequest): Promise<Adjustment> {
    return this.createQuantityAdjustment(adjustmentRequest, SubResource.ADJUSTS);
  }

  public set(adjustmentRequest: AdjustmentRequest): Promise<Adjustment> {
    return this.createQuantityAdjustment(adjustmentRequest, SubResource.SETS);
  }

  private createQuantityAdjustment(adjustmentRequest: AdjustmentRequest, operation: string) {
    const deferred = Q.defer<Adjustment>();
    const inventoryItemId = adjustmentRequest.inventoryItemId;
    const requestUrl
      = `/${Version.V1}${Resource.INVENTORIES}/${inventoryItemId}/${SubResource.QUANTITIES}/${operation}`;
    let idempotentKey = uuidV4();
    if (adjustmentRequest.idempotentKey) {
      idempotentKey = adjustmentRequest.idempotentKey;
    }
    const options: AxiosRequestConfig = {
      data: adjustmentRequest,
      headers: {
        'X-Channel-Ape-Idempotent-Key': idempotentKey
      }
    };
    this.client.post(requestUrl, options,
      (error, response, body) =>
        this.mapResponseToPromise(requestUrl, deferred, error, response, body, this.EXPECTED_POST_STATUS));
    return deferred.promise as any;
  }
}
