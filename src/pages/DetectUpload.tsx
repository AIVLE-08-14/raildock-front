import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateDetect } from '@/api/queries/detectQueries'

export default function DetectUpload() {
  const navigate = useNavigate()
  const createDetect = useCreateDetect()

  /** =====================
   * 파일 상태
   * ===================== */
  const [railFile, setRailFile] = useState<File | null>(null)
  const [insulatorFile, setInsulatorFile] = useState<File | null>(null)
  const [nestFile, setNestFile] = useState<File | null>(null)

  /** =====================
   * 메타데이터 상태
   * ===================== */
  const [name, setName] = useState('')
  const [recordedAt, setRecordedAt] = useState('')
  const [location, setLocation] = useState('')
  const [direction, setDirection] = useState('')
  const [weather, setWeather] = useState('')
  const [temperature, setTemperature] = useState<number | ''>('')
  const [humidity, setHumidity] = useState<number | ''>('')

  /** =====================
   * 업로드
   * ===================== */
  const handleUpload = async () => {
    if (!railFile && !insulatorFile && !nestFile) return

    const res = await createDetect.mutateAsync({
      params: {
        name,
        section: location,
        datetime: recordedAt,
        direction,
        weather,
        temperature: temperature === '' ? undefined : temperature,
        humidity: humidity === '' ? undefined : humidity,
      },
      files: {
        railVideo: railFile ?? undefined,
        insulatorVideo: insulatorFile ?? undefined,
        nestVideo: nestFile ?? undefined,
      },
    })

    navigate(`/detects/${res.id}`)
  }

  return (
    <div className="p-8 max-w-xl">
      <Card>
        <CardContent className="p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">신규 결함 영상 업로드</h2>

          {/* ===== 메타데이터 입력 ===== */}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label>요청명</Label>
              <Input
                placeholder="예: 선로 점검 영상"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label>촬영 시각</Label>
              <Input
                type="datetime-local"
                value={recordedAt}
                onChange={(e) => setRecordedAt(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label>촬영 구간</Label>
              <Input
                placeholder="예: 서울역 ~ 용산역"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label>진행 방향</Label>
              <Input
                placeholder="상행 / 하행 / 왕복"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label>날씨</Label>
              <Input
                placeholder="맑음 / 흐림 / 비"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>기온 (℃)</Label>
                <Input
                  type="number"
                  value={temperature}
                  onChange={(e) =>
                    setTemperature(e.target.value === '' ? '' : +e.target.value)
                  }
                />
              </div>

              <div className="grid gap-1">
                <Label>습도 (%)</Label>
                <Input
                  type="number"
                  value={humidity}
                  onChange={(e) =>
                    setHumidity(e.target.value === '' ? '' : +e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== 파일 업로드 ===== */}
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label>선로 영상</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) => setRailFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="grid gap-1">
              <Label>애자 영상</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) =>
                  setInsulatorFile(e.target.files?.[0] ?? null)
                }
              />
            </div>

            <div className="grid gap-1">
              <Label>둥지 영상</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) => setNestFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {/* ===== 버튼 ===== */}
          <Button
            onClick={handleUpload}
            disabled={createDetect.isPending}
          >
            {createDetect.isPending ? '업로드 중...' : '업로드'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
