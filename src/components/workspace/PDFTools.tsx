import { 
  Highlighter, 
  BookmarkPlus, 
  MessageSquarePlus, 
  Download,
  Share2
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Tool {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  active?: boolean;
}

export function PDFTools() {
  const { currentPDF, setAnnotationMode } = useStore((state) => ({
    currentPDF: state.currentPDF,
    setAnnotationMode: state.setAnnotationMode
  }));

  const tools: Tool[] = [
    {
      icon: Highlighter,
      label: 'Highlight',
      action: () => setAnnotationMode('highlight'),
    },
    {
      icon: MessageSquarePlus,
      label: 'Comment',
      action: () => setAnnotationMode('comment'),
    },
    {
      icon: BookmarkPlus,
      label: 'Bookmark',
      action: () => setAnnotationMode('bookmark'),
    },
    {
      icon: Download,
      label: 'Download',
      action: () => {
        if (currentPDF) {
          const link = document.createElement('a');
          link.href = currentPDF;
          link.download = 'document.pdf';
          link.click();
        }
      },
    },
    {
      icon: Share2,
      label: 'Share',
      action: () => {
        // Implement sharing functionality
        console.log('Share clicked');
      },
    },
  ];

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
      {tools.map((tool) => (
        <button
          key={tool.label}
          onClick={tool.action}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
            tool.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
          }`}
        >
          <tool.icon className="h-4 w-4" />
          <span>{tool.label}</span>
        </button>
      ))}
    </div>
  );
} 