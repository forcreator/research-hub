import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface EditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ content = '', onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex gap-2">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor?.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor?.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor?.isActive('heading', { level: 2 }) ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          Heading
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="p-4 prose dark:prose-invert max-w-none min-h-[500px]"
      />
    </div>
  );
};