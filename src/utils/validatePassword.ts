export interface PasswordValidationResult {
  valid: boolean
  reason: 'EMPTY' | 'FORMAT' | 'OK'
}

export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return { valid: false, reason: 'EMPTY' }
  }

  // 8~20자 + 특수문자 1개 이상
  const regex =
    /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/

  if (!regex.test(password)) {
    return { valid: false, reason: 'FORMAT' }
  }

  return { valid: true, reason: 'OK' }
}
