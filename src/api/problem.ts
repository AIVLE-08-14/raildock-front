// src/api/problem.ts

import { apiClient } from '@/api/client'
import { PROBLEM_API } from '@/api/apiconfig/problemConfig'
import type {
  ProblemSimple,
  ProblemDetail,
  CreateProblemParams,
  UpdateProblemParams,
  ProblemStatus,
} from '@/types/problem'

export const problemApi = {
  /** 전체 간단 조회 */
  getList() {
    return apiClient.get<ProblemSimple[]>(PROBLEM_API.LIST())
  },

  /** 상세 조회 */
  getDetail(id: string) {
    return apiClient.get<ProblemDetail>(PROBLEM_API.DETAIL(id))
  },

  /** 생성 */
  create(params: CreateProblemParams) {
    return apiClient.post<string>(PROBLEM_API.BASE, params)
  },

  /** 삭제 */
  delete(id: string) {
    return apiClient.delete(PROBLEM_API.DELETE(id))
  },

  /** 내용 수정 */
  update(id: string, params: UpdateProblemParams) {
    return apiClient.patch(PROBLEM_API.UPDATE(id), params)
  },

  /** 상태 변경 */
  updateStatus(id: string, status: ProblemStatus) {
    return apiClient.patch(PROBLEM_API.UPDATE_STATUS(id), null, {
      params: { status },
    })
  },

  /** 담당자 변경 */
  updateManager(id: string, managerId: number) {
    return apiClient.patch(PROBLEM_API.UPDATE_MANAGER(id), {
      managerId,
    })
  },
}
