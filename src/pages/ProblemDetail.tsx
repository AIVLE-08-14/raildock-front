// src/pages/ProblemDetail.tsx

import { useNavigate, useParams } from 'react-router-dom'
import {
  useProblemDetail,
  useDeleteProblem,
  useUpdateProblemStatus,
  useUpdateProblemManager,
} from '@/api/queries/problemQueries'
import type { ProblemStatus } from '@/types/problem'
import { useEffect, useState } from 'react'

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
import useReloadOnResize from '@/hook/useReloadOnResize'

const STATUS_OPTIONS = [
  'UNASSIGNED',
  'ASSIGNED',
  'RESOLVED',
  'FALSE_POSITIVE',
] as const

type BBox = {
  x: number
  y: number
  width: number
  height: number
  label: string
  score: number
}

function ProblemDetail() {
  useReloadOnResize(300)
  
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const { data: problem, isLoading } = useProblemDetail(id)

  const deleteMutation = useDeleteProblem()
  const statusMutation = useUpdateProblemStatus(id)
  const managerMutation = useUpdateProblemManager(id)

  const [boxes, setBoxes] = useState<BBox[]>([])
  const [imgSize, setImgSize] = useState({
    width: 1,
    height: 1,
  })

  const [status, setStatus] =
    useState<ProblemStatus>('UNASSIGNED')
  const [managerId, setManagerId] = useState<number>(0)

  /** ✅ BBox JSON 로딩 */
  useEffect(() => {
    if (!problem?.boundingBoxJsonIdURL) return

    fetch(problem.boundingBoxJsonIdURL)
      .then(res => res.json())
      .then(data => {
        const parsed: BBox[] = (data.detections ?? []).map(
          (det: any) => {
            const [x1, y1, x2, y2] = det.bbox_xyxy
            return {
              x: x1,
              y: y1,
              width: x2 - x1,
              height: y2 - y1,
              label: `${det.cls_name} (${det.detail})`,
              score: det.confidence,
            }
          }
        )
        console.log('Parsed BBoxes:', parsed)
        setBoxes(parsed)
      })
      .catch(err => {
        console.error('BBox JSON 로딩 실패', err)
      })
  }, [problem])

  useEffect(() => {
    if (problem) {
      setStatus(problem.status)
      setManagerId(problem.managerId ?? 0)
    }
  }, [problem])

  function handleImageLoad(
    e: React.SyntheticEvent<HTMLImageElement>
  ) {
    const img = e.currentTarget
    setImgSize({
      width: img.clientWidth,
      height: img.clientHeight,
    })
  }

  if (isLoading || !problem) {
    return <div className="p-6">로딩 중...</div>
  }

  return (
    <div className="flex h-[calc(100vh-70px)]">
      {/* 좌측 */}
      <main className="flex-1 p-6 overflow-auto">
        <Button
          variant="link"
          className="px-0 mb-4"
          onClick={() => navigate(-1)}
        >
          ← 목록으로
        </Button>


        <Card className='pt-3 pb-2 gap-2'>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              결함 정보
              <Badge variant="outline">
                {problem.severity}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm grid grid-cols-6 gap-2">
            <Info label="결함 번호" value={problem.problemNum} />
            <Info label="결함 ID" value={problem.id} />
            <Info label="Detection ID" value={problem.detectionId} />
            <Info label="유형" value={problem.problemType} />
            <Info label="심각도" value={problem.severity} />
            <Info label="상태" value={problem.status} />
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

            

            {/* 상태 변경 */}
            <Select
              value={status}
              onValueChange={value => {
                const next =
                  value as ProblemStatus
                setStatus(next)
                statusMutation.mutate(next)
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

            {/* 담당자 변경 */}
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
              className="w-full"
              onClick={() => {
                if (confirm('정말 삭제하시겠습니까?')) {
                  deleteMutation.mutate(id, {
                    onSuccess: () =>
                      navigate('/problems'),
                  })
                }
              }}
            >
              결함 삭제
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-center">
            <div className="relative inline-block max-w-full">
              <img
                src={problem.sourceImageIdURL}
                alt="결함 이미지"
                className="max-w-full rounded"
                onLoad={handleImageLoad}
              />

              {/* ✅ Bounding Box Overlay */}
              {boxes.map((box, idx) => (
                <div
                  key={idx}
                  className="absolute border-2 border-red-500 rounded"
                  style={{
                    left: `${box.x * imgSize.width / 1920}px`,
                    top: `${box.y * imgSize.height / 1080}px`,
                    width: `${box.width * imgSize.width / 1920}px`,
                    height: `${box.height * imgSize.height / 1080}px`,
                  }}
                >
                  <div className="absolute -top-5 left-0 bg-red-500 text-white text-xl px-1 rounded whitespace-nowrap">
                    {box.label} (
                    {Math.round(box.score * 100)}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
      </main>

      {/* 우측 */}
      <aside className="w-[calc(35vw)] border-l bg-muted/30 p-6 overflow-auto">
        
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
              <Info
                label="참고 정보"
                value={problem.reference}
              />
            )}
          </CardContent>
        </Card>

        <Separator />

        
      </aside>
    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
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
