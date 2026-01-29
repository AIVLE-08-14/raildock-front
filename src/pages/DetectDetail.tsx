// src/pages/DetectDetail.tsx
import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDetectDetail } from '@/api/queries/detectQueries'

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

  return (
    <div className="flex h-full">
      {/* 좌측 : 영상 */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-6">
          결함 탐지 결과
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.railVideoUrl && (
            <VideoCard label="선로" url={data.railVideoUrl} />
          )}
          {data.insulatorVideoUrl && (
            <VideoCard label="애자" url={data.insulatorVideoUrl} />
          )}
          {data.nestVideoUrl && (
            <VideoCard label="둥지" url={data.nestVideoUrl} />
          )}
        </div>
      </div>

      {/* 우측 : 메타 정보 */}
      <aside className="w-80 border-l p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">
          영상 정보
        </h3>

        <div className="flex flex-col gap-3 text-sm">
          <Info label="영상 ID" value={data.id} />
          <Info label="이름" value={data.name} />
          <Info label="촬영 일시" value={data.datetime} />
          <Info label="구간" value={data.section} />
          <Info label="방향" value={data.direction} />
          <Info label="상태" value={data.taskStatus} />
          <Info label="날씨" value={data.weather} />
          <Info label="온도" value={data.temperature} />
          <Info label="습도" value={data.humidity} />
          <Info label="메타데이터" value={data.metadataUrl} />
          <Info label="선로 영상" value={data.railVideoUrl} />
          <Info label="애자 영상" value={data.insulatorVideoUrl} />
          <Info label="둥지 영상" value={data.nestVideoUrl} />
          <Info label="상태" value={data.taskStatus} />
          <Info label="에러 메시지" value={data.errorMessage} />
          <Info label="결과 ZIP" value={data.resultZipUrl} />
        </div>
      </aside>
    </div>
  )
}

function VideoCard({
  label,
  url,
}: {
  label: string
  url: string
}) {
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

function Info({
  label,
  value,
}: {
  label: string
  value?: string | number
}) {
  if (value == null) return null
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium break-all">{value}</div>
    </div>
  )
}
