import LineItem from './LineItem';
import Fulfillment from './Fulfillment';
import AdditionalField from '../../model/AdditionalField';
import OrderStatus from './OrderStatus';
import Customer from './Customer';
import Refund from './Refund';

export default interface OrderCreateRequest {
  additionalFields?: AdditionalField[];
  channelOrderId: string;
  channelId: string;
  purchasedAt: Date;
  purchaseOrderNumber?: string;
  canceledAt?: Date;
  canceledReason?: string;
  customer?: Customer;
  status: OrderStatus;
  totalPrice?: number;
  subtotalPrice?: number;
  totalShippingPrice?: number;
  totalShippingTax?: number;
  totalTax?: number;
  totalGrams?: number;
  alphabeticCurrencyCode: string;
  lineItems: LineItem[];
  fulfillments?: Fulfillment[];
  actionId?: string;
  refunds?: Refund[];
}
