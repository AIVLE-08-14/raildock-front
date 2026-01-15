import KakaoMap from "@/components/KakaoMap"
import DefectSummary from "@/components/reports/DefectSummary"
import DefectTrend from "@/components/reports/DefectTrend"
import DefectAlerts from "@/components/reports/DefectAlerts"

export default function Home() {
  return (
    <div className="flex gap-4 h-[calc(100vh-160px)]">
      {/* 좌측 리포트 */}
      <aside className="w-150 flex flex-col gap-4 overflow-y-auto">
        <DefectSummary />
        <DefectTrend />
        <DefectAlerts />
      </aside>

      {/* 우측 지도 */}
      <div className="flex-1 rounded-xl shadow-md overflow-hidden bg-white">
        <div className="px-4 py-2 font-semibold text-gray-700">
          카카오 지도
        </div>
        <KakaoMap lat={37.3595704} lng={127.1052062} level={4} />
      </div>
    </div>
  )
}
