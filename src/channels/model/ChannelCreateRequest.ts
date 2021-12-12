import ChannelSettings from './ChannelSettings';
import AdditionalField from '../../model/AdditionalField';

export default interface ChannelCreateRequest {
  additionalFields: AdditionalField[];
  businessId: string;
  credentials: object;
  integrationId: string;
  enabled: boolean;
  name: string;
  settings?: ChannelSettings;
}
