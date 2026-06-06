import { useState, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }, [])

  useEffect(() => {
    if (!file) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setPageNumber(p => Math.min(p + 1, numPages))
      } else if (e.key === 'ArrowLeft') {
        setPageNumber(p => Math.max(p - 1, 1))
      } else if (e.key === 'ArrowDown') {
        window.scrollTo({ top: document.body.scrollHeight })
      } else if (e.key === 'ArrowUp') {
        window.scrollTo({ top: 0 })
      } else if (e.key === 'g') {
        const input = prompt('Go to page:')
        if (input === null) return
        const n = parseInt(input, 10)
        if (!isNaN(n)) setPageNumber(Math.min(Math.max(n, 1), numPages))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [file, numPages])

  return (
    <>
      {!file && (
        <input
          type="file"
          accept="application/pdf"
          onChange={e => {
            const selected = e.target.files?.[0]
            if (selected) setFile(selected)
          }}
        />
      )}
      {file && (
        <>
          <div className="document-container">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess} externalLinkTarget="_blank" scale={2}>
              <div className="pages">
                <Page pageNumber={pageNumber} />
              </div>
            </Document>
          </div>
          <div className="page-indicator">Page {pageNumber} of {numPages}</div>
        </>
      )}
    </>
  )
}

export default App
