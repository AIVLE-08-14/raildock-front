import axios, { AxiosError } from 'axios'

import { queryClient } from '@/api/queries/reactQuery'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ⭐ 세션 인증 핵심
  timeout: 10000,        // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * =========================
 * Response Interceptor
 * =========================
 * - 401: 세션 만료 / 인증 해제
 * - React Query 캐시(auth/me) 초기화
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      queryClient.clear()
    }

    return Promise.reject(error)
  }
)
