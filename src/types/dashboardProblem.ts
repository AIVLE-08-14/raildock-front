// types/dashboardProblem.ts

// 공통 Enum / Union Type

// 결함 심각도
export type ProblemSeverity = 'S' | 'A' | 'B' | 'C'

// 결함 상태
export type ProblemStatus = 'UNASSIGNED' | 'ASSIGNED'

// 선로 타입
export type RailType = 'HIGH_SPEED' | 'GENERAL' | 'METRO'

// 추이 조회 단위
export type TrendUnit = 'DAY' | 'MONTH' | 'YEAR'

// 1. 결함 카운트 추이
// GET /dashboard/problem/trend/count

export interface ProblemTrendItem {
  /** 날짜 / 월 / 연도 라벨 */
  label: string
  /** 해당 기간 결함 수 */
  count: number
}

export type ProblemTrendResponse = ProblemTrendItem[]

// 2. 결함 상태 요약
// GET /dashboard/problem/status

export interface ProblemStatusSummaryResponse {
  unassignedCount: number
  assignedCount: number
}

// 3. 최근 결함 목록 (10건)
// GET /dashboard/problem/recent

export interface RecentProblemItem {
  id: string
  problemNum: string
  problemType: string
  severity: ProblemSeverity
  status: ProblemStatus
  railType: RailType
  latitude: number
  longitude: number
  detectedTime: string // ISO Date String
}

export type RecentProblemResponse = RecentProblemItem[]

// 4. 이번 달 결함 타입 분포
// GET /dashboard/problem/current/by-type

export interface ProblemTypeDistributionItem {
  key: string
  count: number
}

export type ProblemTypeDistributionResponse =
  ProblemTypeDistributionItem[]

// 5. GIS용 결함 전체 조회
// GET /dashboard/problem/GIS

export interface GisProblemItem {
  id: string
  problemNum: string
  problemType: string
  severity: ProblemSeverity
  status: ProblemStatus
  railType: RailType
  latitude: number
  longitude: number
  detectedTime: string // ISO Date String
}

export type GisProblemResponse = GisProblemItem[]

// Dashboard 파생 타입 (선택)

// 지도 마커 최소 타입
export type GisProblemMarker = Pick<
  GisProblemItem,
  'id' | 'latitude' | 'longitude' | 'severity' | 'status'
>

// 테이블 표시용 요약 타입
export type DashboardProblemRow = Pick<
  RecentProblemItem,
  'problemNum' | 'problemType' | 'severity' | 'status' | 'detectedTime'
>
