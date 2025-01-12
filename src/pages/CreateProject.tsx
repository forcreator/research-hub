import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { FolderPlus } from 'lucide-react';

const SCIENTIFIC_FIELDS = [
  'Biology',
  'Chemistry',
  'Physics',
  'Computer Science',
  'Mathematics',
  'Medicine',
  'Psychology',
  'Environmental Science',
  'Other'
] as const;

export const CreateProject: React.FC = () => {
  const [name, setName] = React.useState('');
      // Start of Selection
      const [field, setField] = React.useState<typeof SCIENTIFIC_FIELDS[number]>(SCIENTIFIC_FIELDS[0]);
      const navigate = useNavigate();
      const setCurrentProject = useStore((state) => state.setCurrentProject);
      const user = useStore((state) => state.user);
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    if (name.trim() && user) {
      setCurrentProject({
        id: crypto.randomUUID(),
        name: name.trim(),
        field,
        createdAt: new Date(),
        userId: user.id
      });
      navigate('/workspace');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <FolderPlus className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Start your research journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="field" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scientific Field
            </label>
            <select
                  // Start of Selection
                  id="field"
                  value={field}
                  onChange={(e) => setField(e.target.value as "Biology" | "Chemistry" | "Physics" | "Computer Science" | "Mathematics" | "Medicine" | "Psychology" | "Environmental Science" | "Other")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {SCIENTIFIC_FIELDS.map((field) => (
                    <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Project and Enter Workspace
          </button>
        </form>
      </motion.div>
    </div>
  );
};