// src/types/common.ts

export interface ApiResponse<T = null> {
  success: boolean
  code: string
  message: string
  data: T
}
