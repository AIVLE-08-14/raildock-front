import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { useDashboardProblemTrend } from '@/api/queries/dashboardProblemQueries'
import type { TrendUnit } from '@/types/dashboardProblem'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export default function ProblemTrendChart() {
  const [unit, setUnit] = useState<TrendUnit>('DAY')
  const { data } = useDashboardProblemTrend(unit)

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>결함 카운트 추이</CardTitle>

        <Tabs
          value={unit}
          onValueChange={v => setUnit(v as TrendUnit)}
        >
          <TabsList>
            <TabsTrigger value="DAY">일</TabsTrigger>
            <TabsTrigger value="MONTH">월</TabsTrigger>
            <TabsTrigger value="YEAR">년</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="label"
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
