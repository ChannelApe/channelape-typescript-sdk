import AdditionalField from '../../model/AdditionalField';
import Tax from './Tax';

export default interface LineItem {
  additionalFields?: AdditionalField[];
  grams?: number;
  id: string;
  price?: number;
  shippingPrice?: number;
  shippingTax?: number;
  quantity: number;
  shippingMethod?: string;
  sku?: string;
  upc?: string;
  title?: string;
  vendor?: string;
  restockType?: string;
  taxes?: Tax[];
  readonly giftCardCode?: string;
  readonly giftCardId?: string;
}
