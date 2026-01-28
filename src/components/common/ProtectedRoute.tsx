import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/api/apiconfig/useAuth'

export default function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth()

  /**
   * AuthProvider에서 me 쿼리 로딩 중일 때는
   * 아직 인증 여부가 확정되지 않은 상태
   */
  if (user === undefined) {
    return null // 또는 로딩 컴포넌트
  }

  /**
   * 인증되지 않은 경우 로그인 페이지로 이동
   */
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  /**
   * 인증 완료 → 하위 라우트 렌더
   */
  return <Outlet />
}
