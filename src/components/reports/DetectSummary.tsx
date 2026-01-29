// components/reports/DetectSummary.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PieChart, Pie, Tooltip } from 'recharts'

export default function DetectSummary() {
  const [view, setView] = useState<'chart' | 'table'>('chart')

  /** 나중에 API 데이터로 교체 */
  const typeChart: { name: string; value: number }[] = []
  const lineChart: { name: string; value: number }[] = []

  return (
    <Card className="p-4">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">결함 요약</h3>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant={view === 'chart' ? 'default' : 'outline'}
            onClick={() => setView('chart')}
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

      {view === 'chart' ? (
        <div className="flex gap-8 justify-center py-6 text-sm text-gray-400">
          {typeChart.length === 0 ? (
            <div>요약 데이터가 없습니다.</div>
          ) : (
            <>
              <PieChart width={200} height={200}>
                <Pie
                  data={typeChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                />
                <Tooltip />
              </PieChart>

              <PieChart width={200} height={200}>
                <Pie
                  data={lineChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                />
                <Tooltip />
              </PieChart>
            </>
          )}
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th>구분</th>
              <th>건수</th>
            </tr>
          </thead>
          <tbody>
            {typeChart.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-6 text-center text-gray-400">
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              typeChart.map((d) => (
                <tr key={d.name}>
                  <td>{d.name}</td>
                  <td>{d.value}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </Card>
  )
}
