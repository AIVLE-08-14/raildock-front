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
    const { data } = await apiClient.post<LoginResponse>(
      '/auth/login',
      payload
    )
    return data
  },

  signup: async (payload: SignupRequest): Promise<SignupResponse> => {
    const { data } = await apiClient.post<SignupResponse>(
      '/auth/signup',
      payload
    )
    return data
  },

  me: async (): Promise<MeResponse> => {
    // 🔧 임시 로그인 상태
    const isMockLoggedIn = true // ← 여기만 바꾸면 됨

    if (!isMockLoggedIn) {
      // 실제로는 401 나는 상황을 흉내
      return Promise.reject({
        response: { status: 401 },
      })
    }

    // 로그인된 사용자 mock
    return Promise.resolve({
      user: {
        id: 1,
        name: '임시 사용자',
        role: 'USER',
      },
    })
  },

  // me: async (): Promise<MeResponse> => {
  //   const { data } = await apiClient.get<MeResponse>('/auth/me')
  //   return data
  // },

  logout: async (): Promise<void> => {
    await apiClient.get('/auth/logout')
  },
}
