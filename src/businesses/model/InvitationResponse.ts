import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface InvitationResponse {
  businessId: string;
  userId: string;
  errors?: ChannelApeApiError[];
}
