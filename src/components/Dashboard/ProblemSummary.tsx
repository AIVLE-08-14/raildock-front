import { useNavigate } from 'react-router-dom'
import {
  useDashboardProblemStatus,
  useDashboardRecentProblems,
} from '@/api/queries/dashboardProblemQueries'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function ProblemSummary() {
  const navigate = useNavigate()
  const { data: status } = useDashboardProblemStatus()
  const { data: recentProblems } = useDashboardRecentProblems()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>결함 요약</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 상태 요약 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/40 p-4 text-center">
            <p className="text-sm text-muted-foreground">미배정</p>
            <p className="mt-1 text-3xl font-bold text-destructive">
              {status?.unassignedCount ?? 0}
            </p>
          </div>

          <div className="rounded-lg bg-muted/40 p-4 text-center">
            <p className="text-sm text-muted-foreground">배정</p>
            <p className="mt-1 text-3xl font-bold text-primary">
              {status?.assignedCount ?? 0}
            </p>
          </div>
        </div>

        <Separator />

        {/* 최근 결함 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">
            신규 결함 (최근 10건)
          </h3>

          <ul className="space-y-2">
            {recentProblems?.map((problem) => (
              <li
                key={problem.id}
                className="flex items-center justify-between rounded-md border px-3 py-2 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => navigate(`/problems/${problem.id}`)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {problem.problemType}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(problem.detectedTime).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline">{problem.severity}</Badge>

                  <Badge
                    variant={
                      problem.status === 'UNASSIGNED'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {problem.status === 'UNASSIGNED' ? '미배정' : '배정'}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
