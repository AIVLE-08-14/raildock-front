// src/types/authTypes.ts
import type { ApiResponse } from './common'

export interface AuthUser {
  id: number
  employeeId: string
  name: string
  role: 'ADMIN' | 'WORKER'
}

export type MeResponse = ApiResponse<AuthUser>

export interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
}

export interface LoginRequest {
  employeeId: string
  password: string
}

export type LoginResponse = ApiResponse<null>

export interface SignupRequest {
    employeeId: string
    password: string
    name: string
    phoneNumber: string
    email: string
}

export type SignupResponse = ApiResponse<AuthUser>

export interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
}