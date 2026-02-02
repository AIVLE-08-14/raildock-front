import { Link } from 'react-router-dom'
import { useState } from 'react'

import { useProblemList } from '@/api/queries/problemQueries'
import type { ProblemSimple } from '@/types/problem'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

/** =====================
 * Pagination Config
 * ===================== */
const PAGE_SIZE = 10

function Problem() {
  const { data: problems, isLoading } = useProblemList()
  const [page, setPage] = useState(1)

  if (isLoading) {
    return <div className="p-6">로딩 중...</div>
  }

  if (!problems || problems.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        결함 데이터가 없습니다.
      </div>
    )
  }

  /** 페이지네이션 계산 */
  const totalPages = Math.ceil(problems.length / PAGE_SIZE)
  const startIdx = (page - 1) * PAGE_SIZE
  const pageItems = problems.slice(
    startIdx,
    startIdx + PAGE_SIZE
  )

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">결함 목록</h1>

      {/* 목록 */}
      <div className="grid gap-4">
        {pageItems.map(problem => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  )
}

/** =====================
 * Problem Card
 * ===================== */

function ProblemCard({ problem }: { problem: ProblemSimple }) {
  return (
    <Link to={`/problems/${problem.id}`}>
<Card className="hover:shadow-md transition cursor-pointer py-1">
  <CardContent className="p-4">
    {/* 상단: 제목 + 상태 */}
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-base font-semibold text-foreground">
          {problem.problemNum}
          <span className="ml-2 text-sm text-muted-foreground font-normal">
            {problem.problemType}
          </span>
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <StatusBadge status={problem.status} />
        <SeverityBadge severity={problem.severity} />
      </div>
    </div>

    {/* 하단: 메타 정보 */}
    <div className="mt-2 text-sm text-muted-foreground space-y-1">
      <div>
        감지 시각:{' '}
        {new Date(problem.detectedTime).toLocaleString()}
      </div>
      <div>노선: {problem.railType}</div>
    </div>
  </CardContent>
</Card>

    </Link>
  )
}

/** =====================
 * Pagination Component
 * ===================== */

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        이전
      </Button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1
        return (
          <Button
            key={p}
            size="sm"
            variant={p === page ? 'default' : 'outline'}
            onClick={() => onChange(p)}
          >
            {p}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        다음
      </Button>
    </div>
  )
}

/** =====================
 * Badges
 * ===================== */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    UNASSIGNED: 'destructive',
    ASSIGNED: 'warning',
    RESOLVED: 'success',
    FALSE_POSITIVE: 'secondary',
  }

  return (
    <Badge variant={map[status] as any}>
      {status}
    </Badge>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    S: 'destructive',
    O: 'warning',
    X1: 'default',
    X2: 'secondary',
  }

  return (
    <Badge variant={map[severity] as any}>
      {severity}
    </Badge>
  )
}

export default Problem
