import type { Defect } from "@/types/defect"

const lines = ["1호선", "2호선", "3호선", "경부선", "호남선"]
const defectTypes = ["균열", "침하", "부식", "전기이상", "신호오류"]
const riskLevels = ["심각", "주의", "보통"] as const

function randomItem<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const defectData: Defect[] = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  occurredAt: new Date(
    Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30
  ).toISOString(),
  completed: Math.random() > 0.5,
  lat: 37.3 + Math.random() * 0.2,
  lng: 127.0 + Math.random() * 0.2,
  line: randomItem(lines),
  defectTypes: [
    randomItem(defectTypes),
    ...(Math.random() > 0.7 ? [randomItem(defectTypes)] : []),
  ],
  riskLevel: randomItem(riskLevels),
}))
//더미데이터 생성. 실제 데이터 들어온다면 삭제해도 됨.