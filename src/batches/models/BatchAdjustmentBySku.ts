import { BatchAdjustment } from './BatchAdjustment';

export interface BatchAdjustmentBySku extends BatchAdjustment {
  sku: string;
  inventoryItemId?: never;
}
