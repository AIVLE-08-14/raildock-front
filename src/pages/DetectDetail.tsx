// src/pages/DetectDetail.tsx

import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDetectDetail } from '@/api/queries/detectQueries'
import type { DetectProblem } from '@/types/detect'

const SEVERITY_LABEL_MAP: Record<string, string> = {
  S: '위험',
  O: '주의',
  X1: '보통',
  X2: '낮음',
}

export default function DetectDetail() {
  const { detectionId } = useParams<{ detectionId: string }>()
  const detectId = Number(detectionId)

  const { data, isLoading } = useDetectDetail(detectId)

  if (isLoading || !data) {
    return (
      <div className="p-8 text-muted-foreground">
        결함 정보를 불러오는 중...
      </div>
    )
  }

  const {
    name,
    updatedAt,
    metadataUrl,
    insulatorVideoUrl,
    railVideoUrl,
    nestVideoUrl,
    videoTaskStatus,
    videoResultZipUrl,
    llmTaskStatus,
    insulatorReportUrl,
    railReportUrl,
    nestReportUrl,
    problems,
  } = data

  return (
    <div className="flex h-full">
      {/* 좌측 : 영상 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h2 className="text-xl font-semibold mb-1">{name}</h2>
            <p className="text-sm text-muted-foreground">{updatedAt}</p>
          </div>

          <div className='grid grid-cols-4 gap-6'>
            <Info label="Metadata URL" value={metadataUrl} />
            <Info label="결과 ZIP" value={videoResultZipUrl} />
            <Info label="Video Task 상태" value={videoTaskStatus} />
            <Info label="LLM Task 상태" value={llmTaskStatus} />

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <VideoCard label="선로" url={railVideoUrl} />
          <VideoCard label="애자" url={insulatorVideoUrl} />
          <VideoCard label="둥지" url={nestVideoUrl} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <Card className='py-1'>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold">선로 리포트</h4>
              {railReportUrl && (
                <a
                  href={railReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  선로 리포트 보기
                </a>
              )}
            </CardContent>
          </Card>
          <Card className='py-1'>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold">애자 리포트</h4>
              {insulatorReportUrl && (
                <a
                  href={insulatorReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  애자 리포트 보기
                </a>
              )}
            </CardContent>
          </Card>
          <Card className='py-1'>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold">둥지 리포트</h4>
              {nestReportUrl && (
                <a
                  href={nestReportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  둥지 리포트 보기
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 문제 목록 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <ProblemSection title="선로 결함" items={problems.rail} />
          <ProblemSection title="애자 결함" items={problems.insulator} />
          <ProblemSection title="둥지 결함" items={problems.nest} />
        </section>
      </div>
    </div>
  )
}

/* =======================
   하위 컴포넌트
======================= */

function VideoCard({
  label,
  url,
}: {
  label: string
  url?: string
}) {
  if (!url) return null

  return (
    <Card className='py-0'>
      <CardContent className="p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{label}</Badge>
          <span className="text-xs text-muted-foreground">
            원본 영상
          </span>
        </div>
        <video src={url} controls className="w-full rounded" />
      </CardContent>
    </Card>
  )
}

function ProblemSection({
  title,
  items,
}: {
  title: string
  items: DetectProblem[]
}) {
  const navigate = useNavigate()
  if (!items.length) return null

  return (
    <Card className='py-1'>
      <CardContent className="p-4 space-y-3">
          <h4 className="font-semibold">{title} - {items.length}건</h4>
        <div className="space-y-2 text-sm">
          {items.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/problems/${p.id}`)}
              className="border rounded p-2 bg-white cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition"
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  {p.problemType}
                </span>
                <Badge>
                  {SEVERITY_LABEL_MAP[p.severity] ?? p.severity}
                </Badge>
              </div>

              <div className="text-muted-foreground text-xs mt-1">
                #{p.problemNum} · {p.status}
              </div>

              <div className="text-xs mt-1">
                위도 {p.latitude}, 경도 {p.longitude}
              </div>

              <div className="text-xs text-muted-foreground">
                {p.detectedTime}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  if (value == null || value === '') return null

  const isUrl =
    typeof value === 'string' &&
    (value.startsWith('http://') || value.startsWith('https://'))

  return (
    <div>
      <div className="text-muted-foreground">{label}</div>

      {isUrl ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          title={value}
          className="font-medium text-blue-600 hover:underline"
        >
          링크 열기
        </a>
      ) : (
        <div className="font-medium break-all">{value}</div>
      )}
    </div>
  )
}

function Divider() {
  return <div className="border-t my-2" />
}
