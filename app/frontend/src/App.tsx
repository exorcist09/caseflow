import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UploadPage from './pages/import/UploadPage';
import MappingPage from "./pages/MappingPage";
import CasesListPage from './pages/CasesListPage';
import CaseDetailPage from './pages/CaseDetailPage';
import { useAuth } from './state/useAuth';
import ValidationPage from "./pages/import/ValidationPage"; 
import SubmitPage from './pages/import/SubmitPage';
import Navbar from "./components/Navbar";


function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/import/submit" element={<SubmitPage/>} />
        <Route path="/import/preview" element={<MappingPage/>} />
        <Route path="/cases" element={<CasesListPage />} />
        <Route path="/cases/:id" element={<CaseDetailPage />} />
        <Route path="/validate" element={<ValidationPage />} />

        <Route path="/" element={<Navigate to="/upload" replace />} />
      </Routes>
    </div>
  );
}

// TODO: add 404 page and add protected routes 