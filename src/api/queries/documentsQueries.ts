// src/queries/documents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as documentApi from '@/api/documents'
import type { DocumentDetail, DocumentListItem } from '@/types/document'

export const documentQueryKeys = {
  all: ['documents'] as const,
  list: () => ['documents', 'list'] as const,
  detail: (id: string) => ['documents', id] as const,
}

/* 문서 목록 */
export const useDocumentListQuery = () => {
  return useQuery<DocumentListItem[]>({
    queryKey: documentQueryKeys.list(),
    queryFn: documentApi.getDocumentList,
    staleTime: 1000 * 60,
  })
}

/* 문서 상세 */
export const useDocumentDetailQuery = (documentId?: string) => {
  return useQuery<DocumentDetail>({
    queryKey: documentQueryKeys.detail(documentId ?? ''),
    queryFn: () => documentApi.getDocumentDetail(documentId!),
    enabled: !!documentId,
  })
}

/* 문서 생성 */
export const useCreateDocumentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: documentApi.createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentQueryKeys.list(),
      })
    },
  })
}

/* 문서 수정 */
export const useUpdateDocumentMutation = (documentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      name?: string
      description?: string
    }) => documentApi.updateDocument(documentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentQueryKeys.detail(documentId),
      })
      queryClient.invalidateQueries({
        queryKey: documentQueryKeys.list(),
      })
    },
  })
}

/* 문서 삭제 */
export const useDeleteDocumentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: documentApi.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentQueryKeys.list(),
      })
    },
  })
}

/* 개정 업로드 */
export const useUploadRevisionMutation = (documentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) =>
      documentApi.uploadDocumentRevision(documentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentQueryKeys.detail(documentId),
      })
    },
  })
}
