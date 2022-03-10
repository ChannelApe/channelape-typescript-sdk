import EnvironmentVariableKey from './EnvironmentVariableKey';

export default interface StepCreateRequest {
  public: boolean;
  name: string;
  environmentVariableKeys: EnvironmentVariableKey[];
}
