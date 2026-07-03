import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScoringProvider } from "./contexts/ScoringContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Header } from "./components/Header";
import NewJump from "./pages/NewJump";
import PresetEvents from "./pages/PresetEvents";
import Result from "./pages/Result";
import ParametersGuide from "./pages/ParametersGuide";
import OverallImpression from "./pages/OverallImpression";
import Demo from "./pages/Demo";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ScoringProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Header />
                    <Routes>
                      <Route path="/" element={<NewJump />} />
                      <Route path="/preset" element={<PresetEvents />} />
                      <Route path="/result" element={<Result />} />
                      <Route path="/parameters-guide" element={<ParametersGuide />} />
                      <Route path="/overall-impression" element={<OverallImpression />} />
                      <Route path="/demo" element={<Demo />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ScoringProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
