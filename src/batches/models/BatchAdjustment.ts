import { AdjustmentType } from '../../inventories/enum/AdjustmentType';
import { InventoryStatus } from '../../inventories/enum/InventoryStatus';

export interface BatchAdjustment {
  quantity: number;
  inventoryStatus: InventoryStatus;
  idempotentKey: string;
  deduplicationKey: string;
  locationId: string;
  operation: AdjustmentType;
  effectiveTime?: Date;
  memo?: string;
}
