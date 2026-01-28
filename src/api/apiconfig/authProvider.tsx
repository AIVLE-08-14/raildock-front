import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useMeQuery } from '@/api/queries/authQueries'
import { AuthContext } from './authContext'
import type { AuthUser } from '@/types/authTypes'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data, isLoading, isError } = useMeQuery()

  /**
   * 🔑 인증 사용자 추출
   * - 성공: data.data → AuthUser
   * - 실패(401 포함): null
   */
  const user: AuthUser | null = isError ? null : data?.data ?? null
  const isAuthenticated = Boolean(user)

  /**
   * 🔑 Context 값 메모이제이션
   */
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
    }),
    [user, isAuthenticated]
  )

  /**
   * 🔑 최초 인증 확인 중 로딩 화면
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  /**
   * 🔑 인증 상태 확정 후 앱 렌더
   */
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
