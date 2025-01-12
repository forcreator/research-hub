import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { Landing } from './pages/Landing';
import { SignInPage, SignUpPage, PublicRoute, PrivateRoute } from './routes/auth';
import { Workspace } from './pages/Workspace';
import { CreateProject } from './pages/CreateProject';

export default function App() {
  const { loaded } = useClerk();

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route 
          path="/workspace" 
          element={
            <PrivateRoute>
              <Workspace />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/create-project" 
          element={
            <PrivateRoute>
              <CreateProject />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}