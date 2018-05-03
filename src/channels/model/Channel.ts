import ChannelSettings from './ChannelSettings';

export default interface Channel {
  id: string;
  businessId: string;
  integrationId: string;
  enabled: boolean;
  name: string;
  settings: ChannelSettings;
  createdAt: Date;
  updatedAt: Date;
}
