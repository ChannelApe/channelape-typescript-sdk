import LineItem from './LineItem';
import Adjustment from './Adjustment';
import Transaction from './Transaction';

export default interface Refund {
  supplierRefundId?: string;
  channelRefundId?: string;
  lineItems?: LineItem[];
  transactions?: Transaction[];
  adjustments?: Adjustment[];
}
