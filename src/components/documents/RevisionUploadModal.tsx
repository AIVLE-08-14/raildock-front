import { useState } from 'react'
import { uploadDocumentRevision } from '@/api/documents'

interface Props {
  documentId: string
  onClose: () => void
  onSuccess: () => void
}

function RevisionUploadModal({
  documentId,
  onClose,
  onSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) {
      alert('PDF 파일을 선택하세요.')
      return
    }

    if (file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.')
      return
    }

    try {
      setLoading(true)
      await uploadDocumentRevision(documentId, file)
      onSuccess()
      onClose()
    } catch (e) {
      alert('업로드 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl shadow p-5">
        <h2 className="text-lg font-bold mb-4">
          개정 문서 업로드
        </h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            setFile(e.target.files?.[0] ?? null)
          }
          className="mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-3 py-1 text-sm rounded bg-blue-500 text-white"
          >
            {loading ? '업로드 중...' : '업로드'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RevisionUploadModal
