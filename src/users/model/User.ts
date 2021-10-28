import ChannelApeApiError from '../../model/ChannelApeApiError';
export default interface User {
  id: string;
  username: string;
  analyticsEnabled: boolean;
  verified: boolean;
}
export  interface Users {
  id: string;
  username: string;
  analyticsEnabled: boolean;
  verified: boolean;
  errors?: ChannelApeApiError[];
}
