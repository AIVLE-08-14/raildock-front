// src/api/bbox.ts

import { apiClient } from '@/api/client'

export const bboxApi = {
  /**
   * BBox 피드백 업로드
   * POST /feedback?problemId=UUID
   * multipart/form-data
   */
  createFeedback(problemId: string, jsonFile: File) {
    const formData = new FormData()
    formData.append('jsonFile', jsonFile)

    return apiClient.post('/feedback', formData, {
      params: { problemId },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
