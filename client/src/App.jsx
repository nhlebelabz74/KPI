import LoginPage from "@/pages/login/LoginPage";
// import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/home/HomePage";
// import ResetPasswordPage from "@/pages/ResetPasswordPage";

import CAHomePage from "@/pages/home/CA/CAHomePage";

import { Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className='bottom-20 right-4 fixed z-50'>
          <ModeToggle />
        </div>
        <Routes>
          <Route path='/' element={ <LoginPage /> } />
          {/* <Route path='/register' element={ <RegisterPage /> } />
          <Route path='/reset-password/:email' element={ <ResetPasswordPage /> }/> */}
          
          <Route path='/home' element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path='/home/CA' element={
            <ProtectedRoute>
              <CAHomePage />
            </ProtectedRoute>
          } />
          <Route path='/home/CA/:content' element={
            <ProtectedRoute>
              <CAHomePage />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default App;