export default interface VariantSearchResults {
  productId: string;
  inventoryItemValue: string;
  businessId: string;
  sku: string;
  upc: string;
  title: string;
  vendor: string;
  condition: string;
  primaryCategory: string;
  tags: string[];
  grams: number;
  currencyCode: string;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
}
