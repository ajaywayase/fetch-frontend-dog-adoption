import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { LoginForm } from "./components/LoginForm";
import { SearchPage } from "./pages/SearchPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

function AuthCheck({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (!userName) {
      navigate("/");
    }
  }, [navigate]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/search"
            element={
              <AuthCheck>
                <SearchPage />
              </AuthCheck>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
