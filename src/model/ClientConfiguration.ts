export default interface ClientConfiguration{
  sessionId?: string;
  email?: string;
  password?: string;
  endpoint?: string;
  bucketSize?: number;
  bucketIntervalSeconds?: number;
  bucketMaxWait?: number;
}
