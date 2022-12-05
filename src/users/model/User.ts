export default interface User {
  id: string;
  rowId?: number;
  username: string;
  analyticsEnabled: boolean;
  verified: boolean;
}
