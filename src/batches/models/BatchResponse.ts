export interface BatchResponse {
  id: string;
  type: 'INVENTORY';
  status: string;
  createdAt: Date;
  updatedAt: Date;
  businessId: string;
}
