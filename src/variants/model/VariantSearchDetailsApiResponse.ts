export default interface VariantSearchResultsApiResponse {
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
  grams: string;
  currencyCode: string;
  retailPrice: string;
  wholesalePrice: string;
  quantity: number;
}
