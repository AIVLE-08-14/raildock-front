// src/api/queries/detectQueries.ts

import { useQuery, useMutation } from '@tanstack/react-query'
import { detectApi } from '@/api/detect'
import type {
  CreateDetectParams,
  CreateDetectResponse,
  DetectDetail,
  DetectListResponse,
} from '@/types/detect'

// Query Keys

export const detectQueryKeys = {
  all: ['detects'] as const,
  list: (page: number, size: number) =>
    [...detectQueryKeys.all, 'list', page, size] as const,
  detail: (id: number) =>
    [...detectQueryKeys.all, 'detail', id] as const,
}

// Queries
// 결함 목록
export function useDetectList(page = 0, size = 20) {
  return useQuery<DetectListResponse>({
    queryKey: detectQueryKeys.list(page, size),
    queryFn: () => detectApi.getList(page, size),
  })
}

// 결함 상세
export function useDetectDetail(id: number) {
  return useQuery<DetectDetail>({
    queryKey: detectQueryKeys.detail(id),
    queryFn: () => detectApi.getDetail(id),
    enabled: !!id,
  })
}

// Mutation

export function useCreateDetect() {
  return useMutation<
    CreateDetectResponse,
    Error,
    {
      params: CreateDetectParams
      files: {
        metadata?: File
        insulatorVideo?: File
        railVideo?: File
        nestVideo?: File
      }
    }
  >({
    mutationFn: ({ params, files }) =>
      detectApi.create(params, files),
  })
}
