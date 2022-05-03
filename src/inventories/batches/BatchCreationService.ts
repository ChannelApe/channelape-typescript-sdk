import * as Q from 'q';
import * as uuidV4 from 'uuid/v4';
import { AxiosRequestConfig } from 'axios';

import { Logger, LogLevel } from 'channelape-logger';
import LocationsService from '../../locations/service/LocationsService';
import BatchCreationRequest from '../quantities/model/AdjustmentRequest';
import Adjustment from '../quantities/model/Adjustment';
import Resource from '../../model/Resource';
import Version from '../../model/Version';
import RequestClientWrapper from '../../RequestClientWrapper';
import RestService from '../../service/RestService';

export class BatchCreationService extends RestService {
  private EXPECTED_POST_STATUS: number = 201;

  private readonly logger = new Logger('BatchCreationService', LogLevel.VERBOSE);

  constructor(
    private readonly client: RequestClientWrapper,
    private readonly locationsService: LocationsService
  ) {
    super();
  }

  private async getBusinessIdFromLocation(locationId: string): Promise<string> {
    try {
      const location = await this.locationsService.get(locationId);
      return location.businessId;
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to retrieve business ID from location: ${locationId}`);
    }
  }

  private static generateIdempotentKey(
    inventoryItemId: string,
    status: string,
    locationId: string,
    deduplicationKey: string
  ): string {
    return `${deduplicationKey}_${locationId}_${inventoryItemId}_${status}`;
  }

  private createBatchInventory(batchCreationRequest: BatchCreationRequest) {
    const deferred = Q.defer<Adjustment>();
    const requestUrl
      = `/${Version.V1}${Resource.BATCHES}`;
    const options: AxiosRequestConfig = {
      data: batchCreationRequest,
    };
    this.client.post(requestUrl, options,
      (error, response, body) =>
        this.mapResponseToPromise(requestUrl, deferred, error, response, body, this.EXPECTED_POST_STATUS));
    return deferred.promise as any;
  }
}
