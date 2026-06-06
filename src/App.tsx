import { useState, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

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
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setPageNumber(p => Math.min(p + 1, numPages))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setPageNumber(p => Math.max(p - 1, 1))
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
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <p>Page {pageNumber} of {numPages}</p>
        </>
      )}
    </>
  )
}

export default App
