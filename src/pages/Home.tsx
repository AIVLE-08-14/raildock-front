import { useEffect, useRef, useState } from 'react'

import TestMap from '@/components/map/OlMap'
import ProblemSummary from '@/components/Dashboard/ProblemSummary'
import MonthlyProblemByTypeChart from '@/components/Dashboard/MonthlyProblemByTypeChart'
import ProblemTrendChart from '@/components/Dashboard/ProblemTrendChart'

const MIN_ASIDE_WIDTH = 500 // 지금 사이즈 정도
const MAX_ASIDE_RATIO = 0.5 // 화면 가로의 50%

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [asideWidth, setAsideWidth] = useState(MIN_ASIDE_WIDTH)
  const [resizing, setResizing] = useState(false)

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!resizing || !containerRef.current) return

      const containerLeft =
        containerRef.current.getBoundingClientRect().left
      const newWidth = e.clientX - containerLeft

      const maxWidth =
        containerRef.current.offsetWidth * MAX_ASIDE_RATIO

      setAsideWidth(
        Math.min(Math.max(newWidth, MIN_ASIDE_WIDTH), maxWidth)
      )
    }

    function onMouseUp() {
      setResizing(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [resizing])

  return (
    <div
      ref={containerRef}
      className="flex h-[calc(100vh-70px)] gap-0"
    >
      {/* 좌측 리포트 */}
      <aside
        style={{ width: asideWidth }}
        className="aside-scroll flex flex-col gap-4 overflow-y-auto border-r bg-background pt-4 pb-4 pr-4"
      >
        <ProblemSummary />
        <MonthlyProblemByTypeChart />
        <ProblemTrendChart />
      </aside>

      {/* 드래그 핸들 */}
      <div
        onMouseDown={() => setResizing(true)}
        className="w-1 cursor-col-resize bg-border hover:bg-primary/50"
      />

      {/* 우측 지도 */}
      <div className="flex-1 overflow-hidden bg-white pt-4 pb-4">
        <div className="px-4 py-2 font-semibold text-gray-700">
          철도 노선 지도
        </div>

        <div className="h-full">
          <TestMap />
        </div>
      </div>
    </div>
  )
}
