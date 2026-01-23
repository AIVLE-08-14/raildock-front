import TestMap from "@/components/map/OlMap"
import DefectSummary from "@/components/reports/DefectSummary"
import DefectTrend from "@/components/reports/DefectTrend"
import DefectAlerts from "@/components/reports/DefectAlerts"

export default function Home() {
  return (
    <div className="flex gap-4 h-[calc(100vh-70px)]">
      {/* 좌측 리포트 */}
      <aside className="w-150 flex flex-col gap-4 overflow-y-auto pt-4 pb-4">
        <DefectSummary />
        <DefectTrend />
        <DefectAlerts />
      </aside>

      {/* 우측 지도 */}
      <div className="flex-1 rounded-xl shadow-md overflow-hidden bg-white pt-4 pb-4">
        <div className="px-4 py-2 font-semibold text-gray-700">
          철도 노선 지도
        </div>

        {/* OpenLayers 지도 */}
        <div className="h-full">
          <TestMap />
        </div>
      </div>
    </div>
  )
}
