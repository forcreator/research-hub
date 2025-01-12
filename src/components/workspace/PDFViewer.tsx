import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, X, Minimize } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PDFUpload } from './PDFUpload';
import { PDFTools } from './PDFTools';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string;
  onClose: () => void;
}

export function PDFViewer({ file, onClose }: PDFViewerProps) {
  const { currentPDF, annotationMode, addAnnotation } = useStore((state) => ({
    currentPDF: state.currentPDF,
    annotationMode: state.annotationMode,
    addAnnotation: state.addAnnotation,
  }));
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (annotationMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      addAnnotation({
        type: annotationMode,
        content: '',
        pageNumber,
        position: { x, y },
      });
    }
  };

  if (!currentPDF) {
    return <PDFUpload />;
  }

  return (
    <div className={`h-full bg-gray-100 flex flex-col relative ${isMinimized ? 'hidden' : ''}`}>
      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-4" onClick={handlePageClick}>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} className="flex justify-center">
          <Page pageNumber={pageNumber} scale={scale} renderTextLayer renderAnnotationLayer />
        </Document>
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="h-5 w-5" />
        </button>
        <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-gray-100 rounded">
          <Minimize className="h-5 w-5" />
        </button>
        <button onClick={() => setScale(scale - 0.1)} className="p-1 hover:bg-gray-100 rounded">
          <ZoomOut className="h-5 w-5" />
        </button>
        <span className="text-sm">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(scale + 0.1)} className="p-1 hover:bg-gray-100 rounded">
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>

      {/* Page Count Display */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2">
        <span className="text-sm">Page {pageNumber} of {numPages}</span>
      </div>

      <PDFTools />
    </div>
  );
} 