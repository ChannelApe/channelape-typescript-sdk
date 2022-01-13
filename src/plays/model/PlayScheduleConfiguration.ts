export default interface PlayScheduleConfiguration {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  targetAction: string;
  startTimeInMinutes: number;
  endTimeInMinutes: number;
  intervalTimeInMinutes: number;
  daysOfWeek: string[];
}
