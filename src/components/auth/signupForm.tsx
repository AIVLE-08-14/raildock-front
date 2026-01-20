import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SecretInput from '../common/SecretInput'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { validatePassword } from '@/utils/validatePassword'
import { Checkbox } from '../ui/checkbox'
import { useSignupMutation } from '@/api/queries/authQueries'

interface Props {
  onSwitch: () => void
  onOpenTerms: () => void
  onOpenPrivacy: () => void
}

export default function SignupForm({ onSwitch, onOpenTerms, onOpenPrivacy }: Props) {
  const [employeeId, setEmployeeId] = useState('')
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const signupMutation = useSignupMutation()

  const passwordValidation = validatePassword(password)

  const isPasswordMatch =
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    password === passwordConfirm

  // 최종 메시지 결정
  let passwordMessage: { text: string; color: string } | null = null

  if (passwordConfirm.length > 0 || password.length > 0) {
    if (passwordValidation.reason === 'EMPTY') {
      passwordMessage = {
        text: '비밀번호를 입력해주세요.',
        color: 'text-red-500',
      }
    } else if (passwordValidation.reason === 'FORMAT') {
      passwordMessage = {
        text: '비밀번호는 8~20자이며 특수문자를 1개 이상 포함해야 합니다.',
        color: 'text-red-500',
      }
    } else if (!isPasswordMatch) {
      passwordMessage = {
        text: '위의 비밀번호와 다릅니다.',
        color: 'text-red-500',
      }
    } else {
      passwordMessage = {
        text: '비밀번호 검증 완료',
        color: 'text-green-600',
      }
    }
  }

  const isFormInvalid =
    !employeeId ||
    !name ||
    !phoneNumber ||
    !email ||
    !agreeTerms ||
    !agreePrivacy ||
    !passwordValidation.valid ||
    !isPasswordMatch

  const handleSignup = () => {
    if (isFormInvalid) {
      alert('입력값을 다시 확인하세요.')
      return
    }

    // 쿼리 호출
    signupMutation.mutate(
      {
        employeeId,
        password,
        name,
        phoneNumber,
        email,
      },
      {
        onSuccess: () => {
          alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')
          onSwitch()
        }
      }
    )
  }

  return (
    <div className="space-y-6 md:space-y-4 lg:space-y-3">
      {/* 사원번호 */}
      <div className="space-y-1 md:space-y-0.5">
        <div className="text-sm md:text-xs font-semibold">사원번호</div>
        <Input className="h-11 md:h-10 lg:h-9" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
      </div>

      {/* 비밀번호 */}
      <div className="space-y-1 md:space-y-0.5">
        <div className="text-sm md:text-xs font-semibold">비밀번호</div>
        <SecretInput className="h-11 md:h-10 lg:h-9" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {/* 비밀번호 확인 */}
      <div className="space-y-1 md:space-y-0.5">
        <div className="text-sm md:text-xs font-semibold">비밀번호 확인</div>
        <SecretInput className="h-11 md:h-10 lg:h-9" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
        <p className={`text-xs mt-0.5 min-h-[1.25rem] ${passwordMessage ? passwordMessage.color : 'text-transparent'}`}>
             {passwordMessage ? passwordMessage.text : 'placeholder'}
        </p>
      </div>

      {/* 이름 */}
      <div className="space-y-1 md:space-y-0.5">
        <div className="text-sm md:text-xs font-semibold">이름</div>
        <Input className="h-11 md:h-10 lg:h-9" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      {/* 전화번호 */}
      <div className="space-y-1 md:space-y-0.5">
        <div className="text-sm md:text-xs font-semibold">전화번호</div>
        <Input className="h-11 md:h-10 lg:h-9" placeholder="010-0000-0000" value={phoneNumber} onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))} />
      </div>

      {/* 이메일 */}
      <div className="space-y-1 md:space-y-0.5">
        <div className="text-sm md:text-xs font-semibold">이메일</div>
        <Input className="h-11 md:h-10 lg:h-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      {/* 이용약관 동의 */}
        <div className="flex items-start gap-2 pt-1">
        <Checkbox
            id="agree-terms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
            className="mt-0.5"
        />
        <label htmlFor="agree-terms" className="text-xs text-slate-600 leading-relaxed">
            <button
            type="button"
            onClick={onOpenTerms}
            className="underline hover:text-slate-800 font-bold"
            >
            이용약관
            </button>
            에 동의합니다. (필수)
        </label>
        </div>


      {/* 개인정보 수집·이용 동의 */}
<div className="flex items-start gap-2 pt-1">
  <Checkbox
    id="agree-privacy"
    checked={agreePrivacy}
    onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
    className="mt-0.5"
  />
  <label htmlFor="agree-privacy" className="text-xs text-slate-600 leading-relaxed">
    <button
      type="button"
      onClick={onOpenPrivacy}
      className="underline hover:text-slate-800 font-bold"
    >
      개인정보 수집 및 이용
    </button>
    에 동의합니다. (필수)
  </label>
</div>


      {/* 회원가입 버튼 */}
      <Button className="w-full h-11 md:h-10 lg:h-9 text-base md:text-sm font-semibold" disabled={isFormInvalid} onClick={handleSignup}>
        회원가입
      </Button>

      {/* 로그인 전환 */}
      <div className="flex justify-end">
        <button type="button" onClick={onSwitch} className="text-xs text-slate-500 hover:text-slate-700 hover:underline">
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  )
}
