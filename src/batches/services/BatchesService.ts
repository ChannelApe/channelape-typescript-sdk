import { AxiosRequestConfig } from 'axios';
import { Logger, LogLevel } from 'channelape-logger';
import Version from '../../model/Version';
import RequestClientWrapper from '../../RequestClientWrapper';
import Resource from '../../model/Resource';
import RestService from '../../service/RestService';
import { BatchAdjustmentCreationRequest } from '../models/BatchAdjustmentCreationRequest';
import { BatchResponse } from '../models/BatchResponse';

export class BatchesService extends RestService {
  private readonly logger = new Logger('BatchService', LogLevel.VERBOSE);
  private EXPECTED_POST_STATUS: number = 202;
  private EXPECTED_GET_STATUS: number = 200;

  constructor(private readonly client: RequestClientWrapper) {
    super();
  }

  public createInventoryAdjustmentBatch(
    batchCreationRequest: BatchAdjustmentCreationRequest
  ): Promise<BatchResponse> {
    const requestUrl = `/${Version.V1}${Resource.BATCHES}`;
    this.logger.info(
      `Attempting to create a batch with ${batchCreationRequest.adjustments.length} adjustments`
    );
    const options: AxiosRequestConfig = {
      data: batchCreationRequest,
    };
    return new Promise((resolve, reject) => {
      this.client.post(requestUrl, options, (error, response, body) => {
        this.mapResponsePromise(
          resolve,
          reject,
          error,
          response,
          body,
          requestUrl,
          this.EXPECTED_POST_STATUS
        );
      });
    });
  }

  public get(batchId: string): Promise<BatchResponse> {
    const requestUrl = `/${Version.V1}${Resource.BATCHES}/${batchId}`;
    return new Promise((resolve, reject) => {
      this.client.get(requestUrl, {}, (error, response, body) => {
        this.mapResponsePromise(
          resolve,
          reject,
          error,
          response,
          body,
          requestUrl,
          this.EXPECTED_GET_STATUS
        );
      });
    });
  }
}

export function generateDeduplicationKey(
  status: string,
  locationId: string,
  deduplicationKey: string,
  sku:string,
  inventoryItemId?: number,
): string {
  return inventoryItemId ? `${deduplicationKey}_${locationId}_${inventoryItemId}_${status}` : `${deduplicationKey}_${locationId}_${sku}_${status}`;
}
