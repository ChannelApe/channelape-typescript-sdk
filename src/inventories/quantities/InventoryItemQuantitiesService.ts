import RestService from '../../service/RestService';
import RequestClientWrapper from '../../RequestClientWrapper';
import Adjustment from './model/Adjustment';
import { AxiosRequestConfig } from 'axios';
import AdjustmentRequest from './model/AdjustmentRequest';
import * as Q from 'q';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import SubResource from '../../model/SubResource';
import * as uuidV4 from 'uuid/v4';
import InventoryItemQuantitiesResponse from './model/InventoryItemQuantitiesResponse';
import InventoryItemQuantity from './model/InventoryItemQuantity';
import RequestCallbackParams from '../../../src/model/RequestCallbackParams';
import GenerateApiError from './../../utils/GenerateApiError';
import { InventoryBatchAdjustmentsService } from './InventoryBatchAdjustmentsService';
import InventoriesService from '../service/InventoriesService';
import LocationsService from '../../locations/service/LocationsService';
import { AdjustmentsBySku } from '../..';

export default class InventoryQuantitiesService extends RestService {
  private EXPECTED_POST_STATUS: number = 201;
  private EXPECTED_GET_STATUS: number = 200;

  private inventoryBatchAdjustmentsService: InventoryBatchAdjustmentsService;

  constructor(
    private readonly client: RequestClientWrapper,
    private readonly inventoriesService: InventoriesService,
    private readonly locationsService: LocationsService
  ) {
    super();
    this.inventoryBatchAdjustmentsService = new InventoryBatchAdjustmentsService(
      this,
      this.inventoriesService,
      this.locationsService
    );
  }

  public adjust(adjustmentRequest: AdjustmentRequest): Promise<Adjustment> {
    return this.createQuantityAdjustment(adjustmentRequest, SubResource.ADJUSTS);
  }

  public adjustBatch(adjustmentsBySku: AdjustmentsBySku[]) {
    return this.inventoryBatchAdjustmentsService.adjustBatch(adjustmentsBySku);
  }

  public setBatch(adjustmentsBySku: AdjustmentsBySku[]) {
    return this.inventoryBatchAdjustmentsService.setBatch(adjustmentsBySku);
  }

  public set(adjustmentRequest: AdjustmentRequest): Promise<Adjustment> {
    return this.createQuantityAdjustment(adjustmentRequest, SubResource.SETS);
  }

  public retrieve(inventoryItemId: string): Promise<InventoryItemQuantity[]> {
    return this.retrieveInventoryItemQuantities(inventoryItemId);
  }

  private retrieveInventoryItemQuantities(inventoryItemId: string)
    : Promise<InventoryItemQuantity[]> {
    return new Promise((resolve) => {
      const requestUrl
        = `/${Version.V1}${Resource.INVENTORIES}/${inventoryItemId}/${SubResource.QUANTITIES}`;
      this.client.get(requestUrl, {}, (error, response, body) => {
        const requestResponse: RequestCallbackParams = {
          error,
          response,
          body
        };
        resolve(this.mapInventoryItemsQuantitiesPromise(requestUrl, requestResponse, this.EXPECTED_GET_STATUS));
      });
    });
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

  private mapInventoryItemsQuantitiesPromise(
    requestUrl: string,
    requestCallbackParams: RequestCallbackParams,
    expectedStatusCode: number
  ): Promise<InventoryItemQuantity[]> {
    return new Promise((resolve, reject) => {
      if (requestCallbackParams.error) {
        reject(requestCallbackParams.error);
      } else if (requestCallbackParams.response.status === expectedStatusCode) {
        const data: InventoryItemQuantitiesResponse = requestCallbackParams.body as InventoryItemQuantitiesResponse;
        resolve(data.quantities);
      } else {
        const channelApeErrorResponse =
          GenerateApiError(requestUrl, requestCallbackParams.response, requestCallbackParams.body,
            this.EXPECTED_GET_STATUS);
        reject(channelApeErrorResponse);
      }
    });
  }

}
