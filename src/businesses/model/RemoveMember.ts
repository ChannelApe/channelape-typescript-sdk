import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface RemoveMember {
  businessId: string;
  userId: string;
  owner: boolean;
  errors?: ChannelApeApiError[];
}
