// src/api/queries/detectQueries.ts

import { useQuery, useMutation } from '@tanstack/react-query'
import { detectApi } from '@/api/detect'
import type {
  CreateDetectParams,
  CreateDetectResponse,
  DetectDetail,
  DetectListResponse,
  DetectListItem,
} from '@/types/detect'

// Query Keys
export const detectQueryKeys = {
  all: ['detects'] as const,
  list: (page: number, size: number) =>
    [...detectQueryKeys.all, 'list', page, size] as const,
  detail: (id: number) =>
    [...detectQueryKeys.all, 'detail', id] as const,
}

// =======================
// Queries
// =======================

// 결함 목록
export function useDetectList(page = 0, size = 20) {
  return useQuery<DetectListResponse, Error, DetectListItem[]>({
    queryKey: detectQueryKeys.list(page, size),
    queryFn: () => detectApi.getList(page, size),

    // 🔑 핵심: UI에서는 items 배열만 보게 만든다
    select: (data) => data.items,

    // 선택 사항: Sidebar에서 첫 렌더 안전성 강화
    initialData: { items: [] },
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

// =======================
// Mutation
// =======================

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
