import { useParams, useNavigate } from 'react-router-dom'

function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-500"
      >
        ← 목록으로
      </button>

      <h1 className="text-2xl font-bold mb-2">
        리포트 상세 #{id}
      </h1>

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-gray-700">
          여기에 리포트 상세 내용이 들어갑니다.
        </p>
      </div>
    </div>
  )
}

export default ReportDetail
