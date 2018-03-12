export default interface ClientConfiguration{
  secret?: string;
  email?: string;
  password?: string;
  endpoint: string;
  bucketSize?: number;
  bucketIntervalSeconds?: number;
  bucketMaxWait?: number;
}
