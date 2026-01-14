import { useState } from 'react'
import reactLogo from './assets/icons/react.svg'
import viteLogo from '/vite.svg'
import KakaoMap from './components/KakaoMap';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-50">
      
      {/* 로고 영역 */}
      <div className="flex gap-10">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            alt="Vite logo"
            className="w-24 hover:scale-110 transition-transform"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            alt="React logo"
            className="w-24 hover:scale-110 transition-transform"
          />
        </a>
      </div>

      {/* Tailwind 테스트 텍스트 */}
      <div className="text-red-500 text-lg font-semibold">
        asdf
      </div>

      {/* 제목 */}
      <h1 className="text-3xl font-extrabold text-gray-800">
        Vite + React
      </h1>

      {/* 카드 영역 */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-4 w-full max-w-2xl">
        <button
          onClick={() => setCount(count + 1)}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          count is {count}
        </button>

        <p className="text-sm text-gray-500">
          Edit{' '}
          <code className="bg-gray-100 px-1 rounded">
            src/App.jsx
          </code>{' '}
          and save to test HMR
        </p>
      </div>

      <div className="w-full max-w-4xl rounded-xl shadow-md overflow-hidden bg-white">
        <div className="px-4 py-2 font-semibold text-gray-700">
          카카오 지도
        </div>
        <KakaoMap lat={37.3595704} lng={127.1052062} level={4} />
      </div>

      {/* 하단 설명 */}
      <p className="text-sm text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
