// components/layout/Footer.tsx
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500 flex justify-between items-center">
        <span>© 2026 Raildock. All rights reserved.</span>

        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-gray-800">
            개인정보 처리방침
          </Link>
          <Link to="/terms" className="hover:text-gray-800">
            이용약관
          </Link>
        </div>
      </div>
    </footer>
  )
}
