import ChannelApeApiError from '../../../model/ChannelApeApiError';

export default interface ApiAccount {
  id: string | any;
  businessId: string;
  name: string;
  errors?: ChannelApeApiError[];
  lastAccessedTime?: Date;
  creationTime?: Date;
  expired?: boolean;
}
