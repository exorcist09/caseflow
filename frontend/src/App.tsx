import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UploadPage from "./pages/import/UploadPage";
import MappingPage from "./pages/MappingPage";
import CasesListPage from "./pages/CasesListPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import ValidationPage from "./pages/import/ValidationPage";
import SubmitPage from "./pages/import/SubmitPage";
import Navbar from "./components/Navbar";
import { useAuth } from "./state/useAuth";

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();

  // Hide Navbar on login and signup pages
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-gray-60">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/upload"
          element={
            <Protected>
              <UploadPage />
            </Protected>
          }
        />
        <Route
          path="/import/submit"
          element={
            <Protected>
              <SubmitPage />
            </Protected>
          }
        />
        <Route
          path="/import/preview"
          element={
            <Protected>
              <MappingPage />
            </Protected>
          }
        />
        <Route
          path="/validate"
          element={
            <Protected>
              <ValidationPage />
            </Protected>
          }
        />
        <Route
          path="/cases"
          element={
            <Protected>
              <CasesListPage />
            </Protected>
          }
        />
        <Route
          path="/cases/:id"
          element={
            <Protected>
              <CaseDetailPage />
            </Protected>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/upload" replace />} />
      </Routes>
    </div>
  );
}
