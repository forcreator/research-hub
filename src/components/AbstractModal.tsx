import { X, Copy, FileText } from 'lucide-react';
import { ResearchPaper } from '@/types/paper';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface AbstractModalProps {
  paper: ResearchPaper | null;
  onClose: () => void;
  onCopyToNotes: (text: string) => void;
}

export function AbstractModal({ paper, onClose, onCopyToNotes }: AbstractModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    if (paper) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      setShowPdf(false);
      setCurrentPage(1);
    }
  }, [paper]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  if (!paper) return null;

  const formatPaperDetails = () => {
    return `Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Journal: ${paper.journal}
Year: ${paper.year}
Source: ${paper.source}
${paper.doi ? `DOI: ${paper.doi}` : ''}
${paper.url ? `URL: ${paper.url}` : ''}

Abstract:
${paper.abstract}`;
  };

  const handleCopyToNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyToNotes(formatPaperDetails());
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="fixed inset-y-0 left-0 right-96 z-40">
      {/* Overlay - only covers the main content area */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-200"
        style={{ 
          opacity: isVisible ? 0.3 : 0,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
      />

      {/* Modal - positioned in main content area */}
      <div
        ref={modalRef}
        className={`absolute inset-0 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-200 ease-out ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex justify-between items-start bg-gray-50">
          <div className="flex-1 pr-6">
            <h2 className="text-xl font-semibold text-gray-900 select-text">{paper.title}</h2>
            <p className="mt-2 text-sm text-gray-600 select-text">{paper.authors.join(', ')}</p>
            <div className="mt-2 flex items-center gap-4">
              <span className="text-sm text-gray-500 select-text">{paper.journal} • {paper.year}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {paper.source}
              </span>
              {paper.citations && (
                <span className="text-sm text-gray-500">
                  {paper.citations} citations
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyToNotes}
              className="p-2 hover:bg-gray-200 rounded-lg flex-shrink-0 transition-colors flex items-center gap-2 text-sm text-gray-700"
              title="Copy to notes"
            >
              <Copy className="h-4 w-4" />
              Copy to Notes
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 rounded-full flex-shrink-0 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Abstract</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base select-text">
                {paper.abstract}
              </p>
            </div>
            
            <div className="pt-6 border-t">
              <dl className="grid grid-cols-2 gap-6">
                {paper.doi && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">DOI</dt>
                    <dd className="mt-1 text-sm text-blue-600">
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500"
                      >
                        {paper.doi}
                      </a>
                    </dd>
                  </div>
                )}
                {paper.url && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Source URL</dt>
                    <dd className="mt-1 text-sm text-blue-600">
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500"
                      >
                        View Source
                      </a>
                    </dd>
                  </div>
                )}
                {paper.pdfUrl && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">PDF</dt>
                    <dd className="mt-1 text-sm text-blue-600 flex items-center gap-2">
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500"
                      >
                        Download PDF
                      </a>
                      <button
                        onClick={() => setShowPdf(!showPdf)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {showPdf ? 'Hide Viewer' : 'View PDF'}
                      </button>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* PDF Viewer */}
            {showPdf && paper.pdfUrl && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">PDF Viewer</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="px-2 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {numPages || '?'}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(numPages || 1, currentPage + 1))}
                      disabled={currentPage >= (numPages || 1)}
                      className="px-2 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-8 bg-gray-100 rounded-lg p-4 overflow-y-auto max-h-[600px]">
                  <Document
                    file={paper.pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="max-w-full"
                  >
                    {Array.from(new Array(numPages), (_, index) => (
                      <div key={`page_${index + 1}`} className="mb-8 shadow-lg bg-white rounded-lg overflow-hidden">
                        <Page
                          pageNumber={index + 1}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          className="max-w-full"
                        />
                      </div>
                    ))}
                  </Document>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 