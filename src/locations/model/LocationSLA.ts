import ChannelApeApiError from '../../../src/model/ChannelApeApiError';
import LocationSLAOperatingDay from './LocationSLAOperatingDay';

export default interface LocationSLA {
  createdAt: Date;
  fulfillmentSLAHours?: string;
  locationId: string;
  operatingDays: LocationSLAOperatingDay[];
  updatedAt: Date;
  errors: ChannelApeApiError[];
}
