import AdditionalField from '../../model/AdditionalField';

export default interface Address {
  additionalFields: AdditionalField[];
  address1: string;
  address2?: string;
  city: string;
  country: string;
  countryCode: string;
  firstName: string;
  lastName: string;
  name: string;
  postalCode: string;
  provinceCode: string;
  province: string;
  phone?: string;
}
