// Common types that can be shared between frontend and backend
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}