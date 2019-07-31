import FileSettingsAdditionalFields from './FileSettingsAdditionalFields';
import FileSettingsMapping from './FileSettingsMapping';
import FileSettingsPrice from './FileSettingsPrice';
import FileSettingsSources from './FileSettingsSources';
import FileSettingsValue from './FileSettingsValue';
import FileSettingsWeight from './FileSettingsWeight';
import FileSettingsPrefixSuffix from './FileSettingsPrefixSuffix';
import FileSettingsOptions from './FileSettingsOptions';

export default interface FileSettings {
  additionalFieldsMapping: FileSettingsAdditionalFields[];
  descriptionMapping: FileSettingsPrefixSuffix[];
  imagesMapping: FileSettingsMapping[];
  optionsMapping: (FileSettingsOptions)[];
  primaryCategoryMapping: FileSettingsMapping;
  productMapping: FileSettingsMapping;
  productTagsMapping: (FileSettingsMapping | FileSettingsValue)[];
  quantityMapping: FileSettingsMapping[];
  removedFromFeedTag: string;
  retailPriceMapping: FileSettingsPrice;
  secondaryCategoryMapping: FileSettingsMapping;
  skuMapping: FileSettingsMapping;
  sources: FileSettingsSources[];
  tagsMapping: (FileSettingsMapping | FileSettingsValue)[];
  titleMapping: FileSettingsMapping[];
  upcMapping: FileSettingsMapping;
  vendorMapping: FileSettingsMapping;
  weightMapping: FileSettingsWeight;
  wholesalePriceMapping: FileSettingsPrice;
}
