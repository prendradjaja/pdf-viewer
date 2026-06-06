import { useState, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const width = 827;

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
          <div style={{width: 'fit-content'}}>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess} externalLinkTarget="_blank">
              <div style={{display: 'flex', gap: 10}}>
                <Page pageNumber={pageNumber} width={width} />
                <div style={{position: 'relative', height: '100vh'}}>
                <div style={{position: 'absolute', bottom: 0}}>
                  <Page pageNumber={pageNumber} width={width} />
                </div>
                </div>
              </div>
            </Document>
          </div>
          <div style={{position: 'absolute', top: 10, left: 10}}>Page {pageNumber} of {numPages}</div>
        </>
      )}
    </>
  )
}

export default App
