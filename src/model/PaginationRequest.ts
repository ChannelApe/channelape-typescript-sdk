export default interface PaginationRequest {
  size?: number;
  startDate?: Date;
  endDate?: Date;
  lastKey?: string;
}
