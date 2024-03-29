/**
 * Leave out idempotent key for one to be generated.
 */
export default interface AdjustmentRequest {
  quantity?: number;
  futureAppliedAtpPercentage?: number;
  expiresAt?: Date;
  inventoryItemId: string;
  inventoryStatus: string;
  locationId: string;
  memo?:string;
  effectiveAt?: Date;
  idempotentKey?: string;
  aggregateChannelSync?: boolean;
}
