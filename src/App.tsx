
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initializeLocalStorage } from "./lib/localStorageUtils";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RoomsPage from "./pages/RoomsPage";
import BookingsPage from "./pages/BookingsPage";
import ReceiptPage from "./pages/ReceiptPage";
import ReceiptsPage from "./pages/ReceiptsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize local storage with default data
    initializeLocalStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/rooms" element={<Layout><RoomsPage /></Layout>} />
            <Route path="/bookings" element={<Layout><BookingsPage /></Layout>} />
            <Route path="/receipts" element={<Layout><ReceiptsPage /></Layout>} />
            <Route path="/receipt/:id" element={<Layout><ReceiptPage /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
