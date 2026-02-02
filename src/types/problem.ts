// src/types/problem.ts

/** =====================
 *  Enum / Union Types
 *  ===================== */

export type ProblemStatus =
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'RESOLVED'
  | 'FALSE_POSITIVE'

export type RailType =
  | 'HIGH_SPEED'
  | 'GENERAL'
  | 'URBAN'
  | 'LIGHT_RAIL'

export type Severity = 'S' | 'O' | 'X1' | 'X2'

/** =====================
 *  Entity Types
 *  ===================== */

export interface ProblemSimple {
  id: string
  problemNum: string
  problemType: string
  severity: Severity
  status: ProblemStatus
  railType: RailType
  latitude: number
  longitude: number
  detectedTime: string
}

export interface ProblemDetail extends ProblemSimple {
  detectionId: string
  severityReason?: string
  reference?: string
  component?: string
  region?: string
  weather?: string
  temperature?: number
  humidity?: number
  managerId?: number
  sourceImageId?: string
  boundingBoxJsonId?: string
}

/** =====================
 *  Request DTO Types
 *  ===================== */

export interface CreateProblemParams {
  detectionId: string
  problemNum: string
  problemType: string
  railType: RailType
  component?: string
  severity: Severity
  severityReason?: string
  latitude: number
  longitude: number
  region?: string
  weather?: string
  temperature?: number
  humidity?: number
  detectedTime: string
  sourceImageId?: string
  boundingBoxJsonId?: string
}

export interface UpdateProblemParams {
  severity?: Severity
  severityReason?: string
  reference?: string
  managerId?: number
  problemType?: string
  component?: string
  railType?: RailType
  region?: string
  weather?: string
  temperature?: number
  humidity?: number
}
