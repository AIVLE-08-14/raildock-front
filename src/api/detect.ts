// src/api/detect.ts

import { apiClient } from '@/api/client'
import type {
  DetectListResponse,
  DetectDetail,
  CreateDetectParams,
  CreateDetectResponse,
} from '@/types/detect'

// 결함 탐지 API
export const detectApi = {
  // 결함 탐지 목록 조회
  async getList(
    page = 0,
    size = 20
  ): Promise<DetectListResponse> {
    const res = await apiClient.get<DetectListResponse>('/detect', {
      params: { page, size },
    })

    return {
      items: res.data.items ?? [],
    }
  },

  // 결함 탐지 상세 조회
  async getDetail(
    problemDetectionId: number
  ): Promise<DetectDetail> {
    const res = await apiClient.get<DetectDetail>(
      `/detect/${problemDetectionId}`
    )
    return res.data
  },

  // 결함 탐지 생성 (영상 업로드)
  async create(
    params: CreateDetectParams,
    files: {
      metadata?: File
      insulatorVideo?: File
      railVideo?: File
      nestVideo?: File
    }
  ): Promise<CreateDetectResponse> {
    const formData = new FormData()

    if (files.metadata) {
      formData.append('metadata', files.metadata)
    }
    if (files.insulatorVideo) {
      formData.append('insulatorVideo', files.insulatorVideo)
    }
    if (files.railVideo) {
      formData.append('railVideo', files.railVideo)
    }
    if (files.nestVideo) {
      formData.append('nestVideo', files.nestVideo)
    }

    const res = await apiClient.post<CreateDetectResponse>(
      '/detect',
      formData,
      {
        params: { name: params.name },
      }
    )

    return res.data
  },
}