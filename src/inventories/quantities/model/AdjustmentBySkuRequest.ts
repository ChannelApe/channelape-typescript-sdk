import { InventoryAdjustmentUpdateType } from './InventoryAdjustmentUpdateType';
import InventoryStatus from '../../enum/InventoryStatus';

export interface AdjustmentBySkuRequest {
  updateType: InventoryAdjustmentUpdateType;
  quantity: number;
  sku: string;
  inventoryStatus: InventoryStatus;
  locationId: string;
  deduplicationKey: string;
}
