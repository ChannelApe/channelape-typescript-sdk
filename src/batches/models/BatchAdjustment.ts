import { AdjustmentType } from '../../inventories/enum/AdjustmentType';
import { InventoryStatus } from '../../inventories/enum/InventoryStatus';

export interface BatchAdjustment {
  quantity?: number;
  futureAppliedAtpPercentage?: number;
  expirationTime?: Date;
  inventoryStatus: InventoryStatus;
  idempotentKey: string;
  locationId: string;
  operation: AdjustmentType;
  effectiveTime?: Date;
  memo?: string;
  aggregateChannelSync?: boolean;
}
