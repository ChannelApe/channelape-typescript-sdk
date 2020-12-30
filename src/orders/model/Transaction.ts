import TransactionStatus from './TransactionStatus';

export default interface Transaction {
  id: string;
  message?: string;
  amount: number;
  status: TransactionStatus;
}
