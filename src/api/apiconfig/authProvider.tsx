import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useMeQuery } from '@/api/queries/authQueries'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useMeQuery()

  /**
   * 🔑 Hook은 조건 없이 항상 호출
   */
  const user = isError ? null : data?.user ?? null
  const isAuthenticated = !!user

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
    }),
    [user, isAuthenticated]
  )

  /**
   * 🔑 조건부 return은 Hook 이후
   */
  if (isLoading) {
    return <div> 인증 확인 페이지인데 이거 나중에 바꾸거나 해야해요 ??</div>
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
