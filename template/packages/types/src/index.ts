// Common types that can be shared between frontend and backend
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}