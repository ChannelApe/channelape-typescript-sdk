import AlphabeticCurrencyCode from '../../../model/AlphabeticCurrencyCode';
import ChannelApeApiError from '../../../model/ChannelApeApiError';

export default interface ProductFilter {
  alphabeticCurrencyCode: AlphabeticCurrencyCode;
  businessId: string;
  complement: boolean;
  createdAt: Date;
  errors: ChannelApeApiError[];
  id: string;
  skus: string[];
  tags: string[];
  upcs: string[];
  updatedAt: Date;
  vendors: any[];
  label: string;
  title: string;
  condition: string;
  primaryCondition: string;
  secondaryCondition: string;
  weightMin: string;
  weightMax: string;
  retailMin: string;
  retailMax: string;
  wholesaleMin: string;
  wholesaleMax: string;
  quantityMin: number;
  quantityMax: number;
}
