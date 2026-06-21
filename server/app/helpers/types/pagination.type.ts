export type Pagination = {
  page: number;
  take: number;
  totalItems: number;
  totalFilters: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
