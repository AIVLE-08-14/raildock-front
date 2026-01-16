import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onClose: () => void
  mdPath: string
}

export default function AgreementModal({ open, onClose, mdPath }: Props) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!open) return

    fetch(mdPath)
      .then((res) => res.text())
      .then(setContent)
      .catch(() => setContent('문서를 불러올 수 없습니다.'))
  }, [open, mdPath])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          p-0
          w-[94vw]
          max-w-3xl
          max-h-[90vh]
          md:w-[90vw]
          lg:w-[70vw]
          2xl:w-[56rem]
        "
      >
        <div
          className="
            max-h-[90vh]
            overflow-y-auto
            px-5 py-6
            md:px-8 md:py-7
            prose prose-slate prose-sm
            max-w-none
          "
        >
          <ReactMarkdown>{content}</ReactMarkdown>

          <div className="mt-10">
            <Button className="w-full" onClick={onClose}>
              확인
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
