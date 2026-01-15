import { Link } from "react-router-dom"
import KakaoMap from "../components/KakaoMap"

export default function Home() {
  return (
    <>
      <h1>서비스 메인</h1>
      <p>공지 / 배너 / 주요 기능 링크</p>

      <ul>
        <li><Link to="/products">상품 목록</Link></li>
        <li><Link to="/mypage">마이페이지</Link></li>
        <li><Link to="/support">고객센터</Link></li>
      </ul>
        <div className="w-full max-w-4xl rounded-xl shadow-md overflow-hidden bg-white">
        <div className="px-4 py-2 font-semibold text-gray-700">
          카카오 지도
        </div>
        <KakaoMap lat={37.3595704} lng={127.1052062} level={4} />
      </div>
    </>
  )
}
