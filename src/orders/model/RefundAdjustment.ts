export default interface RefundAdjustment {
  id: string;
  amount: number;
  taxAmount?: number;
  reason?: string;
}
