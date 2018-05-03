import AdditionalField from '../../model/AdditionalField';

export default interface LineItem {
  additionalFields: AdditionalField[];
  grams: string;
  id: string;
  price: string;
  quantity: number;
  shippingMethod: string;
  sku: string;
  title: string;
  vendor: string;
}
