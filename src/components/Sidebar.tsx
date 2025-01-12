import { FolderOpen, BookOpen, Clock, Star, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  icon: typeof FolderOpen;
  label: string;
  path: string;
}

export function Sidebar() {
  const location = useLocation();

  const navItems: NavItem[] = [
    { icon: FolderOpen, label: 'Projects', path: '/workspace' },
    { icon: BookOpen, label: 'Library', path: '/library' },
    { icon: Clock, label: 'Recent', path: '/recent' },
    { icon: Star, label: 'Favorites', path: '/favorites' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 text-sm ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 