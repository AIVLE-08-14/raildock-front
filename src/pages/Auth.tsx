import { useState } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import imgLoginVisual from '@/assets/images/LoginImage.png'
import logo from '@/assets/icons/logo.svg'
import LoginForm from '@/components/auth/loginForm'
import SignupForm from '@/components/auth/signupForm'

type AuthMode = 'login' | 'signup'

export default function Auth() {
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  return (
    <div className="min-h-screen relative bg-slate-100 md:bg-transparent">
      {/* 배경 이미지 (태블릿 이상) */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center blur-[2px] brightness-75"
        style={{ backgroundImage: `url(${imgLoginVisual})` }}
      />

      {/* 카드 영역 */}
      <div
        className="
          relative min-h-screen flex items-center
          justify-center
          md:justify-center
          lg:justify-end
          px-4
          md:px-10
          lg:px-20
        "
      >
        <Card
          className="
            w-full
            md:w-[60%]
            lg:w-[38%]
            max-w-none
            rounded-2xl
            shadow-2xl
            bg-white/90
            backdrop-blur-md
          "
        >
          {/* 공통 헤더 */}
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
              <img
                src={logo}
                alt="Rail-Dock Logo"
                className="w-[2em] h-[2em] object-contain"
              />
              <span>Rail-Dock</span>
            </CardTitle>
            <p className="text-md text-slate-500">
              AI 기반 철도 유지보수 플랫폼
            </p>
          </CardHeader>

          {/* 카드 내부 콘텐츠 */}
          <CardContent>
            {authMode === 'login' ? (
              <LoginForm onSwitch={() => setAuthMode('signup')} />
            ) : (
              <SignupForm onSwitch={() => setAuthMode('login')} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
