export default interface Adjustment {
  id: string;
  amount: number;
  taxAmount?: number;
  reason?: string;
}
