import KakaoMap from "@/components/KakaoMap"

export default function Home() {
  return (
    <>
      <div className="w-full h-[calc(100vh-120px)] rounded-xl shadow-md overflow-hidden bg-white">
        <div className="px-4 py-2 font-semibold text-gray-700">
          카카오 지도
        </div>
        <KakaoMap lat={37.3595704} lng={127.1052062} level={4} />
      </div>
    </>
  )
}
