export default interface BatchCreationAdjustment {
  sku: string;
  quantity: number;
  idempotentKey?: string;
  locationId: string;
  operation: string;
  memo?:string;
  effectiveAt?: Date;
}
