import EnvironmentVariable from './EnvironmentVariable';
import OrderQueryParameters from './OrderQueryParameters';
import StepVersion from './StepVersion';

export default interface StepSettings {
  environmentVariables: EnvironmentVariable[];
  maximumConcurrentConnections: string;
  orderQueryParameters: OrderQueryParameters;
  version: StepVersion;
  stepId: string;
}
