import ChannelApeApiError from '../../model/ChannelApeApiError';
export default interface Recipe {
  businessId: string;
  sourceId : string;
  sourceType : string;
  targetId : string;
  targetType : string;
  targetAction : string;
  enabled : boolean;
  createdAt?: Date;
  updatedAt?: Date;
  errors?: ChannelApeApiError[];
  id?: string;
}
