import FileSettingsMapping from './FileSettingsMapping';

export default interface FileSettingsOptions extends FileSettingsMapping {
  key?: string;
  keyColumnIndex?: number;
}
