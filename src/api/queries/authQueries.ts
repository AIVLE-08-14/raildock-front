// src/queries/auth.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'
import type {
  MeResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '@/types/authTypes'

export const authQueryKeys = {
  me: ['auth', 'me'] as const,
}

export const useMeQuery = () => {
  return useQuery<MeResponse>({
    queryKey: authQueryKeys.me,
    queryFn: authApi.me,
    retry: false,            
    staleTime: 1000 * 60,   
  })
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authQueryKeys.me,
      })
    },
  })
}

export const useSignupMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: authApi.signup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authQueryKeys.me,
      })
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKeys.me, {
        user: null,
      })
    },
  })
}
