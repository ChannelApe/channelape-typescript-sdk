import AlphabeticCurrencyCode from '../../../model/AlphabeticCurrencyCode';
import ChannelApeApiError from '../../../model/ChannelApeApiError';

export default interface ProductFilterApiResponse {
  alphabeticCurrencyCode: AlphabeticCurrencyCode;
  businessId: string;
  complement: boolean;
  createdAt: string;
  errors: ChannelApeApiError[];
  id: string;
  skus: string[];
  tags: string[];
  upcs: string[];
  updatedAt: string;
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
