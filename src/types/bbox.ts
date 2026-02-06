export interface BBoxDetection {
  id: string
  cls_id?: number
  cls_name: string
  detail?: string
  confidence: number
  bbox_xyxy: [number, number, number, number]
}

export interface BBoxJson {
  detections: BBoxDetection[]
}
