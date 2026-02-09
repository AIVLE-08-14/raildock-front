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
   * 메타데이터 입력 상태
   * ===================== */
  const [name, setName] = useState('')
  const [recordedAt, setRecordedAt] = useState('')
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState('')
  const [temperature, setTemperature] = useState<number | ''>('')
  const [humidity, setHumidity] = useState<number | ''>('')

  /** =====================
   * metadata.json → 폼 자동 채움
   * ===================== */
  const handleMetadataFileChange = (file: File | null) => {
    setMetadataFile(file)
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(String(e.target?.result))

        if (json.datetime) {
          const formatted = json.datetime
            .replace(/\//g, '-')
            .replace(' ', 'T')
            .slice(0, 16)
          setRecordedAt(formatted)
        }

        setName(json.file_name || '')
        setLocation(json.region_name || '')
        setWeather(json.weather || '')
        setTemperature(json.temperature ?? '')
        setHumidity(json.humidity ?? '')
      } catch {
        alert('metadata.json 형식이 올바르지 않습니다.')
      }
    }
    reader.readAsText(file)
  }

  /** =====================
   * 수기 입력 → metadata.json 생성
   * ===================== */
  const buildMetadataJsonFile = (): File => {
    const metadata = {
      file_name: name,
      datetime: recordedAt
        ? recordedAt.replace('T', ' ')
        : undefined,
      region_name: location,
      weather,
      temperature: temperature === '' ? undefined : temperature,
      humidity: humidity === '' ? undefined : humidity,
    }

    const blob = new Blob(
      [JSON.stringify(metadata, null, 2)],
      { type: 'application/json' }
    )

    return new File([blob], 'metadata.json', {
      type: 'application/json',
    })
  }

  /** =====================
   * 업로드
   * ===================== */
  const handleUpload = async () => {
    if (!railFile && !insulatorFile && !nestFile) {
      alert('적어도 한 개의 영상 파일을 업로드해야 합니다.')
      return
    }

    if (!name) {
      alert('요청명(name)은 필수입니다.')
      return
    }

    // metadata.json이 없으면 수기 입력으로 생성
    const finalMetadataFile =
      metadataFile ?? buildMetadataJsonFile()

    const res = await createDetect.mutateAsync({
      name,
      files: {
        metadata: finalMetadataFile,
        railVideo: railFile ?? undefined,
        insulatorVideo: insulatorFile ?? undefined,
        nestVideo: nestFile ?? undefined,
      },
    })

    navigate(`/detects/${res.detectionId}`)
  }

  return (
    <div className="p-8 max-w-xl">
      <Card>
        <CardContent className="p-6 flex flex-col gap-6">
          <h2 className="text-lg font-semibold">
            신규 결함 영상 업로드
          </h2>

          {/* ===== metadata ===== */}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label>metadata.json 업로드</Label>
              <Input
                type="file"
                accept=".json"
                onChange={(e) =>
                  handleMetadataFileChange(
                    e.target.files?.[0] ?? null
                  )
                }
              />
            </div>

            <div className="grid gap-1">
              <Label>요청명</Label>
              <Input
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label>날씨</Label>
              <Input
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
                    setTemperature(
                      e.target.value === ''
                        ? ''
                        : +e.target.value
                    )
                  }
                />
              </div>

              <div className="grid gap-1">
                <Label>습도 (%)</Label>
                <Input
                  type="number"
                  value={humidity}
                  onChange={(e) =>
                    setHumidity(
                      e.target.value === ''
                        ? ''
                        : +e.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* ===== 영상 ===== */}
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label>선로 영상</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) =>
                  setRailFile(e.target.files?.[0] ?? null)
                }
              />
            </div>

            <div className="grid gap-1">
              <Label>애자 영상</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) =>
                  setInsulatorFile(
                    e.target.files?.[0] ?? null
                  )
                }
              />
            </div>

            <div className="grid gap-1">
              <Label>둥지 영상</Label>
              <Input
                type="file"
                accept="video/mp4"
                onChange={(e) =>
                  setNestFile(e.target.files?.[0] ?? null)
                }
              />
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={createDetect.isPending}
          >
            {createDetect.isPending
              ? '업로드 중...'
              : '업로드'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
