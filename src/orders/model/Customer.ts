import Address from './Address';
import AdditionalField from '../../model/AdditionalField';

export default interface Customer {
  additionalFields?: AdditionalField[];
  billingAddress?: Address;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  name?: string;
  shippingAddress?: Address;
}
