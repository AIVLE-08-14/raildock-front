import { useState } from 'react'
import type { BBoxDetection } from '@/types/bbox'
import { cn } from '@/lib/utils'

interface Props {
  imageUrl?: string
  detections: BBoxDetection[]
  editable: boolean
  onDelete: (id: string) => void
}

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080

export default function BBoxCanvas({
  imageUrl,
  detections,
  editable,
  onDelete,
}: Props) {
  const [imgSize, setImgSize] = useState({
    width: 1,
    height: 1,
  })

  if (!imageUrl) return null

  return (
    <div className="relative inline-block max-w-full">
      <img
        src={imageUrl}
        className="max-w-full block"
        onLoad={e => {
          const img = e.currentTarget
          setImgSize({
            width: img.clientWidth,
            height: img.clientHeight,
          })
        }}
      />

      {detections.map(det => {
        const [x1, y1, x2, y2] = det.bbox_xyxy

        const left = (x1 * imgSize.width) / BASE_WIDTH
        const top = (y1 * imgSize.height) / BASE_HEIGHT
        const width =
          ((x2 - x1) * imgSize.width) / BASE_WIDTH
        const height =
          ((y2 - y1) * imgSize.height) / BASE_HEIGHT

        return (
          <div
            key={det.id}
            className={cn(
              'absolute border-2 rounded',
              editable
                ? 'border-red-500 cursor-pointer hover:bg-red-500/20'
                : 'border-blue-500'
            )}
            style={{ left, top, width, height }}
            onClick={e => {
              e.stopPropagation()
              if (!editable) return
              if (confirm('이 BBox를 삭제하시겠습니까?')) {
                onDelete(det.id)
              }
            }}
          >
            <div
              className={cn(
                'absolute -top-5 left-0 text-xs px-1 rounded whitespace-nowrap text-white',
                editable ? 'bg-red-500' : 'bg-blue-500'
              )}
            >
              {det.cls_name}
              {det.detail && ` (${det.detail})`}
              {typeof det.confidence === 'number' && (
                <> ({Math.round(det.confidence * 100)}%)</>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
