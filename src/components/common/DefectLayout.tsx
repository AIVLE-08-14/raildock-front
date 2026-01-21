import { Outlet, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"

// 좌측 영상 리스트 (레이아웃 전용)
function DefectSidebar() {
  const navigate = useNavigate()
  const { id } = useParams()

  // 추후 API 연동 예정 (mock)
  const videos = [
    { id: "1", name: "track_001.mp4" },
    { id: "2", name: "track_002.mp4" },
  ]

  return (
    <aside className="w-64 border-r p-4 flex flex-col gap-2">
      <Button size="sm" onClick={() => navigate("/defects/upload")}>
        + 신규 영상
      </Button>

      <div className="mt-4 flex flex-col gap-1">
        {videos.map((v) => (
          <button
            key={v.id}
            onClick={() => navigate(`/defects/${v.id}`)}
            className={`text-left p-2 rounded text-sm ${
              id === v.id ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>
    </aside>
  )
}

// Defect 공통 레이아웃
export default function DefectLayout() {
  return (
    <div className="flex h-[calc(100vh-57px)]">
      <DefectSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
