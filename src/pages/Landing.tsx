import { useNavigate } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 flex-grow">
        <img
          src="https://images.unsplash.com/photo-1496065187959-7f07b8353c55?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Unsplash image
          alt="Innovation"
          className="absolute inset-0 w-full h-full object-cover opacity-2"
        />
        <div className="relative mx-auto max-w-3xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-orange-100 sm:text-6xl drop-shadow-md">
            Welcome to ResearchHub
          </h1>
          <p className="mt-6 text-lg leading-8 text-orange-100">
            Simplify your research journey with a seamless platform for discovery, organization, and collaboration.
          </p>
          <button
            onClick={() => navigate('/create-project')}
            className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Empowering Researchers
            </h2>
            <p className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Everything You Need for Research
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              From discovery to collaboration, ResearchHub has all the tools to streamline your workflow.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-16 items-center justify-center sm:grid-cols-2 lg:grid-cols-2">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-blue-100">
                <Search className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Smart Search</h3>
              <p className="mt-4 text-base text-gray-600">
                Discover relevant research papers with AI-powered search capabilities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Organized Notes</h3>
              <p className="mt-4 text-base text-gray-600">
                Keep your research notes well-organized and easy to access anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your Research Journey?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join thousands of researchers worldwide using ResearchHub to simplify their workflow.
          </p>
          <button
            onClick={() => navigate('/create-project')}
            className="mt-8 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow-md hover:bg-blue-100 transition-all duration-300 ease-in-out"
          >
            Start Now for Free
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} ResearchHub. All rights reserved.
          </p>
          <p className="text-sm">
            Built with ❤️ by{' '}
            <a href="https://forcreator.space" className="underline hover:text-blue-400">
              forcreator.space
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
