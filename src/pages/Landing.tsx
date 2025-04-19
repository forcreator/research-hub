import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, FileText } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="relative isolate">
        {/* Background gradient */}
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[500px] transform-gpu overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Research Made Simple
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Your intelligent research companion. Search, organize, and analyze research papers efficiently.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => navigate('/workspace')}
                className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
              >
                Start Researching
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Powerful Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for research
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-start">
              <div className="rounded-lg bg-blue-50 p-2 ring-1 ring-blue-100">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <dt className="mt-4 font-semibold text-gray-900">Smart Search</dt>
              <dd className="mt-2 leading-7 text-gray-600">
                Search across multiple academic databases simultaneously. Find relevant papers quickly and efficiently.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-lg bg-blue-50 p-2 ring-1 ring-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <dt className="mt-4 font-semibold text-gray-900">Organized Library</dt>
              <dd className="mt-2 leading-7 text-gray-600">
                Keep your research papers organized in a clean, searchable library. Access your papers anytime, anywhere.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-lg bg-blue-50 p-2 ring-1 ring-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <dt className="mt-4 font-semibold text-gray-900">Smart Notes</dt>
              <dd className="mt-2 leading-7 text-gray-600">
                Take notes directly while reading papers. Organize your thoughts and insights efficiently.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} ResearchHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
