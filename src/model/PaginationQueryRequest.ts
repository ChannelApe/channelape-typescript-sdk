export default interface PaginationQueryRequest {
  size?: number;
  startDate?: Date;
  endDate?: Date;
  lastKey?: string;
  count?: boolean;
}
