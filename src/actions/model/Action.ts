import ActionStatus from './ActionStatus';

export default interface Action {
  id: string;
  action: string;
  processingStatus: ActionStatus;
  targetId: string;
  targetType: string;
  businessId: string;
  description: string;
  healthCheckIntervalInSeconds: number;
  lastHealthCheckTime: Date;
  startTime: Date;
  endTime?: Date;
}
