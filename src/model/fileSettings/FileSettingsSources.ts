import FileSettingsAuthorization from './FileSettingsAuthorization';

export default interface FileSettingsSources {
  id: string;
  fileType: string;
  url: string;
  joinIndex: number;
  headers: boolean;
  authorization?: FileSettingsAuthorization;
}
