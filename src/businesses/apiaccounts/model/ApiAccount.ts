import ChannelApeApiError from '../../../model/ChannelApeApiError';

export default interface ApiAccount {
  id: string;
  rowId?: number;
  businessId: string;
  name: string;
  errors?: ChannelApeApiError[];
  lastAccessedTime?: Date;
  creationTime?: Date;
  expired?: boolean;
  privateKey?: string;
}
