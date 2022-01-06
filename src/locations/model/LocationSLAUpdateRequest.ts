import LocationSLAOperatingDayUpdateRequest from './LocationSLAOperatingDayUpdateRequest';

export default interface LocationSLAUpdateRequest {
  fulfillmentSLAHours?: string;
  operatingDays: LocationSLAOperatingDayUpdateRequest[];
}
