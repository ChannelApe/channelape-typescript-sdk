export default interface PaginationQueryRequest {
  size?: number;
  startDate?: Date;
  endDate?: Date;
  updatedAtStartDate?: Date;
  updatedAtEndDate?: Date;
  lastKey?: string;
  count?: boolean;
}
