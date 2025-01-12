import { Upload } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function PDFUpload() {
  const setCurrentPDF = useStore((state) => state.setCurrentPDF);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentPDF(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50">
      <div className="p-8 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload PDF</h3>
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop your PDF here or click to browse
          </p>
        </div>
        <label className="relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
            Choose File
          </span>
        </label>
      </div>
    </div>
  );
} 