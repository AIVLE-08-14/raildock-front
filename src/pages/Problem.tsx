import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'

import { useProblemList } from '@/api/queries/problemQueries'
import type { ProblemSimple } from '@/types/problem'

import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

//Pagination Config
const PAGE_SIZE = 10

//Problem Type List
const problemTypes = [
  // ===== 선로 =====
  { key: '선로(전체)', group: 'RAIL', isGroup: true },
  { key: '훼손', group: 'RAIL', isGroup: false },
  { key: '너트 풀림', group: 'RAIL', isGroup: false },
  // ===== 애자 =====
  { key: '애자(전체)', group: 'INSULATOR', isGroup: true },
  { key: '균열 파손', group: 'INSULATOR', isGroup: false },
  { key: '이탈', group: 'INSULATOR', isGroup: false },
  { key: '마모 등', group: 'INSULATOR', isGroup: false },
  { key: '탈락', group: 'INSULATOR', isGroup: false },
  { key: '파손', group: 'INSULATOR', isGroup: false },
  { key: '마모 커버 탈락', group: 'INSULATOR', isGroup: false },
  // ===== 둥지 =====
  { key: '탐지', group: 'NEST', isGroup: true },
]

function Problem() {
  const { data: problems, isLoading } = useProblemList()
  const [page, setPage] = useState(1)

  //Filtering 상태
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL')
  const [filterProblemType, setFilterProblemType] = useState<string>('ALL')
  const [searchNum, setSearchNum] = useState('')

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

  //Filtering 적용
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const statusMatch =
        filterStatus === 'ALL' || p.status === filterStatus
      const severityMatch =
        filterSeverity === 'ALL' || p.severity === filterSeverity

      /** 문제 타입 필터링 */
      let problemTypeMatch = true
      if (filterProblemType !== 'ALL') {
        if (filterProblemType === '선로(전체)') {
          problemTypeMatch = ['훼손', '너트 풀림'].includes(p.problemType)
        } else if (filterProblemType === '애자(전체)') {
          const insulatorTypes = problemTypes
            .filter(
              (pt) => pt.group === 'INSULATOR' && !pt.isGroup
            )
            .map((pt) => pt.key)
          problemTypeMatch = insulatorTypes.includes(p.problemType)
        } else {
          problemTypeMatch = p.problemType === filterProblemType
        }
      }

      const searchNumMatch =
        searchNum === '' ||
        p.problemNum.toLowerCase().includes(searchNum.toLowerCase())

      return statusMatch && severityMatch && problemTypeMatch && searchNumMatch
    })
  }, [problems, filterStatus, filterSeverity, filterProblemType, searchNum])

  /** 페이지네이션 계산 */
  const totalPages = Math.ceil(filteredProblems.length / PAGE_SIZE)
  const startIdx = (page - 1) * PAGE_SIZE
  const pageItems = filteredProblems.slice(startIdx, startIdx + PAGE_SIZE)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">결함 목록</h1>

      {/* 필터 */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* 문제 번호 검색 */}
        <Input
          placeholder="문제 번호 검색"
          className="flex-1 min-w-[220px] max-w-sm"
          value={searchNum}
          onChange={(e) => setSearchNum(e.target.value)}
        />
        
        {/* 문제 타입 */}
        <Select value={filterProblemType} onValueChange={setFilterProblemType}>
          <SelectTrigger className="w-56 flex-1 min-w-[200px] max-w-xs">
            <SelectValue placeholder="문제 유형 선택" />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-auto">
            <SelectItem value="ALL">문제 유형(전체)</SelectItem>
            {problemTypes.map((pt) => (
              <SelectItem key={pt.key} value={pt.key}>
                {pt.key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 상태 */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 flex-1 min-w-[160px] max-w-xs">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">상태(전체)</SelectItem>
            <SelectItem value="UNASSIGNED">미배정</SelectItem>
            <SelectItem value="ASSIGNED">배정</SelectItem>
            <SelectItem value="RESOLVED">해결</SelectItem>
            <SelectItem value="FALSE_POSITIVE">False Positive</SelectItem>
          </SelectContent>
        </Select>

        {/* 심각도 */}
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-40 flex-1 min-w-[160px] max-w-xs">
            <SelectValue placeholder="심각도 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">위험도(전체)</SelectItem>
            <SelectItem value="S">위험</SelectItem>
            <SelectItem value="O">주의</SelectItem>
            <SelectItem value="X1">보통</SelectItem>
            <SelectItem value="X2">낮음</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* 목록 */}
      <div className="grid gap-4">
        {pageItems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}

//Problem Card
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
              감지 시각: {new Date(problem.detectedTime).toLocaleString()}
            </div>
            <div>노선: {problem.railType}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

//Pagination Component
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

//Badges
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    UNASSIGNED: 'destructive',
    ASSIGNED: 'warning',
    RESOLVED: 'success',
    FALSE_POSITIVE: 'secondary',
  }

  const textMap: Record<string, string> = {
    UNASSIGNED: '미배정',
    ASSIGNED: '배정',
    RESOLVED: '해결',
    FALSE_POSITIVE: 'False Positive',
  }

  return <Badge variant={map[status] as any}>{textMap[status] || status}</Badge>
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    S: 'destructive',
    O: 'warning',
    X1: 'default',
    X2: 'secondary',
  }

  const textMap: Record<string, string> = {
    S: '위험',
    O: '주의',
    X1: '보통',
    X2: '낮음',
  }

  return <Badge variant={map[severity] as any}>{textMap[severity] || severity}</Badge>
}

export default Problem
