import { AdjustmentType } from '../../enum/AdjustmentType';
import { InventoryStatus } from '../../enum/InventoryStatus';

export default interface AdjustmentBySku {
  quantity: number;
  inventoryStatus: InventoryStatus;
  deduplicationKey: string;
  locationId: string;
  operation: AdjustmentType;
  memo?: string;
}
