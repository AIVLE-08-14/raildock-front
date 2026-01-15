// components/reports/DefectAlerts.tsx
import { defectData } from "@/data/defects"
import { Card } from "@/components/ui/card"

export default function DefectAlerts() {
  const latest = [...defectData]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 10)

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">최근 결함 알림</h3>

      <ul className="space-y-2 text-sm">
        {latest.map((d) => (
          <li key={d.id} className="flex justify-between">
            <div>
              <div className="font-medium">
                {d.line} / {d.defectTypes.join(", ")}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(d.occurredAt).toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <div className={
                d.riskLevel === "심각"
                  ? "text-red-600"
                  : d.riskLevel === "주의"
                  ? "text-yellow-600"
                  : "text-green-600"
              }>
                {d.riskLevel}
              </div>
              <div className="text-xs">
                {d.completed ? "완료" : "미처리"}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
