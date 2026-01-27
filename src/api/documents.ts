// api/documents.ts
import { apiClient } from '@/api/client'
import type { DocumentListItem, DocumentDetail } from '@/types/document'

export const getDocumentList = async (): Promise<DocumentListItem[]> => {
  const { data } = await apiClient.get('/documents/list')
  return data
}

export const getDocumentDetail = async (
  documentId: string
): Promise<DocumentDetail> => {
  const { data } = await apiClient.get(`/documents/${documentId}`)
  return data
}

export const uploadDocumentRevision = async (
  documentId: string,
  file: File
) => {
  const formData = new FormData()
  formData.append('file', file)

  await apiClient.post(
    `/documents/${documentId}/revisions`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
}

export const createDocument = async (payload: {
  name: string
  description: string
}) => {
  const { data } = await apiClient.post('/documents', payload)
  return data // documentId
}

export const deleteDocument = async (
  documentId: string
): Promise<void> => {
  await apiClient.delete(`/documents/${documentId}`)
}

export const updateDocument = async (
  documentId: string,
  payload: {
    name?: string
    description?: string
  }
): Promise<void> => {
  await apiClient.patch(`/documents/${documentId}`, payload)
}