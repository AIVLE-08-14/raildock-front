// src/types/common.ts

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}