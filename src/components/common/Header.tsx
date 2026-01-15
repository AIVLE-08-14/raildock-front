import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Header() {
  const { pathname } = useLocation()

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/")

  return (
    <header className="border-b bg-white">
      <div className="w-full px-6 py-3 flex items-center gap-2">
        {/* 로고 */}
        <Link to="/" className="text-lg font-bold mr-6">
          Raildock
        </Link>

        {/* 메인 */}
        <Button
          asChild
          size="sm"
          variant={isActive("/") ? "default" : "ghost"}
        >
          <Link to="/">대시보드</Link>
        </Button>

        {/* 리포트 */}
        <Button
          asChild
          size="sm"
          variant={isActive("/reports") ? "default" : "ghost"}
        >
          <Link to="/reports">결함 리포트</Link>
        </Button>

        {/* 문서 */}
        <Button
          asChild
          size="sm"
          variant={isActive("/documents") ? "default" : "ghost"}
        >
          <Link to="/documents">문서</Link>
        </Button>

        {/* 우측 영역 */}
        <div className="ml-auto">
          <Button
            asChild
            size="sm"
            variant={isActive("/login") ? "default" : "outline"}
          >
            <Link to="/login">로그인</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
