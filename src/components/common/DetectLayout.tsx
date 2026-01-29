// src/components/common/DetectLayout.tsx
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useDetectList } from '@/api/queries/detectQueries'

function DetectSidebar() {
  const navigate = useNavigate()
  const { id: problemDetectionId } = useParams<{ id: string }>()

  const { data, isLoading } = useDetectList()

  // 🔒 항상 배열 보장
  const items = Array.isArray(data) ? data : []

  return (
    <aside className="w-64 border-r p-4 flex flex-col gap-2">
      <Button size="sm" onClick={() => navigate('/detects/upload')}>
        + 신규 영상
      </Button>

      <div className="mt-4 flex flex-col gap-1">
        {isLoading && (
          <div className="text-sm text-muted-foreground">
            불러오는 중...
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-sm text-muted-foreground">
            탐지 결과가 없습니다.
          </div>
        )}

        {items.map((v: { id: string | number; name: string }) => (
          <button
            key={v.id}
            onClick={() => navigate(`/detects/${v.id}`)}
            className={`text-left p-2 rounded text-sm ${
              problemDetectionId === String(v.id)
                ? 'bg-gray-200 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>
    </aside>
  )
}

export default function DetectLayout() {
  return (
    <div className="flex h-[calc(100vh-70px)]">
      <DetectSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
