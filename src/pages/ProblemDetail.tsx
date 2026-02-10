import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import {
  useProblemDetail,
  useDeleteProblem,
  useUpdateProblemStatus,
  useUpdateProblemManager,
} from '@/api/queries/problemQueries'
import { useCreateBBoxFeedback } from '@/api/queries/bboxQueries'

import type { ProblemStatus } from '@/types/problem'
import type { BBoxDetection, BBoxJson } from '@/types/bbox'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import BBoxCanvas from '@/components/problem/BBoxCanvas'
import useReloadOnResize from '@/hook/useReloadOnResize'
import { parseProblemStatus } from '@/utils/parseProblemStatus'

const STATUS_OPTIONS = ['UNASSIGNED','ASSIGNED','RESOLVED','FALSE_POSITIVE'] as const

// 상태 한글 맵
const STATUS_MAP: Record<string, string> = {
  UNASSIGNED: '미배정',
  ASSIGNED: '배정',
  RESOLVED: '해결',
  FALSE_POSITIVE: '오탐',
}

// 위험도 한글 맵
const SEVERITY_MAP: Record<string, string> = {
  S: '위험',
  O: '주의',
  X1: '보통',
  X2: '낮음',
}

function ProblemDetail() {
  useReloadOnResize(300)

  const { id = '' } = useParams()
  const navigate = useNavigate()

  const { data: problem, isLoading } = useProblemDetail(id)

  const deleteMutation = useDeleteProblem()
  const statusMutation = useUpdateProblemStatus(id)
  const managerMutation = useUpdateProblemManager(id)
  const feedbackMutation = useCreateBBoxFeedback()

  const [status, setStatus] = useState<ProblemStatus>('UNASSIGNED')
  const [managerId, setManagerId] = useState<number>(0)

  /** BBox 상태 */
  const [isEditMode, setIsEditMode] = useState(false)
  const [original, setOriginal] = useState<BBoxDetection[]>([])
  const [draft, setDraft] = useState<BBoxDetection[]>([])
  const [isDirty, setIsDirty] = useState(false)

  /** 문제 정보 초기화 */
  useEffect(() => {
    if (!problem) return
    setStatus(problem.status)
    setManagerId(problem.managerId ?? 0)
  }, [problem])

  /** ✅ BBox JSON 로딩 (id 보장) */
  useEffect(() => {
    if (!problem?.boundingBoxJsonIdURL) return

    fetch(problem.boundingBoxJsonIdURL)
      .then(res => res.json())
      .then((json: BBoxJson) => {
        const detections: BBoxDetection[] =
          json.detections.map((d, idx) => ({
            ...d,
            id: d.id ?? `bbox-${idx}`, // ✅ 핵심
          }))

        setOriginal(detections)
        setDraft(detections)
      })
  }, [problem])

  /** BBox 삭제 */
  const handleDeleteBBox = (bboxId: string) => {
    setDraft(prev => prev.filter(b => b.id !== bboxId))
    setIsDirty(true)
  }

  /** 수정 모드 토글 */
  const toggleEditMode = () => {
    if (isEditMode && isDirty) {
      if (!confirm('저장되지 않은 변경사항을 버릴까요?')) return
      setDraft(original)
      setIsDirty(false)
    }
    setIsEditMode(v => !v)
  }

  /** BBox 저장 */
  const handleSaveBBox = () => {
    const json: BBoxJson = { detections: draft }

    const file = new File(
      [JSON.stringify(json, null, 2)],
      `bbox-feedback-${id}.json`,
      { type: 'application/json' }
    )

    feedbackMutation.mutate(
      { problemId: id, jsonFile: file },
      {
        onSuccess: () => {
          setOriginal(draft)
          setIsDirty(false)
          setIsEditMode(false)
        },
      }
    )
  }

  if (isLoading || !problem) {
    return <div className="p-6">로딩 중...</div>
  }

  const detections = parseProblemStatus(problem.problemStatus ?? '')

  return (
    <div className="flex h-[calc(100vh-70px)]">
      {/* 좌측 */}
      <main className="flex-1 p-6 overflow-auto space-y-4">
        <Button
          variant="link"
          className="px-0"
          onClick={() => navigate(-1)}
        >
          ← 목록으로
        </Button>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              결함 정보
              <Badge variant="outline">
                {SEVERITY_MAP[problem.severity] || problem.severity}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-sm">
            {/* 기본 정보 */}
            <div className="grid grid-cols-4 gap-4">
              <Info label="결함 번호" value={problem.problemNum} />
              <Info label="결함 ID" value={problem.id} />
              <Info label="Detection ID" value={problem.detectionId} />
              <Info label="유형" value={problem.problemType} />

              <Info
                label="상태"
                value={STATUS_MAP[problem.status] || problem.status}
              />
              <Info label="노선" value={problem.railType} />
              <Info
                label="위치"
                value={`${problem.latitude}, ${problem.longitude}`}
              />
              <Info
                label="감지 시각"
                value={new Date(problem.detectedTime).toLocaleString()}
              />
            </div>

            <Separator className='mb-2'/>

            {/* 상태 / 담당자 변경 / 삭제 */}
            <div className="grid grid-cols-4 gap-6">
              {/* 상태 변경 */}
              <div className="flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">상태 변경</div>
                  <Select
                    value={status}
                    onValueChange={v => {
                      const next = v as ProblemStatus
                      setStatus(next)
                      statusMutation.mutate(next)
                    }}
                  >
                    <SelectTrigger className="w-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(s => (
                        <SelectItem key={s} value={s}>
                          {STATUS_MAP[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 담당자 */}
              <div className="flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">담당자 ID</div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={managerId}
                      onChange={e => setManagerId(Number(e.target.value))}
                    />
                    <Button
                      variant="secondary"
                      className="shrink-0"
                      onClick={() => managerMutation.mutate(managerId)}
                    >
                      변경
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-1">
                <div className="text-xs text-muted-foreground text-right">결함 삭제</div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant={isEditMode ? 'destructive' : 'outline'}
                    onClick={toggleEditMode}
                  >
                    {isEditMode ? '수정 종료' : '오탐 수정'}
                  </Button>
                  <Button disabled={!isDirty} onClick={handleSaveBBox}>
                    저장
                  </Button>
                </div>

                </div>
              </div>

            {/* 삭제 */}
            <div className="flex flex-col justify-between">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground text-right">결함 삭제</div>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('정말 삭제하시겠습니까?')) {
                        deleteMutation.mutate(id, {
                          onSuccess: () => navigate('/problems'),
                        })
                      }
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* 이미지 + BBox */}
        <Card>
          <BBoxCanvas
            imageUrl={problem.sourceImageIdURL}
            detections={draft}
            editable={isEditMode}
            onDelete={handleDeleteBBox}
            />
        </Card>
      </main>

      {/* 우측 */}
      <aside className="w-[28vw] max-w-[520px] border-l bg-muted/30 p-6 overflow-auto">
        <div className="space-y-8">
          {/* 탐지 상세 */}
          {detections.length > 0 && (
            <Card className='gap-2 py-4 mb-4'>
              <CardHeader>
                <CardTitle className="text-base">
                  탐지 상세 ({detections.length}건)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {detections.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-md border p-3 space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{d.target}</div>
                      <div className="font-semibold">
                        {d.confidence}%
                      </div>
                    </div>

                    {d.description && (
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {d.description}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {problem.severityReason && (
            <Card className='gap-2 py-4 mb-4'>
              <CardHeader>
                <CardTitle className="text-base">심각도 사유</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-2 rounded-md border bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {problem.severityReason}
                </div>
              </CardContent>
            </Card>
          )}

          {problem.recommendedActions && (
            <Card className='gap-2 py-4 mb-4'>
              <CardHeader>
                <CardTitle className="text-base">권장 조치</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-2 rounded-md border bg-background p-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {problem.recommendedActions}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </aside>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium break-all">{value}</div>
    </div>
  )
}

export default ProblemDetail
