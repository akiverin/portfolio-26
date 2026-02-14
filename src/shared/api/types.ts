export type BaseResponse<T> =
  | { isError: false; data: T }
  | { isError: true; data: null; error: unknown };

export type PaginationT = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationT;
};
