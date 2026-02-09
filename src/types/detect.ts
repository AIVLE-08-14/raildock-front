// src/types/detect.ts
export type DetectCategory = 'rail' | 'insulator' | 'nest'

// 결함 리스트
export interface DetectListItem {
  id: number
  name: string
  section: string
  datetime: string
  direction: string
  taskStatus: string
}

export interface DetectListResponse {
  items: DetectListItem[]
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
  name: string
  section: string
  datetime: string
  direction: string
  weather?: string
  temperature?: number
  humidity?: number

  metadataUrl?: string

  insulatorVideoUrl?: string
  railVideoUrl?: string
  nestVideoUrl?: string

  taskStatus: string
  errorMessage?: string
  resultZipUrl?: string
}

// 생성 (업로드)
export interface CreateDetectParams {
  name: string

  files: {
    metadata: File
    insulatorVideo?: File
    railVideo?: File
    nestVideo?: File
  }
}

export interface CreateDetectResponse {
  detectionId: number
}
