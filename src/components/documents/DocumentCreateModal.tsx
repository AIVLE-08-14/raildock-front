import { useState } from 'react'
import { createDocument } from '@/api/documents'
import { useNavigate } from 'react-router-dom'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

function DocumentCreateModal({ onClose, onSuccess }: Props) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!name.trim()) {
      alert('문서명을 입력하세요')
      return
    }

    try {
      setLoading(true)
      const documentId = await createDocument({ name, description })

      navigate(`/documents/${documentId}?create=true`)
      onClose()
      onSuccess()
    } catch {
      alert('문서 생성 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">
          문서 생성
        </h2>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="문서명"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows={3}
            placeholder="설명"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            {loading ? '생성 중...' : '다음'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentCreateModal
