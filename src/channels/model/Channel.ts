import ChannelSettings from './ChannelSettings';
import AdditionalField from '../../model/AdditionalField';

export default interface Channel {
  additionalFields: AdditionalField[];
  id: string;
  businessId: string;
  integrationId: string;
  enabled: boolean;
  name: string;
  settings: ChannelSettings;
  createdAt: Date;
  updatedAt: Date;
}
