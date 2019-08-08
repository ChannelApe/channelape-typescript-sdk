import FileSettingsMapping from './FileSettingsMapping';
import AlphabeticCurrencyCode from '../AlphabeticCurrencyCode';

export default interface FileSettingsPrice extends FileSettingsMapping {
  currencyCode: AlphabeticCurrencyCode;
}
