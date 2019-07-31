import Supplier from './Supplier';
import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface SuppliersResponse {
  suppliers: Supplier[];
  errors: ChannelApeApiError[];
}
