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

const STATUS_OPTIONS = [
  'UNASSIGNED',
  'ASSIGNED',
  'RESOLVED',
  'FALSE_POSITIVE',
] as const

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

        {/* 결함 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              결함 정보
              <Badge variant="outline">{problem.severity}</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-6 gap-3 text-sm">
            <Info label="결함 번호" value={problem.problemNum} />
            <Info label="결함 ID" value={problem.id} />
            <Info label="Detection ID" value={problem.detectionId} />
            <Info label="유형" value={problem.problemType} />
            <Info label="상태" value={problem.status} />
            <Info label="노선" value={problem.railType} />
            <Info
              label="위치"
              value={`${problem.latitude}, ${problem.longitude}`}
            />
            <Info
              label="감지 시각"
              value={new Date(problem.detectedTime).toLocaleString()}
            />

            {/* 상태 변경 */}
            <Select
              value={status}
              onValueChange={v => {
                const next = v as ProblemStatus
                setStatus(next)
                statusMutation.mutate(next)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(s => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 담당자 */}
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

            <Button
              variant="destructive"
              className="col-span-6"
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

        {/* 이미지 + BBox */}
        <Card>
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle>BBox</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={isEditMode ? 'destructive' : 'outline'}
                onClick={toggleEditMode}
              >
                {isEditMode ? '수정 종료' : 'BBox 수정'}
              </Button>
              <Button disabled={!isDirty} onClick={handleSaveBBox}>
                저장
              </Button>
            </div>
          </CardHeader>

          <CardContent className="overflow-auto">
            <BBoxCanvas
              imageUrl={problem.sourceImageIdURL}
              detections={draft}
              editable={isEditMode}
              onDelete={handleDeleteBBox}
            />
          </CardContent>
        </Card>
      </main>

      {/* 우측 */}
      <aside className="w-[35vw] border-l bg-muted/30 p-6 overflow-auto">
        <Card>
          <CardContent className="space-y-4 text-sm">
            {problem.recommendedActions && (
              <Info
                label="권장 조치"
                value={problem.recommendedActions}
              />
            )}
            {problem.problemStatus && (
              <Info
                label="문제 상태"
                value={problem.problemStatus}
              />
            )}
            {problem.severityReason && (
              <Info
                label="심각도 사유"
                value={problem.severityReason}
              />
            )}
            {problem.reference && (
              <Info label="참고 정보" value={problem.reference} />
            )}
          </CardContent>
        </Card>
        <Separator />
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
