import { useEffect, useRef, useState } from "react"
import data from "@/data/insulator_고속철도_220916_영암1_frame_000005.json"

type BBox = [number, number, number, number]

export default function TestPage() {
  const imgRef = useRef<HTMLImageElement | null>(null)

  const [scale, setScale] = useState({ x: 1, y: 1 })

  const detections = data.detections
  const imageSrc = `/data/insulator_고속철도_220916_영암1_frame_000005.jpg`

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const handleLoad = () => {
      const scaleX = img.clientWidth / img.naturalWidth
      const scaleY = img.clientHeight / img.naturalHeight
      setScale({ x: scaleX, y: scaleY })
    }

    img.addEventListener("load", handleLoad)
    return () => img.removeEventListener("load", handleLoad)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">BBox Test</h1>

      <div className="relative inline-block border">
        <img
          ref={imgRef}
          src={imageSrc}
          alt="test"
          className="block"
        />

        {detections.map((det, idx) => {
          const [x1, y1, x2, y2] = det.bbox_xyxy as BBox

          const left = x1 * scale.x
          const top = y1 * scale.y
          const width = (x2 - x1) * scale.x
          const height = (y2 - y1) * scale.y

          return (
            <div
              key={idx}
              className="absolute border-2 border-red-500"
              style={{
                left,
                top,
                width,
                height,
              }}
            >
              <span
  className="absolute -top-5 left-0 bg-red-500 text-white text-xs px-1 whitespace-nowrap inline-block z-10">
                {det.cls_name} ({det.confidence.toFixed(2)})
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
