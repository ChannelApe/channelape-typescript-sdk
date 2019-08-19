import ChannelApeApiError from '../../model/ChannelApeApiError';

export interface BusinessMember {
  userId: string;
  businessId: string;
  owner: boolean;
  errors?: ChannelApeApiError[];
}
