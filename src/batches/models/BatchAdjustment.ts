import { InventoryStatus } from '../../inventories/enum/InventoryStatus';

export interface BatchAdjustment {
  quantity: number;
  inventoryStatus: InventoryStatus;
  idempotentKey: string;
  locationId: string;
  operation: AdjustmentType;
  effectiveTime?: Date;
  memo?: string;
}
