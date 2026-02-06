// src/api/queries/bboxQueries.ts

import { useMutation } from '@tanstack/react-query'
import { bboxApi } from '@/api/bbox'

export function useCreateBBoxFeedback() {
  return useMutation({
    mutationFn: ({
      problemId,
      jsonFile,
    }: {
      problemId: string
      jsonFile: File
    }) => bboxApi.createFeedback(problemId, jsonFile),
  })
}
