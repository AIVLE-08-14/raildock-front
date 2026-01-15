import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import KakaoMap from "../components/KakaoMap"

export default function Home() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">서비스 메인</h1>
      <p className="text-gray-600 mb-4">공지 / 배너 / 주요 기능 링크</p>

      <div className="flex gap-2 flex-wrap mb-6">
        <Button asChild>
          <Link to="/products">상품 목록</Link>
        </Button>

        <Button asChild>
          <Link to="/mypage">마이페이지</Link>
        </Button>

        <Button asChild>
          <Link to="/support">고객센터</Link>
        </Button>

        <Button asChild variant="outline">
          <Link to="/login">로그인</Link>
        </Button>
      </div>

      <div className="w-full max-w-4xl rounded-xl shadow-md overflow-hidden bg-white">
        <div className="px-4 py-2 font-semibold text-gray-700">
          카카오 지도
        </div>
        <KakaoMap lat={37.3595704} lng={127.1052062} level={4} />
      </div>
    </>
  )
}
