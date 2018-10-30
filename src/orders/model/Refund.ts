import LineItem from './LineItem';

export default interface Refund {
  supplierRefundId?: string;
  channelRefundId?: string;
  lineItems: LineItem[];
}
