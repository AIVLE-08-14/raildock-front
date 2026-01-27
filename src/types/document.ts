// types/document.ts

// 문서 목록 (기존 API 유지 가정)
export interface DocumentListItem {
  id: string
  name: string
  latestVersion: number
  updatedAt: string
}

// 문서 개정 이력 (GET /documents/{id} 기준)
export interface DocumentRevision {
  revisionId: string
  version: number
  createdAt: string
  createdBy: number
  downloadUrl: string
}

// 문서 상세 (최신본은 history에서 계산)
export interface DocumentDetail {
  id: string
  name: string
  description: string
  createdAt: string
  history: DocumentRevision[]
}
