import { createContext } from 'react'
import type { AuthUser } from '@/types/authTypes'

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
}

export const AuthContext =
  createContext<AuthContextValue | null>(null)
