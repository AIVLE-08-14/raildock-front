import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import imgLoginVisual from '@/assets/images/LoginImage.png'
import logo from '@/assets/icons/logo.svg'
import Footer from '@/components/Footer'

export default function Login() {
  const navigate = useNavigate()

  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (!employeeId || !password) {
      alert('사원번호와 비밀번호를 입력하세요.')
      return
    }

    console.log('로그인 성공', { employeeId })
    navigate('/')
  }

  return (
    <div className="min-h-screen relative bg-slate-100 md:bg-transparent">
      {/* 배경 이미지 (md 이상에서만) */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center blur-[2px] brightness-75"
        style={{ backgroundImage: `url(${imgLoginVisual})` }}
      />

      {/* 카드 영역 */}
      <div className="relative min-h-screen flex items-center justify-center md:justify-end px-6 md:px-20">
        <Card className="w-full max-w-md rounded-2xl shadow-2xl bg-white/90 backdrop-blur-md">
          {/* 헤더 */}
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
              <img
                src={logo}
                alt="Rail-Dock Logo"
                className="w-[2em] h-[2em] object-contain"
              />
              <span>Rail-Dock</span>
            </CardTitle>
            <p className="mt-1 text-md text-slate-500">
              AI 기반 철도 유지보수 플랫폼
            </p>
          </CardHeader>

          {/* 콘텐츠 */}
          <CardContent className="space-y-8">
            {/* 사원번호 */}
            <div className="space-y-2">
              <div className="text-md font-semibold">
                사원번호
              </div>
              <Input
                className="h-11"
                type="text"
                placeholder=""
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <div className="text-md font-semibold">
                비밀번호
              </div>
              <Input
                className="h-11"
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* 로그인 버튼 */}
            <Button
              className="w-full h-11 text-base font-semibold"
              onClick={handleLogin}
            >
              로그인
            </Button>

            {/* 회원가입 */}
            <div className="text-right text-sm text-slate-500">
              <Link
                to="/signup"
                className="hover:text-slate-700 hover:underline"
              >
                회원가입
              </Link>
            </div>

            <Footer />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
