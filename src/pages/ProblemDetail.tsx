import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

type BBox = [number, number, number, number]

type DetectionItem = {
  bbox_xyxy: BBox
  rail_type: string
  cls_name: string
  detail: string
  confidence: number
}

function ProblemDetail() {
  const navigate = useNavigate()
  const imgRef = useRef<HTMLImageElement | null>(null)

  /** =====================
   * 상태 (나중에 API로 교체)
   * ===================== */
  const [imageSrc] = useState<string>('') // 이미지 URL
  const [items, setItems] = useState<DetectionItem[]>([])
  const [scale, setScale] = useState({ x: 1, y: 1 })
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [openModal, setOpenModal] = useState(false)

  /** =====================
   * 이미지 스케일 계산
   * ===================== */
  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const handleLoad = () => {
      setScale({
        x: img.clientWidth / img.naturalWidth,
        y: img.clientHeight / img.naturalHeight,
      })
    }

    img.addEventListener('load', handleLoad)
    return () => img.removeEventListener('load', handleLoad)
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

        <div className="relative inline-block max-h-[80vh] overflow-auto border bg-gray-100">
          {imageSrc ? (
            <img
              ref={imgRef}
              src={imageSrc}
              className="block max-w-full"
            />
          ) : (
            <div className="w-[800px] h-[450px] flex items-center justify-center text-gray-400">
              이미지 영역
            </div>
          )}

          {items.map((det, idx) => {
            const [x1, y1, x2, y2] = det.bbox_xyxy

            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedIdx(idx)
                  setOpenModal(true)
                }}
                className={`absolute cursor-pointer border-2 ${
                  selectedIdx === idx
                    ? 'border-yellow-400'
                    : 'border-red-500'
                }`}
                style={{
                  left: x1 * scale.x,
                  top: y1 * scale.y,
                  width: (x2 - x1) * scale.x,
                  height: (y2 - y1) * scale.y,
                }}
              >
                <span className="absolute -top-7 left-0 bg-red-500/70 text-white text-xs px-1 whitespace-nowrap">
                  {det.rail_type}_{det.cls_name}_{det.detail}
                </span>
              </div>
            )
          })}
        </div>
      </main>

      {/* 우측: 정보 패널 */}
      <aside className="w-80 border-l p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">영상 정보</h3>

        <div className="flex flex-col gap-3 text-sm text-gray-600">
          <Info label="파일명" value="-" />
          <Info label="촬영 일시" value="-" />
          <Info label="촬영 구간" value="-" />

          <div className="grid grid-cols-2 gap-2">
            <Info label="해상도" value="-" />
            <Info label="FPS" value="-" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Info label="날씨" value="-" />
            <Info label="온도 / 습도" value="-" />
          </div>

          <Info label="영상 ID" value="-" />
        </div>
      </aside>

      {/* 오탐 처리 모달 */}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium break-all">{value}</div>
    </div>
  )
}

export default ProblemDetail
