// components/reports/DefectSummary.tsx
import { useState } from "react"
import { defectData } from "@/data/defects"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Tooltip } from "recharts"
import { groupCount } from "@/utils/groups"

export default function DefectSummary() {
  const [view, setView] = useState<"chart" | "table">("chart")

  const typeCounts = groupCount(
    defectData.flatMap((d) => d.defectTypes)
  )

  const lineCounts = groupCount(
    defectData.map((d) => d.line)
  )

  const typeChart = Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
  }))

  const lineChart = Object.entries(lineCounts).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <Card className="p-4">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">결함 요약</h3>
        <div className="flex gap-1">
          <Button size="sm" onClick={() => setView("chart")}>차트</Button>
          <Button size="sm" variant="outline" onClick={() => setView("table")}>표</Button>
        </div>
      </div>

      {view === "chart" ? (
        <div className="flex gap-8">
          <PieChart width={200} height={200}>
            <Pie data={typeChart} dataKey="value" nameKey="name" outerRadius={80} />
            <Tooltip />
          </PieChart>

          <PieChart width={200} height={200}>
            <Pie data={lineChart} dataKey="value" nameKey="name" outerRadius={80} />
            <Tooltip />
          </PieChart>
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
            {typeChart.map((d) => (
              <tr key={d.name}>
                <td>{d.name}</td>
                <td>{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}
