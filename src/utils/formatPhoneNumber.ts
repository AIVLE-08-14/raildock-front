export function formatPhoneNumber(value: string) {
  // 숫자만 남기기
  const digits = value.replace(/\D/g, '')

  if (digits.length < 4) {
    return digits
  }

  if (digits.length < 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  }

  if (digits.length < 12) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}
