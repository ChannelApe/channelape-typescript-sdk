import VariantApiResponse from './VariantApiResponse';
import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface VariantsApiResponse {
  errors: ChannelApeApiError[];
  variants: VariantApiResponse[];
}
