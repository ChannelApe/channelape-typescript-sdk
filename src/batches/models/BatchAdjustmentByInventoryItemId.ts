import { BatchAdjustment } from './BatchAdjustment';

export interface BatchAdjustmentByInventoryItemId extends BatchAdjustment {
  inventoryItemId: number;
  sku?: never;
}
