import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Search, Share2 } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your Research Journey
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Streamline your research workflow with our all-in-one platform for managing papers,
              taking notes, and collaborating with peers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => navigate('/sign-in')}
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4 inline" />
              </button>
              <button
                onClick={() => navigate('/sign-up')}
                className="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Research Made Simple
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for your research
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  Smart Search
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Find relevant papers quickly with our intelligent search system
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  Organized Notes
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Keep your research notes organized and easily accessible
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                  Easy Sharing
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Share your research and collaborate with peers seamlessly
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}