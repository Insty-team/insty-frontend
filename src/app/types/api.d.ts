type ApiResponse<DATA_TYPE> =
  | {
      success: true;
      data: DATA_TYPE;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: {
          [key: string]: string;
        };
      };
    };
export type { ApiResponse };
