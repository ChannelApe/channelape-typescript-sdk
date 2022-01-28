export default interface EnvironmentVariableKey {
  defaultValue?: string;
  name: string;
  description: string;
  secured: boolean;
}
