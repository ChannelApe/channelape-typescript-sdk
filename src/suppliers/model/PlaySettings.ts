import EnvironmentVariable from './EnvironmentVariable';
import OrderQueryParameters from './OrderQueryParameters';

export default interface PlaySettings {
  environmentVariables: EnvironmentVariable[];
  maximumConcurrentConnections: string;
  orderQueryParameters: OrderQueryParameters;
  playId: string;
}
