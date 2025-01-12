import { FolderOpen, Plus } from 'lucide-react';

export function ProjectList() {
  return (
    <div className="h-full bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-2">
        {/* Placeholder projects */}
        {['Research Paper', 'Literature Review', 'Thesis Notes'].map((project) => (
          <div
            key={project}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
          >
            <FolderOpen className="h-4 w-4 text-gray-500" />
            <span>{project}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 