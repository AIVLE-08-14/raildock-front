// components/reports/DetectAlerts.tsx
import { Card } from '@/components/ui/card'

type DetectAlertItem = {
  id: number
  line: string
  detectTypes: string[]
  occurredAt: string
  riskLevel: '심각' | '주의' | '양호'
  completed: boolean
}

export default function DetectAlerts() {
  /** =====================
   * 나중에 API / props로 대체
   * ===================== */
  const alerts: DetectAlertItem[] = []

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">최근 결함 알림</h3>

      {alerts.length === 0 ? (
        <div className="text-sm text-gray-400 py-6 text-center">
          최근 결함 알림이 없습니다.
        </div>
      ) : (
        <ul className="space-y-2 text-sm">
          {alerts.map((d) => (
            <li key={d.id} className="flex justify-between">
              <div>
                <div className="font-medium">
                  {d.line} / {d.detectTypes.join(', ')}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(d.occurredAt).toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <div
                  className={
                    d.riskLevel === '심각'
                      ? 'text-red-600'
                      : d.riskLevel === '주의'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }
                >
                  {d.riskLevel}
                </div>
                <div className="text-xs">
                  {d.completed ? '완료' : '미처리'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
