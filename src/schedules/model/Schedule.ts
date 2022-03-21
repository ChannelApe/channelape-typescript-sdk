import ChannelApeApiError from '../../model/ChannelApeApiError';

export default interface Schedule {
  businessId: string;
  daysOfWeek: string[];
  endTimeInMinutes: Number;
  intervalInMinutes: Number;
  startTimeInMinutes: Number;
  createdAt?: Date;
  updatedAt?: Date;
  errors?: ChannelApeApiError[];
  id?: string;
}
