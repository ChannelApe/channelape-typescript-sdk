import { BatchAdjustmentByInventoryItemId } from './BatchAdjustmentByInventoryItemId';
import { BatchAdjustmentBySku } from './BatchAdjustmentBySku';
import { BatchCreationRequest } from './BatchCreationRequest';

export interface BatchAdjustmentCreationRequest extends BatchCreationRequest {
  adjustments: (BatchAdjustmentBySku | BatchAdjustmentByInventoryItemId)[];
}
