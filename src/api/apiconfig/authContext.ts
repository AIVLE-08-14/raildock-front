import { createContext } from 'react'
import type { MeResponse } from '@/types/authTypes'

export type AuthContextValue = {
  user: MeResponse['user']
  isAuthenticated: boolean
}

export const AuthContext =
  createContext<AuthContextValue | null>(null)
