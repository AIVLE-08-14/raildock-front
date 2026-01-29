// components/reports/DetectTrend.tsx
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

type Period = 'day' | 'month' | 'year'
type View = 'graph' | 'table'

export default function DetectTrend() {
  const [view, setView] = useState<View>('graph')
  const [period, setPeriod] = useState<Period>('month')

  /** 나중에 API 데이터로 교체 */
  const data: {
    label: string
    심각: number
    주의: number
    보통: number
  }[] = []

  return (
    <Card className="p-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">결함 추이</h3>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant={view === 'graph' ? 'default' : 'outline'}
            onClick={() => setView('graph')}
          >
            그래프
          </Button>
          <Button
            size="sm"
            variant={view === 'table' ? 'default' : 'outline'}
            onClick={() => setView('table')}
          >
            표
          </Button>
        </div>
      </div>

      {/* 기간 토글 */}
      <div className="flex gap-1 mb-4">
        {(['day', 'month', 'year'] as const).map((p) => (
          <Button
            key={p}
            size="sm"
            variant={period === p ? 'default' : 'outline'}
            onClick={() => setPeriod(p)}
          >
            {p === 'day' && '일'}
            {p === 'month' && '월'}
            {p === 'year' && '년'}
          </Button>
        ))}
      </div>

      {/* 본문 */}
      {view === 'graph' ? (
        data.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            추이 데이터가 없습니다.
          </div>
        ) : (
          <LineChart width={500} height={250} data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line dataKey="심각" strokeWidth={2} />
            <Line dataKey="주의" strokeWidth={2} />
            <Line dataKey="보통" strokeWidth={2} />
          </LineChart>
        )
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th>기간</th>
              <th>심각</th>
              <th>주의</th>
              <th>보통</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              data.map((d) => (
                <tr key={d.label}>
                  <td>{d.label}</td>
                  <td className="text-red-600">{d.심각}</td>
                  <td className="text-yellow-600">{d.주의}</td>
                  <td className="text-green-600">{d.보통}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </Card>
  )
}
