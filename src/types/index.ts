export interface APIResponse<T> {
    error: boolean;
    msg: string;
    payload: T;
    statusCode: number;
  }
  


