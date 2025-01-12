import { ResizablePanels } from '@/components/ResizablePanels';
import { FileExplorer } from '@/components/workspace/FileExplorer';
import { DocumentEditor } from '@/components/workspace/DocumentEditor';
import { ResearchSearch } from '@/components/workspace/ResearchSearch';
import { PDFViewer } from '@/components/workspace/PDFViewer';
import { useState } from 'react';

export function Workspace() {
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);

  const handleCreateDocument = () => {
    // Logic to create a new document
    // This could open a new document in the DocumentEditor
    // For example, you might set a state that indicates a new document is being created
    // setNewDocument(true);
  };

  const handleFileSelect = (file: string) => {
    setSelectedPDF(file);
  };

  return (
    <div className="h-screen">
      <ResizablePanels>
        <FileExplorer onFileSelect={handleFileSelect} onCreateDocument={handleCreateDocument} />
        <DocumentEditor />
        <ResearchSearch />
      </ResizablePanels>

      {selectedPDF && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden">
            <PDFViewer file={selectedPDF} onClose={() => setSelectedPDF(null)} />
          </div>
        </div>
      )}
    </div>
  );
}