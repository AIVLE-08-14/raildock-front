// src/pages/ProblemDetail.tsx

import { useNavigate, useParams } from 'react-router-dom'
import { useProblemDetail, useDeleteProblem, useUpdateProblemStatus, useUpdateProblemManager,} from '@/api/queries/problemQueries'
import type { ProblemStatus } from '@/types/problem'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle,} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const [status, setStatus] = useState<ProblemStatus>('UNASSIGNED')

const STATUS_OPTIONS = [
  'UNASSIGNED',
  'ASSIGNED',
  'RESOLVED',
  'FALSE_POSITIVE',
] as const

function ProblemDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const { data: problem, isLoading } = useProblemDetail(id)

  const deleteMutation = useDeleteProblem()
  const statusMutation = useUpdateProblemStatus(id)
  const managerMutation = useUpdateProblemManager(id)

  const [status, setStatus] = useState<ProblemStatus>('UNASSIGNED')
  const [managerId, setManagerId] = useState<number>(0)

  useEffect(() => {
    if (problem) {
      setStatus(problem.status)
      setManagerId(problem.managerId ?? 0)
    }
  }, [problem])

  if (isLoading || !problem) {
    return <div className="p-6">로딩 중...</div>
  }

  return (
    <div className="flex h-[calc(100vh-70px)]">
      {/* 좌측: 이미지 / 분석 영역 */}
      <main className="flex-1 p-6 overflow-auto">
        <Button
          variant="link"
          className="px-0 mb-4"
          onClick={() => navigate(-1)}
        >
          ← 목록으로
        </Button>

        <Card>
          <CardContent className="h-[450px] flex items-center justify-center text-muted-foreground">
            이미지 / BBox 영역 (연결 예정)
          </CardContent>
        </Card>
      </main>

      {/* 우측: 정보 패널 */}
      <aside className="w-[420px] border-l bg-muted/30 p-6 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              결함 정보
              <Badge variant="outline">{problem.severity}</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <Info label="결함 번호" value={problem.problemNum} />
            <Info label="유형" value={problem.problemType} />
            <Info label="노선" value={problem.railType} />
            <Info
              label="위치"
              value={`${problem.latitude}, ${problem.longitude}`}
            />
            <Info
              label="감지 시각"
              value={new Date(
                problem.detectedTime
              ).toLocaleString()}
            />

            <Separator />

            {/* 상태 변경 */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                상태 변경
              </div>
              <Select
                value={status}
                onValueChange={value => {
                  const nextStatus = value as ProblemStatus
                  setStatus(nextStatus)
                  statusMutation.mutate(nextStatus)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 담당자 변경 */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                담당자 ID
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={managerId}
                  onChange={e =>
                    setManagerId(Number(e.target.value))
                  }
                />
                <Button
                  onClick={() =>
                    managerMutation.mutate(managerId)
                  }
                >
                  변경
                </Button>
              </div>
            </div>

            <Separator />

            {/* 삭제 */}
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                if (confirm('정말 삭제하시겠습니까?')) {
                  deleteMutation.mutate(id, {
                    onSuccess: () => navigate('/problems'),
                  })
                }
              }}
            >
              결함 삭제
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

/** 공통 Info Row */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">
        {label}
      </div>
      <div className="font-medium break-all">
        {value}
      </div>
    </div>
  )
}

export default ProblemDetail
