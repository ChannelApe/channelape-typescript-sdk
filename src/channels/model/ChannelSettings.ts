import OutputFileSettings from './OutputFileSettings';

export default interface ChannelSettings {

  allowCreate: boolean;
  allowRead: boolean;
  allowUpdate: boolean;
  allowDelete: boolean;
  disableVariants: boolean;
  priceType: string;
  updateFields: string[];
  outputFile?: OutputFileSettings;

}
