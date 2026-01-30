import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

import { useDashboardProblemByType } from '@/api/queries/dashboardProblemQueries'
import {
  mapMonthlyProblemBarData,
  type ProblemBarChartItem,
} from '@/utils/problemChartMapper'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'



export default function MonthlyProblemByTypeChart() {
  const { data } = useDashboardProblemByType()
  const chartData = mapMonthlyProblemBarData(data)

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            월간 결함 타입별 통계
          </CardTitle>
        </div>
      </CardHeader>

      

      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={520}>
          <BarChart
            data={chartData}
            layout="vertical"
            barCategoryGap={12}
            margin={{ top: 5, right: 10, left: 10 }}
          >
            <XAxis
              type="number"
              allowDecimals={false}
              tickCount={6}
            />

            <YAxis
              type="category"
              dataKey="key"
              width={70}
              padding={{ top: 5, bottom: 5 }}
              tick={{ fontSize: 12, fontWeight: 500}}
              tickMargin={6}
            />

            <RechartsTooltip
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              formatter={(value: number | undefined) => [`${value ?? 0}건`, '결함 수']}
            />

            <Bar dataKey="count" barSize={18}>
              {chartData.map((entry: ProblemBarChartItem, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.isGroup
                      ? '#f97316' // 대분류
                      : '#60a5fa' // 소분류
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
