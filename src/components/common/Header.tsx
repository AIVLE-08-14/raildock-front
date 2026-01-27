import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import logo from "@/assets/icons/logo.svg"

export default function Header() {
  const { pathname } = useLocation()

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/")

  return (
    <header className="border-b bg-white">
      <div className="w-full px-6 py-3 flex items-center gap-2">
        
        {/* 로고 */}
        <Link to="/" className="text-lg font-bold mr-6 flex items-center gap-2">
          <img
            src={logo}
            alt="Rail-Dock Logo"
            className="w-[2.5em] h-[2.5em] object-contain"
          />
          Raildock
        </Link>

        {/* 대시보드 */}
        <Button
          asChild
          size="sm"
          variant={isActive("/") ? "default" : "ghost"}
        >
          <Link to="/">대시보드</Link>
        </Button>

        {/* 결함 탐지 */}
        <Button
          asChild
          size="sm"
          variant={isActive("/defects") ? "default" : "ghost"}
        >
          <Link to="/defects">결함 탐지</Link>
        </Button>

        {/* 결함 정보 */}
        <Button
          asChild
          size="sm"
          variant={isActive("/reports") ? "default" : "ghost"}
        >
          <Link to="/reports">결함 정보</Link>
        </Button>

        {/* 문서 */}
        <Button
          asChild
          size="sm"
          variant={isActive("/documents") ? "default" : "ghost"}
        >
          <Link to="/documents">유지보수 문서</Link>
        </Button>

        {/* 우측 영역 */}
        <div className="ml-auto">
          <Button
            asChild
            size="sm"
            variant={isActive("/auth") ? "default" : "outline"}
          >
            <Link to="/auth">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
