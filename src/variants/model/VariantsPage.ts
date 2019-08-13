import VariantSearchDetails from '../model/VariantSearchDetails';
import PaginationResponse from '../../../src/model/PaginationResponse';
export default interface VariantsPage {
  variantSearchResults: VariantSearchDetails[];
  pagination: PaginationResponse;
}
