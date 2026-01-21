import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Metadata = {
  datetime?: string
  region_name?: string
  direction?: string
  weather?: string
  temperature?: number
  humidity?: number
}

export default function DefectUpload() {
  // 파일 상태 (최대 3개)
  const [railFile, setRailFile] = useState<File | null>(null)
  const [insulatorFile, setInsulatorFile] = useState<File | null>(null)
  const [nestFile, setNestFile] = useState<File | null>(null)

  // 메타데이터 상태 (기본값)
  const [videoName, setVideoName] = useState("")
  const [recordedAt, setRecordedAt] = useState(
    new Date().toISOString().slice(0, 16)
  )
  const [location, setLocation] = useState("미지정")
  const [direction, setDirection] = useState("왕복")
  const [weather, setWeather] = useState("흐림")
  const [temperature, setTemperature] = useState<number | "">("")
  const [humidity, setHumidity] = useState<number | "">("")

  const [uploading, setUploading] = useState(false)

  // JSON 메타데이터 업로드 처리
  const handleJsonUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json: Metadata = JSON.parse(reader.result as string)

        if (json.datetime) setRecordedAt(json.datetime.replace(" ", "T"))
        if (json.region_name) setLocation(json.region_name)
        if (json.direction) setDirection(json.direction)
        if (json.weather) setWeather(json.weather)
        if (json.temperature !== undefined) setTemperature(json.temperature)
        if (json.humidity !== undefined) setHumidity(json.humidity)
      } catch {
        alert("JSON 형식이 올바르지 않습니다.")
      }
    }
    reader.readAsText(file)
  }

  const handleUpload = () => {
    if (!railFile && !insulatorFile && !nestFile) return

    setUploading(true)

    // 실제 구현 시 FormData 구성
    // files: rail / insulator / nest
    // metadata: 아래 값들

    setTimeout(() => {
      setUploading(false)
      alert("업로드 완료 (AI 분석 시작)")
    }, 1000)
  }

  return (
    <div className="p-8 max-w-xl">
      <Card>
        <CardContent className="p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">신규 결함 영상 업로드</h2>

          {/* 메타데이터 입력 */}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label>영상 이름</Label>
              <Input
                placeholder="자동 생성 또는 직접 입력"
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label>촬영 시간</Label>
              <Input
                type="datetime-local"
                value={recordedAt}
                onChange={(e) => setRecordedAt(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label>촬영 위치 / 구간명</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label>진행 방향</Label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
                <option value="상행">상행</option>
                <option value="하행">하행</option>
                <option value="왕복">왕복</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>날씨</Label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                >
                  <option value="맑음">맑음</option>
                  <option value="흐림">흐림</option>
                  <option value="비">비</option>
                  <option value="눈">눈</option>
                </select>
              </div>

              <div className="grid gap-1">
                <Label>기온 (℃)</Label>
                <Input
                  type="number"
                  value={temperature}
                  onChange={(e) =>
                    setTemperature(e.target.value === "" ? "" : +e.target.value)
                  }
                />
              </div>

              <div className="grid gap-1">
                <Label>습도 (%)</Label>
                <Input
                  type="number"
                  value={humidity}
                  onChange={(e) =>
                    setHumidity(e.target.value === "" ? "" : +e.target.value)
                  }
                />
              </div>
            </div>

            {/* JSON 메타데이터 */}
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <Label>메타데이터 JSON (선택)</Label>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="w-5 h-5 rounded-full border text-xs font-bold
                                   flex items-center justify-center
                                   text-muted-foreground hover:bg-muted"
                      >
                        ?
                      </button>
                    </TooltipTrigger>

                    <TooltipContent className="max-w-sm text-xs">
                      <div className="font-semibold mb-1">
                        JSON 형식을 준수해야 합니다
                      </div>
                      <pre className="bg-muted p-2 rounded text-[11px] overflow-x-auto text-black">
{`{
  "datetime": "2022-09-16 09:40:00",
  "region_name": "신규 선로 부설지",
  "direction": "왕복",
  "weather": "흐림",
  "temperature": 28,
  "humidity": 70
}`}
                      </pre>
                      <div className="mt-1 text-muted-foreground">
                        ※ 없는 항목은 수동 입력값이 유지됩니다.
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleJsonUpload(file)
                }}
              />
            </div>
          </div>

          {/* 파일 업로드 */}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label>선로 영상 (.mp4)</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) => setRailFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="grid gap-1">
              <Label>애자 영상 (.mp4)</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) => setInsulatorFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="grid gap-1">
              <Label>둥지 영상 (.mp4)</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) => setNestFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleUpload}
              disabled={
                uploading || (!railFile && !insulatorFile && !nestFile)
              }
            >
              {uploading ? "업로드 중..." : "업로드"}
            </Button>

            <Button variant="outline" onClick={() => history.back()}>
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
