import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SecretInput from '../common/SecretInput'

interface Props {
  onSwitch: () => void
  onOpenTerms: () => void
  onOpenPrivacy: () => void
}

export default function LoginForm({ onSwitch, onOpenTerms, onOpenPrivacy }: Props) {
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
    
  const handleLogin = () => {
    if (!employeeId || !password) {
      alert('사원번호와 비밀번호를 입력하세요.')
      return
    }

    console.log('로그인 성공', { employeeId })
  }

  return (
    <div className="space-y-8 md:space-y-6 lg:space-y-5">
      {/* 사원번호 */}
      <div className="space-y-2 md:space-y-1.5">
        <div className="text-base md:text-sm font-semibold">
          사원번호
        </div>
        <Input
          className="h-11 md:h-10 lg:h-9"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
      </div>

      {/* 비밀번호 */}
      <div className="space-y-2 md:space-y-1.5">
        <div className="text-base md:text-sm font-semibold">
          비밀번호
        </div>
        <SecretInput
          className="h-11 md:h-10 lg:h-9"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* 로그인 버튼 */}
      <Button
        className="w-full h-11 md:h-10 lg:h-9 text-base md:text-sm font-semibold"
        onClick={handleLogin}
      >
        로그인
      </Button>

      {/* 회원가입 전환 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSwitch}
          className="text-sm md:text-xs text-slate-500 hover:text-slate-700 hover:underline"
        >
          회원가입
        </button>
      </div>

        <div className="pt-2 md:pt-1">
            <footer className="mt-8 text-center text-sm text-muted-foreground">
                <div className="flex justify-center gap-4 mb-2">
                <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="hover:underline"
                >
                    개인정보 처리방침
                </button>
                <button
                    type="button"
                    onClick={onOpenTerms}
                    className="hover:underline"
                >
                    이용약관
                </button>
                </div>
                <p className="text-xs">
                contact: temp-support@example.com
                </p>
            </footer>
        </div>

    </div>
  )
}
