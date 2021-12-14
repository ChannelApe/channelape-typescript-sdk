import LocationClosedDay from './LocationClosedDay';
import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface LocationClosureResponse {
  closedDays: LocationClosedDay[];
  errors: ChannelApeApiError[];
  locationId: string;
}
