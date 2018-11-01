import ChannelApeApiError from '../../model/ChannelApeApiError';
import PaginationResponse from '../../model/PaginationResponse';
import VariantSearchDetailsApiResponse from './VariantSearchDetailsApiResponse';

export default interface VariantSearchApiResult {
  errors: ChannelApeApiError[];
  pagination: PaginationResponse;
  variantSearchResults: VariantSearchDetailsApiResponse[];
}
