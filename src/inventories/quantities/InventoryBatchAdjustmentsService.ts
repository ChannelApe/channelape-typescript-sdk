import Adjustment from './model/Adjustment';
import AdjustmentRequest from './model/AdjustmentRequest';
import * as Q from 'q';
import BatchAdjustmentRequest from './model/BatchAdjustmentRequest';
import AdjustmentsBySku from './model/AdjustmentsBySku';
import { Logger, LogLevel } from 'channelape-logger';
import InventoryItem from '../model/InventoryItem';
import AdjustmentBySku from './model/AdjustmentBySku';
import InventoriesService from '../service/InventoriesService';
import LocationsService from '../../locations/service/LocationsService';
import InventoryItemQuantitiesService from './InventoryItemQuantitiesService';
import { UnknownStatusError } from '../model/UnknownStatusError';
import { InventoryStatus } from '../enum/InventoryStatus';

export class InventoryBatchAdjustmentsService {

  private readonly logger = new Logger('InventorybatchAdjustmentsService', LogLevel.VERBOSE);

  constructor(
    private readonly inventoryItemQuantitiesService: InventoryItemQuantitiesService,
    private readonly inventoriesService: InventoriesService,
    private readonly locationsService: LocationsService
  ) { }

  /**
   * Performs multiple inventory adjustments for multiple SKU's.  If an inventory item does not yet exist
   * for a given SKU, then a new inventory item is created for it.
   *
   * The `deduplicationKey` on each AdjustmentBySku should indicate a unique identifier which will prevent
   * another adjustment for the same inventory item, location, and status.  For example, if you only wanted
   * to allow one adjustment per day, you could use a value of the current day/month/year.
   *
   * @param {BatchAdjustmentRequest} batchAdjustmentRequest
   */
  public async adjustBatch(batchAdjustmentRequest: BatchAdjustmentRequest): Promise<void> {
    if (!(batchAdjustmentRequest instanceof BatchAdjustmentRequest)) {
      throw new Error('Must provide a BatchAdjustmentRequest instance');
    }

    const businessId = await this.getBusinessId(batchAdjustmentRequest.locationId);

    const adjustmentsBySkuPromises = batchAdjustmentRequest.adjustmentsBySku
      .map((adjustmentsBySku: AdjustmentsBySku) => {
        return this.handleAdjustmentsBySku(
          adjustmentsBySku,
          batchAdjustmentRequest.locationId,
          businessId,
          batchAdjustmentRequest.deduplicationKey
        );
      });

    const promiseStateResults = await Q.allSettled(adjustmentsBySkuPromises);

    let rejectedAdjustment: any[] = [];
    let fulfilledAdjustment: Adjustment[] = [];
    let failedToGetOrCreateInventoryItemCount = 0;
    let successfullyGottenOrCreatedInventoryItemCount = 0;
    for (const result of promiseStateResults) {
      if (result.state === 'rejected') {
        failedToGetOrCreateInventoryItemCount += 1;
      } else {
        successfullyGottenOrCreatedInventoryItemCount += 1;
        const adjustments = result.value;
        if (!adjustments) {
          throw new Error('No adjustments found for fulfilled promise');
        }
        rejectedAdjustment = rejectedAdjustment.concat(
          adjustments.filter((result: any) => result.state === 'rejected').map(item => item.reason)
        );
        fulfilledAdjustment = fulfilledAdjustment.concat(
          // @ts-ignore
          adjustments.filter((result: any) => result.state === 'fulfilled').map(item => item.value)
        );
      }
    }

    const unknownStatuses = rejectedAdjustment.filter((reason: any) => reason instanceof UnknownStatusError);
    const totalAttemptedAdjustments = fulfilledAdjustment.length + rejectedAdjustment.length - unknownStatuses.length;

    this.logger.info(`Inventory adjustments completed for location ${batchAdjustmentRequest.locationId}:`);
    this.logger.info(`\tSkipped adjustments with unknown statuses: ${unknownStatuses.length}`);
    this.logger.info('\tSuccessfully retrieved or created inventory items: ' +
      `${successfullyGottenOrCreatedInventoryItemCount} / ${promiseStateResults.length}`);
    this.logger.info('\tSuccessful adjustments: ' +
      `${fulfilledAdjustment.length} / ${totalAttemptedAdjustments}`);

    if (rejectedAdjustment.length > 0 || failedToGetOrCreateInventoryItemCount > 0) {
      this.logger.warn('At least one adjustment failed, throwing error');
      throw new Error('At least one adjustment failed');
    }

    this.logger.info('Inventory quantity updates completed without error');
  }

  private async handleAdjustmentsBySku(
    adjustmentsBySku: AdjustmentsBySku,
    locationId: string,
    businessId: string,
    deduplicationKey: string
  ): Promise<Q.PromiseState<Adjustment>[]> {
    let inventoryItem = await this.getInventoryItem(adjustmentsBySku.sku, businessId);
    if (!inventoryItem) {
      inventoryItem = await this.createInventoryItem(adjustmentsBySku.sku, businessId);
    }

    const allowedStatuses = Object.values(InventoryStatus);
    const adjustmentPromises = [];
    for (const adjustment of adjustmentsBySku.adjustments) {
      adjustmentPromises.push(
        this.sendAdjustmentRequest(adjustment, inventoryItem, deduplicationKey, locationId, allowedStatuses)
      );
    }

    return Q.allSettled(adjustmentPromises);
  }

  private async getBusinessId(locationId: string): Promise<string> {
    try {
      const location = await this.locationsService.get(locationId);
      return location.businessId;
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to retrieve business ID from location: ${locationId}`);
    }
  }

  private generateIdempotentKey(
    inventoryItemId: string,
    status: string,
    locationId: string,
    deduplicationKey: string
  ): string {
    return `${deduplicationKey}_${locationId}_${inventoryItemId}_${status}`;
  }

  private async getInventoryItem(sku: string, businessId: string): Promise<InventoryItem | null> {
    let inventoryItems;
    try {
      inventoryItems = await this.inventoriesService.get(businessId, sku);
    } catch (error) {
      this.logger.error(`Failed to retrieve inventory item.
        SKU: ${sku}
        Business ID: ${businessId}`);
      this.logger.error(error);
      throw error;
    }

    if (inventoryItems.length > 1) {
      const ids = inventoryItems.map(inventoryItem => inventoryItem.id);
      const error = `Multiple inventory items found for a single SKU.
        SKU: ${sku}
        Found Inventory Item ID's: ${ids}
        Business ID: ${businessId}`;
      this.logger.error(error);
      throw new Error(error);
    }

    return inventoryItems[0];
  }

  private async createInventoryItem(sku: string, businessId: string): Promise<InventoryItem> {
    try {
      const item = await this.inventoriesService.create({
        sku,
        businessId
      });
      this.logger.info('Successfully created inventory item:' +
        `\n\tInventoryItemId: ${item.id}` +
        `\n\tSKU: ${item.sku}`);
      return item;
    } catch (error) {
      this.logger.error(`Failed to create new inventory item.
        SKU: ${sku}
        Business ID: ${businessId}`);
      this.logger.error(error);
      throw error;
    }
  }

  private async sendAdjustmentRequest(
    adjustment: AdjustmentBySku,
    inventoryItem: InventoryItem,
    deduplicationKey: string,
    locationId: string,
    allowedStatuses: string[]
  ): Promise<Adjustment> {
    if (!allowedStatuses.includes(adjustment.status)) {
      const errorMessage = `No matching status found.  Skipping adjustment.
        InventoryItemId: ${inventoryItem.id}
        Status: ${adjustment.status}
        Expected one of the following statuses: ${allowedStatuses}`;
      this.logger.warn(errorMessage);
      throw new UnknownStatusError(errorMessage);
    }

    const adjustmentRequest: AdjustmentRequest = {
      locationId,
      quantity: adjustment.quantity,
      inventoryItemId: inventoryItem.id,
      inventoryStatus: adjustment.status,
      idempotentKey: this.generateIdempotentKey(inventoryItem.id, adjustment.status, locationId, deduplicationKey)
    };

    try {
      const result = await this.inventoryItemQuantitiesService.set(adjustmentRequest);
      this.logger.info(`Successfully set quantity.
        Inventory Item ID: ${adjustmentRequest.inventoryItemId}
        Location ID: ${locationId}
        Quantity: ${adjustmentRequest.quantity}
        Status: ${adjustmentRequest.inventoryStatus}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to set quantity.
        Inventory Item ID: ${adjustmentRequest.inventoryItemId}
        Location ID: ${locationId}
        Quantity: ${adjustmentRequest.quantity}
        Status: ${adjustmentRequest.inventoryStatus}`);
      this.logger.error(error);
      throw error;
    }
  }

}
