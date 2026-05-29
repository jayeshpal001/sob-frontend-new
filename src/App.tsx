// src/App.tsx
import { useEffect, useRef, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // 🚀 useLocation import kiya
import Lenis from "@studio-freight/lenis";
import { Toaster } from "sonner"; 
import { MainLayout } from "./components/common/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { SplashScreen } from "./components/common/SplashScreen";
import { PageLoader } from "./components/common/PageLoader";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";


// Customer Pages
const Home = lazy(() => import("./pages/shop/Home").then((m) => ({ default: m.Home })));
const Collection = lazy(() => import("./pages/shop/Collection").then((m) => ({ default: m.Collection })));
const About = lazy(() => import("./pages/shop/About").then((m) => ({ default: m.About })));
const ProductDetails = lazy(() => import("./pages/shop/ProductDetails").then((m) => ({ default: m.ProductDetails })));
const Auth = lazy(() => import("./pages/auth/Auth").then((m) => ({ default: m.Auth })));
const Checkout = lazy(() => import("./pages/shop/Checkout").then((m) => ({ default: m.Checkout })));
const Profile = lazy(() => import("./pages/shop/Profile").then((m) => ({ default: m.Profile })));
const NotFound = lazy(() => import("./pages/shop/NotFound").then((m) => ({ default: m.NotFound })));
const Contact = lazy(() => import("./pages/shop/Contact").then((m) => ({ default: m.Contact })));

// Admin Pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts").then((m) => ({ default: m.AdminProducts })));
const AdminAddProduct = lazy(() => import("./pages/admin/AdminAddProduct").then((m) => ({ default: m.AdminAddProduct })));
const AdminEditProduct = lazy(() => import("./pages/admin/AdminEditProduct").then((m) => ({ default: m.AdminEditProduct })));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders").then((m) => ({ default: m.AdminOrders })));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories").then((m) => ({ default: m.AdminCategories })));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers").then((m) => ({ default: m.AdminUsers })));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews").then((m) => ({ default: m.AdminReviews })));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners").then((m) => ({ default: m.AdminBanners })));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons").then((m) => ({ default: m.AdminCoupons })));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings").then((m) => ({ default: m.AdminSettings })));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin").then((m) => ({ default: m.AdminLogin })));

function App() {
  const location = useLocation();
  const lenisRef = useRef<any>(null); 

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis; 

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      // immediate: true ensures it snaps instantly without scrolling animation
      lenisRef.current.scrollTo(0, { immediate: true }); 
    }
    // Fallback for standard browser behavior
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]); // Triggers every time URL changes

  return (
    <>
      <Toaster position="top-right" />
      <SplashScreen />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* =========================================
              ADMIN ROUTES (Independent Layout)
          ========================================= */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Restored Admin Protected Route */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminAddProduct />} />
              <Route path="products/edit/:id" element={<AdminEditProduct />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* =========================================
              CUSTOMER ROUTES (Main Layout)
          ========================================= */}
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/contact" element={<Contact />} />
            {/* Customer Protected Route */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* 404 Catch-All Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;