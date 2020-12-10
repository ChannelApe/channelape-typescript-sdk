import Order from '../model/Order';
import OrderStatus from '../model/OrderStatus';
import LineItem from '../model/LineItem';
import Fulfillment from '../model/Fulfillment';
import trimObject from '../../utils/trimObject';
import Tax from '../model/Tax';

export default class JsonOrderFormatterService {
  public static formatOrder(rawOrder: any): Order {
    let order: any;
    if (typeof rawOrder === 'string') {
      order = JSON.parse(rawOrder);
    } else {
      order = rawOrder;
    }
    order.purchasedAt = new Date(order.purchasedAt);
    if (order.canceledAt != null) {
      order.canceledAt = new Date(order.canceledAt);
    }
    order.updatedAt = new Date(order.updatedAt);
    order.createdAt = new Date(order.createdAt);
    order.status = order.status as OrderStatus;
    order.totalPrice = Number(order.totalPrice);
    order.subtotalPrice = Number(order.subtotalPrice);
    order.totalShippingPrice = Number(order.totalShippingPrice);
    if (typeof order.totalShippingTax !== 'undefined') {
      order.totalShippingTax = Number(order.totalShippingTax);
    }
    order.totalTax = Number(order.totalTax);
    order.totalGrams = Number(order.totalGrams);
    order.lineItems = order.lineItems.map(JsonOrderFormatterService.formatLineItem);
    order.fulfillments = order.fulfillments.map((f: any) =>
      JsonOrderFormatterService.formatFulfillment(f),
    );
    return trimObject(order) as Order;
  }

  private static formatFulfillment(fulfillment: Fulfillment): Fulfillment {
    fulfillment.lineItems = fulfillment.lineItems.map(JsonOrderFormatterService.formatLineItem);
    if (fulfillment.shippedAt) {
      fulfillment.shippedAt = new Date(fulfillment.shippedAt);
    }
    return fulfillment;
  }

  private static formatLineItem(lineItem: LineItem): LineItem {
    lineItem.grams = Number(lineItem.grams);
    lineItem.price = Number(lineItem.price);
    if (typeof lineItem.taxes !== 'undefined') {
      lineItem.taxes = lineItem.taxes.map(JsonOrderFormatterService.formatLineItemTax);
    }
    return lineItem;
  }

  private static formatLineItemTax(tax: Tax): Tax {
    tax.price = Number(tax.price);
    tax.rate = tax.rate ? Number(tax.rate) : undefined;
    return tax;
  }

}
