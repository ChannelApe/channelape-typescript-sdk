import ChannelApeApiError from '../../model/ChannelApeApiError';

export interface UserBusinessPermissions {
  userId: string;
  businessId: string;
  owner: boolean;
  errors?: ChannelApeApiError[];
}
