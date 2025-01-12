import { Search, Bell, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Header() {
  const user = useStore((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">ResearchHub</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Search papers, notes..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
          <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{user.name}</span>
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 