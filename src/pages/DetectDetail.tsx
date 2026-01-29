// src/pages/DetectDetail.tsx
import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDetectDetail } from '@/api/queries/detectQueries'

const CATEGORY_LABEL: Record<string, string> = {
  rail: '선로',
  insulator: '애자',
  nest: '둥지',
}

export default function DetectDetail() {
  const { id } = useParams<{ id: string }>()
  const detectId = Number(id)

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
      {/* 좌측 : 영상 + 이미지 */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-6">결함 탐지 결과</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.results.map((result) => (
            <div key={result.category} className="flex flex-col gap-4">
              <Card>
                <CardContent className="p-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {CATEGORY_LABEL[result.category]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      원본 영상
                    </span>
                  </div>

                  <video
                    src={result.videoUrl}
                    controls
                    className="w-full rounded"
                  />
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {CATEGORY_LABEL[result.category]} 이미지
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {result.imageUrls.length}건
                  </span>
                </div>

                {result.imageUrls.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    탐지된 결과 없음
                  </div>
                ) : (
                  result.imageUrls.map((url) => (
                    <Card key={url}>
                      <CardContent className="p-1">
                        <img
                          src={url}
                          alt={url}
                          className="object-cover rounded"
                        />
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 우측 : 메타데이터 */}
      <aside className="w-80 border-l p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">영상 정보</h3>

        <div className="flex flex-col gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">파일명</div>
            <div className="font-medium break-all">
              {data.metadata.file_name}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground">촬영 일시</div>
            <div className="font-medium">{data.metadata.datetime}</div>
          </div>

          <div>
            <div className="text-muted-foreground">촬영 구간</div>
            <div className="font-medium">
              {data.metadata.region_name}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
