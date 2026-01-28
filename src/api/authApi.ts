import { apiClient } from './client'
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  MeResponse,
} from '@/types/authTypes'

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post('/auth/login', payload)
    return data
  },

  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    const { data } = await apiClient.post('/auth/signup', payload)
    return data
  },

  me: async (): Promise<MeResponse> => {
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
}
