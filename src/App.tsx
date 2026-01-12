import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

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
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-4">
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

      {/* 하단 설명 */}
      <p className="text-sm text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
