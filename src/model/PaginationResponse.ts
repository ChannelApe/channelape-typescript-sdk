export default interface PaginationResponse {
  lastKey?: string;
  lastPage: boolean;
  nextPageRef?: string;
  pageSize: number;
  totalItems?: number;
}
