import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getDocumentDetail,
  deleteDocument,
  updateDocument,
} from '@/api/documents'
import type { DocumentDetail, DocumentRevision } from '@/types/document'
import RevisionUploadModal from '@/components/documents/RevisionUploadModal'

function DocumentDetail() {
  const { documentId } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState<DocumentDetail | null>(null)
  const [selected, setSelected] = useState<DocumentRevision | null>(null)
  const [loading, setLoading] = useState(true)

  const [uploadOpen, setUploadOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const [deleteInput, setDeleteInput] = useState('')

  const getLatestRevision = (history: DocumentRevision[]) => {
    return [...history].sort((a, b) => b.version - a.version)[0] ?? null
  }

  const reload = async () => {
    if (!documentId) return
    const res = await getDocumentDetail(documentId)
    setData(res)
    setSelected(getLatestRevision(res.history))
  }

  useEffect(() => {
    if (!documentId) return

    getDocumentDetail(documentId)
      .then((res) => {
        setData(res)
        setSelected(getLatestRevision(res.history))
        setEditName(res.name)
        setEditDescription(res.description)
      })
      .finally(() => setLoading(false))
  }, [documentId])

  const iframeSrc = useMemo(() => {
    if (!selected) return ''

    if (import.meta.env.DEV) {
      return selected.downloadUrl.replace(
        import.meta.env.VITE_Backend_URL,
        '/api'
      )
    }

    return selected.downloadUrl
  }, [selected])

  const handleUpdate = async () => {
    if (!documentId) return

    await updateDocument(documentId, {
      name: editName,
      description: editDescription,
    })

    setEditOpen(false)
    await reload()
  }

  const handleDelete = async () => {
    if (!documentId || !data) return

    const confirmText = `${data.name}/삭제`
    if (deleteInput !== confirmText) return

    await deleteDocument(documentId)
    navigate('/documents')
  }

  if (loading) {
    return <div className="p-6">로딩 중...</div>
  }

  const deleteConfirmText = `${data.name}/삭제`
  const canDelete = deleteInput === deleteConfirmText

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-500 mb-2"
          >
            ← 문서 목록
          </button>

          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-gray-600 text-sm">{data.description}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelected(getLatestRevision(data.history))}
            className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
          >
            최신 문서 보기
          </button>

          <button
            onClick={() => setEditOpen(true)}
            className="px-3 py-1 rounded bg-gray-100 text-sm"
          >
            정보 수정
          </button>

          <button
            onClick={() => setUploadOpen(true)}
            className="px-3 py-1 rounded bg-gray-100 text-sm"
          >
            개정 업로드
          </button>

          <button
            onClick={() => setDeleteOpen(true)}
            className="px-3 py-1 rounded bg-red-500 text-white text-sm"
          >
            문서 삭제
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* PDF 뷰어 */}
        <div className="col-span-3 bg-white rounded-xl shadow">
          <iframe
            src={iframeSrc}
            className="w-full h-[80vh] rounded-xl"
            title="document-pdf"
          />
        </div>

        {/* 개정 이력 */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">개정 이력</h2>

          <ul className="space-y-2">
            {[...data.history]
              .sort((a, b) => b.version - a.version)
              .map((rev) => (
                <li
                  key={rev.revisionId}
                  onClick={() => setSelected(rev)}
                  className={`p-2 rounded cursor-pointer border ${
                    selected.revisionId === rev.revisionId
                      ? 'bg-blue-50 border-blue-400'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium">v{rev.version}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* 개정 업로드 모달 */}
      {uploadOpen && (
        <RevisionUploadModal
          documentId={documentId!}
          onClose={() => setUploadOpen(false)}
          onSuccess={reload}
        />
      )}

      {/* 수정 모달 */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">문서 정보 수정</h2>

            <input
              className="w-full border rounded px-3 py-2"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="문서명"
            />

            <textarea
              className="w-full border rounded px-3 py-2"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="설명"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditOpen(false)}
                className="px-3 py-1 text-sm"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 모달 */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[420px] space-y-4">
            <h2 className="text-lg font-semibold text-red-600">
              문서 삭제
            </h2>

            <p className="text-sm text-gray-600">
              삭제하려면 아래 문구를 정확히 입력하세요
            </p>

            <div className="text-sm font-mono bg-gray-100 p-2 rounded">
              {deleteConfirmText}
            </div>

            <input
              className="w-full border rounded px-3 py-2"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="문서명/삭제"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-3 py-1 text-sm"
              >
                취소
              </button>
              <button
                disabled={!canDelete}
                onClick={handleDelete}
                className={`px-3 py-1 rounded text-sm text-white ${
                  canDelete
                    ? 'bg-red-500'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentDetail
