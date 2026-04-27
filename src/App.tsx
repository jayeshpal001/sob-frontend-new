// src/App.tsx
import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

import { MainLayout } from "./components/common/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { SplashScreen } from "./components/common/SplashScreen";
import { PageLoader } from "./components/common/PageLoader";

// Customer Pages
const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home })),
);
const Collection = lazy(() =>
  import("./pages/Collection").then((m) => ({ default: m.Collection })),
);
const About = lazy(() =>
  import("./pages/About").then((m) => ({ default: m.About })),
);
const ProductDetails = lazy(() =>
  import("./pages/ProductDetails").then((m) => ({ default: m.ProductDetails })),
);
const Auth = lazy(() =>
  import("./pages/Auth").then((m) => ({ default: m.Auth })),
);
const Checkout = lazy(() =>
  import("./pages/Checkout").then((m) => ({ default: m.Checkout })),
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);

// Admin Pages
const AdminLayout = lazy(() =>
  import("./components/admin/AdminLayout").then((m) => ({
    default: m.AdminLayout,
  })),
);
const AdminLogin = lazy(() =>
  import("./pages/admin/AdminLogin").then((m) => ({ default: m.AdminLogin })),
);
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);
const AdminProducts = lazy(() =>
  import("./pages/admin/AdminProducts").then((m) => ({
    default: m.AdminProducts,
  })),
);
const AdminAddProduct = lazy(() =>
  import("./pages/admin/AdminAddProduct").then((m) => ({
    default: m.AdminAddProduct,
  })),
);
const AdminOrders = lazy(() =>
  import("./pages/admin/AdminOrders").then((m) => ({ default: m.AdminOrders })),
);
const AdminCategories = lazy(() =>
  import("./pages/admin/AdminCategories").then((m) => ({
    default: m.AdminCategories,
  })),
);
const AdminUsers = lazy(() =>
  import("./pages/admin/AdminUsers").then((m) => ({ default: m.AdminUsers })),
);
const AdminReviews = lazy(() =>
  import("./pages/admin/AdminReviews").then((m) => ({
    default: m.AdminReviews,
  })),
);
const AdminBanners = lazy(() =>
  import("./pages/admin/AdminBanners").then((m) => ({
    default: m.AdminBanners,
  })),
);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <>
      <SplashScreen />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* =========================================
              ADMIN ROUTES (Independent Layout)
          ========================================= */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            {/* Redirect /admin directly to dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminAddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="banners" element={<AdminBanners />} />
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

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
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
