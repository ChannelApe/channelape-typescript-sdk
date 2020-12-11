import TransactionStatus from './TransactionStatus';

export default interface RefundTransaction {
  id: string;
  message?: string;
  amount: number;
  status: TransactionStatus;
}
