export default interface Action {
  id: string;
  action: string;
  processingStatus: string;
  targetId: string;
  targetType: string;
  businessId: string;
  description: string;
  healthCheckIntervalInSeconds: number;
  lastHealthCheckTime: string;
  startTime: string;
}
