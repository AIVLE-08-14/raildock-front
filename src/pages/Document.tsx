import { Link } from 'react-router-dom'

interface DocumentItem {
  id: number
  title: string
  category: string
  updatedAt: string
}

const documents: DocumentItem[] = [
  {
    id: 1,
    title: '서비스 이용 약관',
    category: '정책',
    updatedAt: '2026-01-05',
  },
  {
    id: 2,
    title: '개인정보 처리방침',
    category: '정책',
    updatedAt: '2026-01-02',
  },
  {
    id: 3,
    title: '지도 API 연동 가이드',
    category: '기술 문서',
    updatedAt: '2026-01-11',
  },
]

function Document() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">문서</h1>

      <div className="bg-white rounded-xl shadow divide-y">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            to={`/documents/${doc.id}`}
            className="block p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800">
                  {doc.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {doc.category} · 최종 수정 {doc.updatedAt}
                </p>
              </div>

              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                보기
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Document
