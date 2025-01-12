import { 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn, 
  SignIn, 
  SignUp 
} from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

export function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <SignedOut>
      {children}
    </SignedOut>
  );
}

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl={location.pathname} />
      </SignedOut>
    </>
  );
}

export function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "rounded-xl shadow-lg",
          }
        }}
        redirectUrl="/workspace"
      />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "rounded-xl shadow-lg",
          }
        }}
        redirectUrl="/create-project"
      />
    </div>
  );
} 