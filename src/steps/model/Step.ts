import EnvironmentVariableKey from './EnvironmentVariableKey';

export default interface Step {
  createdAt: Date;
  environmentVariableKeys: EnvironmentVariableKey[];
  id: string;
  name: string;
  public: boolean;
  updatedAt: Date;
}
