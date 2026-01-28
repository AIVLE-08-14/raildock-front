import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/api/apiconfig/useAuth'
import { useLogoutMutation } from '@/api/queries/authQueries'
import logo from '@/assets/icons/logo.svg'

export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const logoutMutation = useLogoutMutation()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/auth', { replace: true })
      },
    })
  }

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/')

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

        {/* 메뉴 */}
        <Button asChild size="sm" variant={isActive('/') ? 'default' : 'ghost'}>
          <Link to="/">대시보드</Link>
        </Button>

        <Button asChild size="sm" variant={isActive('/defects') ? 'default' : 'ghost'}>
          <Link to="/defects">결함 탐지</Link>
        </Button>

        <Button asChild size="sm" variant={isActive('/reports') ? 'default' : 'ghost'}>
          <Link to="/reports">결함 정보</Link>
        </Button>

        <Button asChild size="sm" variant={isActive('/documents') ? 'default' : 'ghost'}>
          <Link to="/documents">유지보수 문서</Link>
        </Button>

        {/* 우측 영역 */}
        <div className="ml-auto flex items-center gap-4">
          <span className="text-gray-700">
            <span className="font-semibold">{user?.name}</span>님
          </span>

          <Button
            onClick={handleLogout}
            variant="outline"
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
          </Button>
        </div>
      </div>
    </header>
  )
}
