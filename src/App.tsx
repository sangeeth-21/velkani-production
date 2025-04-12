import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import SubcategoryPage from "./pages/SubcategoryPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import SpecialOffersPage from "./pages/offerproduct";
import Allproduct from "./pages/Allproducts";
import LoginPage from "./pages/LoginPage";
import ServiceUnavailable from "./pages/ServiceUnavailable";
import InternetConnectionDetector from "./components/InternetConnectionDetector";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CartProvider>
          <AdminAuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/category/:categoryId" element={<SubcategoryPage />} />
                <Route path="/category/:categoryId/subcategory/:subcategoryId" element={<CategoryProductsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/offer" element={<SpecialOffersPage />} />
                <Route path="/allproducts" element={<Allproduct />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/service-unavailable" element={<ServiceUnavailable />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <InternetConnectionDetector />
            </BrowserRouter>
          </AdminAuthProvider>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;