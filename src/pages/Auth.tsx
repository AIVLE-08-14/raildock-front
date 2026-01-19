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
import AgreementModal from './../components/auth/AgreementModal';

type AuthMode = 'login' | 'signup'

export default function Auth() {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [openTerms, setOpenTerms] = useState(false)
  const [openPrivacy, setOpenPrivacy] = useState(false)

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
              <LoginForm 
                onSwitch={() => setAuthMode('signup')}
                onOpenTerms={() => setOpenTerms(true)} 
                onOpenPrivacy={() => setOpenPrivacy(true)}  
              />
            ) : (
              <SignupForm
                onSwitch={() => setAuthMode('login')}
                onOpenTerms={() => setOpenTerms(true)}
                onOpenPrivacy={() => setOpenPrivacy(true)}
              />
            )}
          </CardContent>
        </Card>
      </div>
      <AgreementModal
        open={openTerms}        
        onClose={() => setOpenTerms(false)}
        mdPath="/src/assets/contents/terms.md"
      />

      <AgreementModal
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        mdPath="/src/assets/contents/policy.md"
      />
    </div>
  )
}
