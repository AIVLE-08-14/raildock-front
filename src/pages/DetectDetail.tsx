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
    id,
    name,
    createdAt,
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
          <h2 className="text-xl font-semibold mb-6">
            결함 탐지 결과
          </h2>
          <div className='grid grid-cols-2 gap-6'>
            <Info label="Video Task 상태" value={videoTaskStatus} />
            <Info label="LLM Task 상태" value={llmTaskStatus} />

          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <VideoCard label="선로" url={railVideoUrl} />
          <VideoCard label="애자" url={insulatorVideoUrl} />
          <VideoCard label="둥지" url={nestVideoUrl} />
        </div>

        {/* 문제 목록 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ProblemSection title="선로 결함" items={problems.rail} />
          <ProblemSection title="애자 결함" items={problems.insulator} />
          <ProblemSection title="둥지 결함" items={problems.nest} />
        </section>
      </div>

      {/* 우측 : 메타 / 상태 */}
      <aside className="w-96 border-l p-6 bg-gray-50 overflow-auto">
        <h3 className="text-lg font-semibold mb-4">
          작업 정보
        </h3>

        <div className="flex flex-col gap-3 text-sm">
          <Info label="Detection ID" value={id} />
          <Info label="이름" value={name} />
          <Info label="생성 시각" value={createdAt} />
          <Info label="업데이트 시각" value={updatedAt} />

          <Divider />

          <Info label="Metadata URL" value={metadataUrl} />
          <Info label="결과 ZIP" value={videoResultZipUrl} />

          <Divider />

          <Info label="선로 영상" value={railVideoUrl} />
          <Info label="애자 영상" value={insulatorVideoUrl} />
          <Info label="둥지 영상" value={nestVideoUrl} />

          <Divider />

          <Info label="선로 리포트" value={railReportUrl} />
          <Info label="애자 리포트" value={insulatorReportUrl} />
          <Info label="둥지 리포트" value={nestReportUrl} />
        </div>
      </aside>
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
    <Card>
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
    <Card>
      <CardContent className="p-4 space-y-3">
        <h4 className="font-semibold">{title}</h4>

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
