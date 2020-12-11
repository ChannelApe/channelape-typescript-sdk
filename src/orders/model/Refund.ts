import LineItem from './LineItem';
import RefundAdjustment from './RefundAdjustment';
import RefundTransaction from './RefundTransaction';

export default interface Refund {
  supplierRefundId?: string;
  channelRefundId?: string;
  lineItems: LineItem[];
  transactions?: RefundTransaction[];
  adjustments?: RefundAdjustment[];
}
