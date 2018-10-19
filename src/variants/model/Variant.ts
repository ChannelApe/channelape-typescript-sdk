import ChannelApeApiError from '../../model/ChannelApeApiError';
import VariantCondition from './VariantCondition';
import VariantCategories from './VariantCategories';

export default interface Variant {
  options: { [key: string]: string };
  additionalFields: { [key: string]: string };
  categories: VariantCategories;
  alphabeticCurrencyCode: string;
  condition: VariantCondition;
  createdAt: Date;
  description: string;
  errors: ChannelApeApiError[];
  grams: number;
  images: string[];
  inventoryItemValue: string;
  productId: string;
  quantity: number;
  retailPrice: number;
  sku: string;
  upc: string;
  tags: string[];
  title: string;
  updatedAt: Date;
  vendor: string;
  wholesalePrice: number;
}
