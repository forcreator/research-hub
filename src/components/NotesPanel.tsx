import { useState, useRef, useImperativeHandle, forwardRef, useCallback, memo } from 'react';
import { Download, Trash } from 'lucide-react';

export interface NotesPanelRef {
  appendToCurrentNote: (text: string) => void;
}

const NotesPanel = forwardRef<NotesPanelRef>((_, ref) => {
  const [notes, setNotes] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Memoize handlers to prevent unnecessary re-renders
  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote(e.target.value);
  }, []);

  const addNote = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentNote.trim()) {
      setNotes(prev => [...prev, currentNote.trim()]);
      setCurrentNote('');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [currentNote]);

  const deleteNote = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev => prev.filter((_, i) => i !== index));
  }, []);

  const downloadNotes = useCallback(() => {
    const notesText = notes.join('\n\n---\n\n');
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research-notes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [notes]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      addNote();
    }
  }, [addNote]);

  useImperativeHandle(ref, () => ({
    appendToCurrentNote: (text: string) => {
      setCurrentNote(prev => {
        const newNote = prev ? `${prev}\n\n${text}` : text;
        return newNote;
      });
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }), []);

  return (
    <div className="h-full flex flex-col bg-white" onClick={e => e.stopPropagation()}>
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-2">Research Notes</h2>
        <div className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={currentNote}
            onChange={handleNoteChange}
            onKeyDown={handleKeyDown}
            placeholder="Take notes here..."
            className="w-full h-32 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex justify-between items-center">
            <button
              onClick={addNote}
              disabled={!currentNote.trim()}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Note
            </button>
            <span className="text-xs text-gray-500">
              Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to save
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div
                key={index}
                className="group relative bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
              >
                <pre className="whitespace-pre-wrap text-sm font-sans">{note}</pre>
                <button
                  onClick={(e) => deleteNote(index, e)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No notes yet</div>
        )}
      </div>

      {notes.length > 0 && (
        <div className="p-4 border-t">
          <button
            onClick={downloadNotes}
            className="flex items-center gap-2 px-3 py-2 w-full justify-center bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Notes
          </button>
        </div>
      )}
    </div>
  );
});

NotesPanel.displayName = 'NotesPanel';

export { NotesPanel }; 