// src/types/detect.ts
export type DetectCategory = 'rail' | 'insulator' | 'nest'

// 결함 리스트
export interface DetectListItem {
  id: number
  fileName: string
  createdAt: string
}

export interface DetectListResponse {
  content: DetectListItem[]
  page: number
  size: number
  totalElements: number
}

// 결함 상세
export interface DetectMetadata {
  camera_id?: number
  file_name?: string
  direction?: string
  length?: string
  fps?: number
  width?: number
  height?: number
  resolution?: string
  datetime?: string
  region_name?: string
  weather?: string
  temperature?: number
  humidity?: number
  illuminance?: number
}

export interface DetectResult {
  category: DetectCategory
  videoUrl: string
  imageUrls: string[]
}

export interface DetectDetail {
  id: number
  metadata: DetectMetadata
  results: DetectResult[]
}

// 생성 (업로드)
export interface CreateDetectParams {
  name?: string
  datetime?: string
  section?: string
  direction?: string
  weather?: string
  temperature?: number
  humidity?: number
}

export interface CreateDetectResponse {
  id: number
}
