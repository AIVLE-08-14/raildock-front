import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // 1️⃣ 실제로는 여기서 API 요청
    // fetch('/api/login', { ... })

    // 2️⃣ 예제에서는 무조건 성공했다고 가정
    if (email && password) {
      console.log('로그인 성공')

      // 3️⃣ 로그인 성공 후 홈으로 이동
      navigate('/')
    } else {
      alert('이메일과 비밀번호를 입력하세요.')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h1>Login</h1>

      <div>
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin}>
        로그인
      </button>
    </div>
  )
}