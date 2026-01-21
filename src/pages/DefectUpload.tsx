import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// 결함 타입 라벨
const CATEGORY_LABEL: Record<string, string> = {
  rail: "선로",
  insulator: "애자",
  nest: "둥지",
}

export default function DefectDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // === mock 메타데이터 (업로드 시 입력값) ===
  const metadata = {
    videoName: "20260121",
    recordedAt: "2026-01-21 10:32",
    location: "경부선 123km",
  }

  // === mock 원본 영상 ===
  const videos = {
    rail: "/mock/rail.mp4",
    insulator: "/mock/insulator.mp4",
    nest: "/mock/nest.mp4",
  }

  // === mock AI 결과 이미지 ===
  const images = {
    rail: ["20260121_rail_01.jpg", "20260121_rail_02.jpg"],
    insulator: [
      "20260121_insulator_01.jpg",
      "20260121_insulator_02.jpg",
      "20260121_insulator_03.jpg",
    ],
    nest: ["20260121_nest_01.jpg"],
  }

  return (
    <div className="flex h-full">
      {/* 좌측~중앙 : 영상 + 이미지 영역 */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-6">결함 탐지 결과</h2>

        {/* 3분할 영상 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {(Object.keys(videos) as Array<keyof typeof videos>).map(
            (category) => (
              <Card key={category} className="flex flex-col">
                <CardContent className="p-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {CATEGORY_LABEL[category]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">원본 영상</span>
                  </div>

                  <video
                    src={videos[category]}
                    controls
                    className="w-full rounded"
                  />
                </CardContent>
              </Card>
            )
          )}
        </div>

        {/* 이미지 리스트 */}
        <div className="flex flex-col gap-10">
          {(Object.entries(images) as [keyof typeof images, string[]][]).map(
            ([category, files]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">
                    {CATEGORY_LABEL[category]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {files.length}건
                  </span>
                </div>

                {files.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    탐지된 결과 없음
                  </div>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {files.map((file) => (
                      <Card
                        key={file}
                        className="min-w-[160px] cursor-pointer hover:ring-1 hover:ring-muted-foreground/30"
                        onClick={() => navigate(`/documents/${file}`)}
                      >
                        <CardContent className="p-1">
                          <img
                            src={`/mock/${file}`}
                            alt={file}
                            className="object-cover rounded"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* 우측 : 메타데이터 영역 */}
      <aside className="w-80 border-l p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">영상 정보</h3>

        <div className="flex flex-col gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">영상 이름</div>
            <div className="font-medium">{metadata.videoName}</div>
          </div>

          <div>
            <div className="text-muted-foreground">촬영 시간</div>
            <div className="font-medium">{metadata.recordedAt}</div>
          </div>

          <div>
            <div className="text-muted-foreground">촬영 위치</div>
            <div className="font-medium">{metadata.location}</div>
          </div>

          <div>
            <div className="text-muted-foreground">영상 ID</div>
            <div className="font-medium">{id}</div>
          </div>
        </div>
      </aside>
    </div>
  )
}
