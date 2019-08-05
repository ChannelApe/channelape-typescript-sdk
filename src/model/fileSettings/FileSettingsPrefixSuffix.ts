import FileSettingsMapping from './FileSettingsMapping';

export default interface FileSettingsPrefixSuffix extends FileSettingsMapping {
  prefix?: string;
  suffix?: string;
}
