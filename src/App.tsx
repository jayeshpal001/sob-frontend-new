// src/App.tsx
import { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

import { MainLayout } from "./components/common/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { SplashScreen } from "./components/common/SplashScreen";
import { PageLoader } from "./components/common/PageLoader"; // NAYA IMPORT

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
