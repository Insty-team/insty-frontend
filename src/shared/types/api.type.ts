export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface PageMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: {
    pagination: PageMetadata;
    items: T[];
  };
}
