import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { problemApi } from '@/api/problem'
import type {
  CreateProblemParams,
  UpdateProblemParams,
  ProblemStatus,
} from '@/types/problem'

// Query Keys

export const PROBLEM_QUERY_KEY = {
  all: ['problems'] as const,
  list: () => [...PROBLEM_QUERY_KEY.all, 'list'] as const,
  detail: (id: string) =>
    [...PROBLEM_QUERY_KEY.all, 'detail', id] as const,
}

// Queries

/** 문제 전체 조회 */
export const useProblemList = () =>
  useQuery({
    queryKey: PROBLEM_QUERY_KEY.list(),
    queryFn: async () => {
      const res = await problemApi.getList()
      return res.data
    },
  })

/** 문제 상세 조회 */
export const useProblemDetail = (id?: string) =>
  useQuery({
    queryKey: PROBLEM_QUERY_KEY.detail(id ?? ''),
    queryFn: async () => {
      const res = await problemApi.getDetail(id!)
      return res.data
    },
    enabled: Boolean(id),
  })

// Mutations

/** 문제 생성 */
export const useCreateProblem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateProblemParams) =>
      problemApi.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROBLEM_QUERY_KEY.list(),
      })
    },
  })
}

/** 문제 내용 수정 */
export const useUpdateProblem = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateProblemParams) =>
      problemApi.update(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROBLEM_QUERY_KEY.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: PROBLEM_QUERY_KEY.list(),
      })
    },
  })
}

/** 문제 삭제 */
export const useDeleteProblem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => problemApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROBLEM_QUERY_KEY.all,
      })
    },
  })
}

/** 상태 변경 */
export const useUpdateProblemStatus = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: ProblemStatus) =>
      problemApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROBLEM_QUERY_KEY.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: PROBLEM_QUERY_KEY.list(),
      })
    },
  })
}

/** 담당자 변경 */
export const useUpdateProblemManager = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (managerId: number) =>
      problemApi.updateManager(id, managerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROBLEM_QUERY_KEY.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: PROBLEM_QUERY_KEY.list(),
      })
    },
  })
}
