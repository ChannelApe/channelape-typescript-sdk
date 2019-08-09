import AlphabeticCurrencyCode from '../../../model/AlphabeticCurrencyCode';
import ChannelApeApiError from '../../../model/ChannelApeApiError';

export default interface ProductsFilter {
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
}
