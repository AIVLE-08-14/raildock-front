import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

import insulatorData from "@/data/insulator_고속철도_220916_영암1_frame_000005.json"

type BBox = [number, number, number, number]

const DATA_MAP: Record<string, any> = {
  "insulator_고속철도_220916_영암1_frame_000005.jpg": insulatorData,
}

function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const decodedId = decodeURIComponent(id!)
  const data = DATA_MAP[decodedId]

  const imgRef = useRef<HTMLImageElement | null>(null)

  const [scale, setScale] = useState({ x: 1, y: 1 })
  const [items, setItems] = useState<any[]>(data?.detections ?? [])
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [openModal, setOpenModal] = useState(false)

  if (!data) {
    return <div className="p-6">데이터를 찾을 수 없습니다.</div>
  }

  const imageSrc = `/data/${data.image_file}`

  const metadata = {
    file_name: data.image_file,
    datetime: "2022-09-16 14:23:10",
    region_name: "영암1",
    resolution: "1920 x 1080",
    fps: 30,
    weather: "맑음",
    temperature: 23,
    humidity: 55,
    illuminance: 12000,
  }

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const handleLoad = () => {
      setScale({
        x: img.clientWidth / img.naturalWidth,
        y: img.clientHeight / img.naturalHeight,
      })
    }

    img.addEventListener("load", handleLoad)
    return () => img.removeEventListener("load", handleLoad)
  }, [])

  return (
    <div className="flex h-[calc(100vh-70px)]">
      {/* 좌측: 이미지 + BBox */}
      <main className="flex-1 p-6 overflow-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-blue-500"
        >
          ← 목록으로
        </button>

        <div className="relative inline-block max-h-[80vh] overflow-auto border">
          <img
            ref={imgRef}
            src={imageSrc}
            className="block max-w-full"
          />

          {items.map((det: any, idx: number) => {
            const [x1, y1, x2, y2] = det.bbox_xyxy as BBox

            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedIdx(idx)
                  setOpenModal(true)
                }}
                className={`absolute cursor-pointer border-2 ${
                  selectedIdx === idx
                    ? "border-yellow-400"
                    : "border-red-500"
                }`}
                style={{
                  left: x1 * scale.x,
                  top: y1 * scale.y,
                  width: (x2 - x1) * scale.x,
                  height: (y2 - y1) * scale.y,
                }}
              >
                <span className="absolute -top-10 left-0 bg-red-500/70 text-white text-3xl px-1 whitespace-nowrap inline-block z-10">
                  {det.rail_type}_{det.cls_name}_{det.detail} ({det.confidence.toFixed(2)})
                </span>
              </div>
            )
          })}
        </div>
      </main>

      {/* 우측: 상세 정보 */}
      <aside className="w-80 border-l p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">영상 정보</h3>

        <div className="flex flex-col gap-3 text-sm">
          <Info label="파일명" value={metadata.file_name} />
          <Info label="촬영 일시" value={metadata.datetime} />
          <Info label="촬영 구간" value={metadata.region_name} />

          <div className="grid grid-cols-2 gap-2">
            <Info label="해상도" value={metadata.resolution} />
            <Info label="FPS" value={metadata.fps} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Info label="날씨" value={metadata.weather} />
            <Info
              label="온도 / 습도"
              value={`${metadata.temperature}℃ / ${metadata.humidity}%`}
            />
          </div>

          <Info label="조도" value={`${metadata.illuminance} lux`} />
          <Info label="영상 ID" value={decodedId} />
        </div>
      </aside>

      {/* 오탐 확인 모달 */}
      {openModal && selectedIdx !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6">
            <h2 className="text-lg font-semibold mb-4">오탐 처리</h2>

            <p className="text-sm text-gray-700 mb-6">
              오탐처리 하시겠습니까?
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 text-sm border rounded"
                onClick={() => {
                  setOpenModal(false)
                  setSelectedIdx(null)
                }}
              >
                아니오
              </button>

              <button
                className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                onClick={() => {
                  setItems(prev =>
                    prev.filter((_, i) => i !== selectedIdx)
                  )
                  setOpenModal(false)
                  setSelectedIdx(null)
                }}
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium break-all">{value}</div>
    </div>
  )
}

export default ReportDetail
