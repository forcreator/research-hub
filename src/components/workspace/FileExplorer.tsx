import { useState } from 'react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Upload,
  FolderPlus,
  FilePlus
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

interface FileExplorerProps {
  onFileSelect: (file: string) => void;
  onCreateDocument: () => void;
}

export function FileExplorer({ onFileSelect, onCreateDocument }: FileExplorerProps) {
  const [items, setItems] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Literature',
      type: 'folder',
      children: [],
    },
    {
      id: '2',
      name: 'Results',
      type: 'folder',
      children: [],
    },
    {
      id: '3',
      name: 'Documentations',
      type: 'folder',
      children: [],
    },
  ]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const renderItem = (item: FileItem, level = 0) => {
    const isExpanded = expandedFolders.has(item.id);

    return (
      <div key={item.id}>
        <div 
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer ${level > 0 ? 'ml-4' : ''}`}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              onFileSelect(item.name);
            }
          }}
        >
          {item.type === 'folder' && (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          {item.type === 'folder' ? <Folder className="h-4 w-4 text-blue-500" /> : <File className="h-4 w-4 text-gray-500" />}
          <span className="text-sm">{item.name}</span>
        </div>
        {item.type === 'folder' && isExpanded && item.children?.map(child => renderItem(child, level + 1))}
      </div>
    );
  };

  const createNewFolder = () => {
    const newFolderName = prompt('Enter folder name:');
    if (newFolderName) {
      const newFolder: FileItem = {
        id: crypto.randomUUID(),
        name: newFolderName,
        type: 'folder',
        children: [],
      };
      setItems((prevItems) => [...prevItems, newFolder]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileItem[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: 'file',
      }));

      setItems((prevItems) => {
        const updatedItems = [...prevItems];
        // Assuming you want to add files to the first folder for simplicity
        updatedItems[0].children = [
          ...(updatedItems[0].children || []),
          ...newFiles,
        ];
        return updatedItems;
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const newFiles: FileItem[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: 'file',
      }));

      setItems((prevItems) => {
        const updatedItems = [...prevItems];
        // Assuming you want to add files to the first folder for simplicity
        updatedItems[0].children = [
          ...(updatedItems[0].children || []),
          ...newFiles,
        ];
        return updatedItems;
      });
    }
  };

  return (
    <div className="h-full bg-white border-r flex flex-col" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Files</h2>
          <div className="flex gap-1">
            <button onClick={createNewFolder} className="p-1 hover:bg-gray-100 rounded">
              <FolderPlus className="h-4 w-4" />
            </button>
            <label className="p-1 hover:bg-gray-100 rounded cursor-pointer">
              <Upload className="h-4 w-4" />
              <input type="file" multiple accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
            </label>
            <button onClick={onCreateDocument} className="p-1 hover:bg-gray-100 rounded">
              <FilePlus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {items.map(item => renderItem(item))}
      </div>
    </div>
  );
}