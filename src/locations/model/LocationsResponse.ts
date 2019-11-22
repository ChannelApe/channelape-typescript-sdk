import Location from './Location';
import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface LocationsResponse {
  locations: Location[];
  errors: ChannelApeApiError[];
}
