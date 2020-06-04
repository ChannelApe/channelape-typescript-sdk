import { InventoryStatus } from '../../enum/InventoryStatus';

export default interface AdjustmentBySku {
  quantity: number;
  inventoryStatus: InventoryStatus;
}
