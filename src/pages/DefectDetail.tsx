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

  // === mock 메타데이터 (업로드 입력 + AI 추출) ===
  // 더미 데이터
  // ===
  const metadata = {
    camera_id: 1,
    file_name: "원천_VID_1_영암_NG_2209160940.mp4",
    direction: "왕복",
    length: "00:42:09",
    fps: 30,
    width: 1920,
    height: 1080,
    resolution: "1920x1080",
    datetime: "2022/09/16 09:40:00",
    region_name: "신규 선로 부설지",
    weather: "흐림",
    temperature: 28,
    humidity: 70,
    illuminance: 58000,
  }

  // === mock 원본 영상 ===
  const videos = {
    rail: "/mock/rail.mp4",
    insulator: "/mock/insulator.mp4",
    nest: "/mock/nest.mp4",
  }

  // === mock AI 결과 이미지 ===
  // 더미 데이터
  // ===
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
      {/* 좌측 : 영상 + 이미지 */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-6">결함 탐지 결과</h2>

        {/* 철도 / 애자 / 둥지 세로 3분할 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(videos) as Array<keyof typeof videos>).map(
            (category) => (
              <div key={category} className="flex flex-col gap-4">
                {/* 원본 영상 */}
                <Card>
                  <CardContent className="p-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {CATEGORY_LABEL[category]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        원본 영상
                      </span>
                    </div>

                    <video
                      src={videos[category]}
                      controls
                      className="w-full rounded"
                    />
                  </CardContent>
                </Card>

                {/* 이미지 리스트 (영상 하단, 세로 플레이리스트) */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {CATEGORY_LABEL[category]} 이미지
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {images[category].length}건
                    </span>
                  </div>

                  {images[category].length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      탐지된 결과 없음
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {images[category].map((file) => (
                        <Card
                          key={file}
                          className="cursor-pointer hover:ring-1 hover:ring-muted-foreground/30"
                          onClick={() => navigate(`/reports/${file}`)}
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
              </div>
            )
          )}
        </div>
      </div>

      {/* 우측 : 영상 메타데이터 */}
      <aside className="w-80 border-l p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">영상 정보</h3>

        <div className="flex flex-col gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">파일명</div>
            <div className="font-medium break-all">{metadata.file_name}</div>
          </div>

          <div>
            <div className="text-muted-foreground">촬영 일시</div>
            <div className="font-medium">{metadata.datetime}</div>
          </div>

          <div>
            <div className="text-muted-foreground">촬영 구간</div>
            <div className="font-medium">{metadata.region_name}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-muted-foreground">해상도</div>
              <div className="font-medium">{metadata.resolution}</div>
            </div>
            <div>
              <div className="text-muted-foreground">FPS</div>
              <div className="font-medium">{metadata.fps}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-muted-foreground">날씨</div>
              <div className="font-medium">{metadata.weather}</div>
            </div>
            <div>
              <div className="text-muted-foreground">온도 / 습도</div>
              <div className="font-medium">
                {metadata.temperature}℃ / {metadata.humidity}%
              </div>
            </div>
          </div>

          <div>
            <div className="text-muted-foreground">조도</div>
            <div className="font-medium">{metadata.illuminance} lux</div>
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
