export default interface Adjustment {
  quantity: number;
  adjustment: number;
  inventoryItemId: string;
  inventoryStatus: string;
  createdAt: Date;
  updatedAt: Date;
  effectiveAt?: Date;
  userId?: string;
  apiAccountId?: string;
  locationId: string;
}
