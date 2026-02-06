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
  const [metadataFile, setMetadataFile] = useState<File | null>(null)

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
   * JSON 파일 업로드 처리
   * ===================== */
  const handleMetadataFileChange = (file: File | null) => {
    setMetadataFile(file)

    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result
        if (!text) return

        const json = JSON.parse(text.toString())

        // JSON 값을 폼에 반영
        if (json.datetime) {
          const formatted = json.datetime.replace(/\//g, '-').replace(' ', 'T').slice(0, 16)
          setRecordedAt(formatted)
        } else {
          setRecordedAt('')
        }
        setLocation(json.region_name || '')
        setWeather(json.weather || '')
        setTemperature(
          json.temperature !== undefined ? Number(json.temperature) : ''
        )
        setHumidity(json.humidity !== undefined ? Number(json.humidity) : '')
        setName(json.file_name || '')
        setDirection('') // JSON에 direction이 없으면 공백 처리
      } catch (err) {
        console.error('metadata.json parsing error:', err)
        alert('metadata.json 파일 형식이 올바르지 않습니다.')
      }
    }
    reader.readAsText(file)
  }

  /** =====================
   * JSON 형식 도움말
   * ===================== */
  const showJsonFormatHelp = () => {
    alert(`metadata.json 예시 형식:
{
  "camera_id": 3,
  "file_name": "high_20260101",
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "aspect_ratio": "16.0:9.0",
  "resolution": "1920x1080",
  "datetime": "2026/01/01 17:26:14",
  "region_name": "강릉선(고속) 상행 진부(오대산)역 ~ 평창역 구간",
  "weather": "흐림",
  "format": "mp4",
  "type": "video",
  "humidity": 70,
  "temperature": 28,
  "angle": 45,
  "illuminance": 58000,
  "latitude": 37.56182878,
  "longitude": 128.4348102
}`)
  }

  /** =====================
   * 업로드
   * ===================== */
  const handleUpload = async () => {
    if (!railFile && !insulatorFile && !nestFile) {
      alert('적어도 한 개의 영상 파일을 업로드해야 합니다.')
      return
    }

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
        metadata: metadataFile ?? undefined,
      },
    })

    navigate(`/detects/${res.detectionId}`)
  }

  return (
    <div className="p-8 max-w-xl">
      <Card>
        <CardContent className="p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">신규 결함 영상 업로드</h2>

          {/* ===== 메타데이터 입력 ===== */}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label className="flex items-center gap-2">
                metadata.json 업로드
                <button type="button"
                  className="
                    w-4 h-4 
                    flex items-center justify-center 
                    text-sm font-bold text-blue-600 
                    border border-blue-600 
                    rounded-full 
                    bg-transparent 
                    hover:bg-blue-100
                  "
                  onClick={showJsonFormatHelp}
                >
                  ?
                </button>
              </Label>
              <Input
                type="file"
                accept=".json"
                onChange={(e) =>
                  handleMetadataFileChange(e.target.files?.[0] ?? null)
                }
              />
            </div>

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
          <Button onClick={handleUpload} disabled={createDetect.isPending}>
            {createDetect.isPending ? '업로드 중...' : '업로드'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
