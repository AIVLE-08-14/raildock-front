import { Link } from 'react-router-dom'

interface ReportItem {
  id: number
  title: string
  status: 'OPEN' | 'DONE'
  createdAt: string
}

const reports: ReportItem[] = [
  {
    id: 1,
    title: '지도 로딩 오류',
    status: 'OPEN',
    createdAt: '2026-01-10',
  },
  {
    id: 2,
    title: '로그인 실패 이슈',
    status: 'DONE',
    createdAt: '2026-01-08',
  },
]

function Report() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">리포트 목록</h1>

      <div className="bg-white rounded-xl shadow divide-y">
        {reports.map((report) => (
          <Link
            key={report.id}
            to={`/reports/${report.id}`}
            className="block p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800">
                  {report.title}
                </h2>
                <p className="text-sm text-gray-500">
                  생성일: {report.createdAt}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  report.status === 'OPEN'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {report.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Report
