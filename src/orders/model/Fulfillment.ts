import AdditionalField from '../../model/AdditionalField';
import LineItem from './LineItem';
import FulfillmentStatus from './FulfillmentStatus';

export default interface Fulfillment {
  additionalFields: AdditionalField[];
  id: string;
  supplierId?: string;
  lineItems: LineItem[];
  status: FulfillmentStatus;
  shippingCompany?: string;
  shippingMethod?: string;
  trackingNumber?: string;
}
