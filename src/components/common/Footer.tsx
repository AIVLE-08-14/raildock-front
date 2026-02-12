// components/layout/Footer.tsx
import { useState } from 'react'
import AgreementModal from '@/components/auth/AgreementModal'

export default function Footer() {
  const [openTerms, setOpenTerms] = useState(false)
  const [openPrivacy, setOpenPrivacy] = useState(false)

  return (
    <>
      <footer className="border-t bg-gray-50 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500 flex justify-between items-center">
          <span>© 2026 Raildock. All rights reserved.</span>

          <div className="flex gap-4">
            <button
              onClick={() => setOpenPrivacy(true)}
              className="hover:text-gray-800 transition"
            >
              개인정보 처리방침
            </button>

            <button
              onClick={() => setOpenTerms(true)}
              className="hover:text-gray-800 transition"
            >
              이용약관
            </button>
          </div>
        </div>
      </footer>

      {/* 모달들 */}
      <AgreementModal
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        mdPath="/contents/policy.md"
      />

      <AgreementModal
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        mdPath="/contents/terms.md"
      />
    </>
  )
}
