export type RiskLevel = "심각" | "주의" | "보통"

export interface Defect {
  id: number
  occurredAt: string
  completed: boolean
  lat: number
  lng: number
  line: string
  defectTypes: string[]
  riskLevel: RiskLevel
}
//더미데이터 타입 정의. 실제 데이터 들어온다면 삭제해도 됨.