import { useState } from 'react'
import { useUploadRevisionMutation } from '@/api/queries/documentsQueries'

interface Props {
  documentId: string
  onClose: () => void
}

function RevisionUploadModal({
  documentId,
  onClose,
}: Props) {
  const [file, setFile] = useState<File | null>(null)

  const {
    mutate: upload,
    isPending,
  } = useUploadRevisionMutation(documentId)

  const handleUpload = () => {
    if (!file) {
      alert('PDF 파일을 선택하세요.')
      return
    }

    if (file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.')
      return
    }

    upload(file, {
      onSuccess: () => {
        onClose()
      },
      onError: () => {
        alert('업로드 실패')
      },
    })
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
            disabled={isPending}
            className="px-3 py-1 text-sm rounded bg-blue-500 text-white"
          >
            {isPending ? '업로드 중...' : '업로드'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RevisionUploadModal
