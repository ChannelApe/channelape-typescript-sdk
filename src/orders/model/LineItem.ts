import AdditionalField from '../../model/AdditionalField';

export default interface LineItem {
  additionalFields: AdditionalField[];
  grams: number;
  id: string;
  price: number;
  quantity: number;
  shippingMethod: string;
  sku: string;
  title: string;
  vendor: string;
}
