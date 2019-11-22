export default interface AdjustmentRequest {
  quantity: number;
  inventoryItemId: string;
  inventoryStatus: string;
  locationId: string;
  memo?:string;
  effectiveAt?: Date;
  idempotentKey?: string;
}
