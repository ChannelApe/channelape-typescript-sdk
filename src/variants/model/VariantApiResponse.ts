import VariantCategories from './VariantCategories';
import VariantCondition from './VariantCondition';
import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface VariantApiResponse {
  options: { [key: string]: string };
  additionalFields: { [key: string]: string };
  categories: VariantCategories;
  alphabeticCurrencyCode: string;
  condition: VariantCondition;
  createdAt: string;
  description: string;
  errors: ChannelApeApiError[];
  grams: string;
  images: string[];
  inventoryItemValue: string;
  productId: string;
  quantity: number;
  retailPrice: string;
  sku?: string;
  upc?: string;
  tags: string[];
  title: string;
  updatedAt: string;
  vendor: string;
  wholesalePrice: string;
}
