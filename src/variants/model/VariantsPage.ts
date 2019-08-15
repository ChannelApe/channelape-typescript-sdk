import VariantSearchDetails from '../model/VariantSearchDetails';
import PaginationResponse from '../../model/PaginationResponse';
export default interface VariantsPage {
  variantSearchResults: VariantSearchDetails[];
  pagination: PaginationResponse;
}
