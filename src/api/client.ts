import axios, { AxiosError } from 'axios'
import { queryClient } from '@/api/queries/reactQuery'

const isDev = import.meta.env.DEV

export const apiClient = axios.create({
  baseURL: isDev ? '/api' : import.meta.env.VITE_Backend_URL,
  withCredentials: true, // 세션 인증 유지
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      queryClient.clear()
    }
    return Promise.reject(error)
  }
)
