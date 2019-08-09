import AlphabeticCurrencyCode from '../../../model/AlphabeticCurrencyCode';
import ChannelApeApiError from '../../../model/ChannelApeApiError';

export default interface ProductsFilterApiResponse {
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
}
