import LineItem from './LineItem';
import Fulfillment from './Fulfillment';

export default interface Order {
  id: string;
  channelOrderId: string;
  channelId: string;
  businessId: string;
  purchasedAt: string;
  canceledAt: string;
  canceledReason: string;
  updatedAt: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  subtotalPrice: number;
  totalShippingTax: number;
  totalTax: number;
  totalGrams: number;
  alphabeticCurrencyCode: string;
  lineItems: LineItem[];
  fulfillments: Fulfillment[];
}
