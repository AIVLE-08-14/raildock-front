// src/types/Auth.ts

export interface AuthUser {
  id: number
  name: string
  role: 'ADMIN' | 'USER'
}

export interface MeResponse {
  user: AuthUser | null
}

export interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
}

export interface LoginRequest {
  employeeId: string
  password: string
}

export interface LoginResponse {
  user: AuthUser
}

export interface SignupRequest {
    employeeId: string
    password: string
    name: string
    phoneNumber: string
    email: string
}

export interface SignupResponse {
    user: AuthUser
}