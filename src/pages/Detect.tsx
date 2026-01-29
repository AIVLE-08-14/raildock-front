// src/pages/Detect.tsx
import { Card, CardContent } from "@/components/ui/card"

export default function Detect() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center flex flex-col gap-2">
          <h2 className="text-lg font-semibold">결함 영상 선택</h2>
          <p className="text-sm text-muted-foreground">
            좌측 목록에서 영상을 선택하거나<br />
            신규 영상을 업로드하세요.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
