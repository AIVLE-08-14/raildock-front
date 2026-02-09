// src/types/detect.ts
export type DetectCategory = 'rail' | 'insulator' | 'nest'
export type VideoTaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
export type LlmTaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

// 결함 리스트
export interface DetectListItem {
  id: number
  name: string
  section: string
  datetime: string
  direction: string
  taskStatus: VideoTaskStatus
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

export interface DetectProblem {
  id: string // UUID
  problemNum: string
  problemType: string
  model: 'INSULATOR' | 'RAIL' | 'NEST' | string
  severity: string
  status: string
  railType: string
  latitude: number
  longitude: number
  detectedTime: string // ISO datetime
}

export interface DetectProblems {
  insulator: DetectProblem[]
  rail: DetectProblem[]
  nest: DetectProblem[]
}

export interface DetectDetail {
  id: number
  name: string
  createdAt: string
  updatedAt: string

  metadataUrl?: string

  insulatorVideoUrl?: string
  railVideoUrl?: string
  nestVideoUrl?: string

  videoTaskStatus: VideoTaskStatus
  taskErrorMessage?: string
  videoResultZipUrl?: string

  llmTaskStatus?: LlmTaskStatus

  insulatorReportUrl?: string
  railReportUrl?: string
  nestReportUrl?: string

  problems: DetectProblems
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
