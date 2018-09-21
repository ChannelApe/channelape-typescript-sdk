import OutputFileColumn from './OutputFileColumn';

export default interface OutputFileSettings {
  header: boolean;
  columns: OutputFileColumn[];
}
