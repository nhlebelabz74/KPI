import LoginPage from "@/pages/login/LoginPage";
// import RegisterPage from "@/pages/RegisterPage";
import HomePage from "@/pages/home/HomePage";
import ProfilePage from "@/pages/profile/ProfilePage";
import ForgotPasswordPage from "@/pages/forgotPassword/ForgotPasswordPage";
import AppraisalPage from "@/pages/appraisal/AppraisalPage";

import CAHomePage from "@/pages/home/CA/CAHomePage";
import AssociateHomePage from "@/pages/home/Associate/AssociateHomePage";
import SAHomePage from "@/pages/home/SeniorAssociate/SAHomePage";
import SDPHomePage from "@/pages/home/SalariedPartner/SDPHomePage";
import EDPHomePage from "@/pages/home/EquityDirector/EDPHomePage";

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
        <div className='bottom-4 right-4 fixed z-50'>
          <ModeToggle />
        </div>
        <Routes>
          <Route path='/' element={ <LoginPage /> } />
          <Route path='/reset-password/:email' element={ <ForgotPasswordPage /> }/>
          
          <Route path='/home' element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path='/home/:role' element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path='/home/CA/:content' element={
            <ProtectedRoute>
              <CAHomePage />
            </ProtectedRoute>
          } />
          <Route path='/home/Associate/:content' element={
            <ProtectedRoute>
              <AssociateHomePage />
            </ProtectedRoute>
          } />
          <Route path='/home/SA/:content' element={
            <ProtectedRoute>
              <SAHomePage />
            </ProtectedRoute>
          } />
          <Route path='/home/SDP/:content' element={
            <ProtectedRoute>
              <SDPHomePage />
            </ProtectedRoute>
          } />
          <Route path='/home/EDP/:content' element={
            <ProtectedRoute>
              <EDPHomePage />
            </ProtectedRoute>
          } />
          <Route path='/:role/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path='/appraisal' element={
            <ProtectedRoute>
              <AppraisalPage />
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