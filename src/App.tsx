// src/App.tsx
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

import { MainLayout } from './components/common/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { SplashScreen } from './components/common/SplashScreen'; // NAYA IMPORT

// Pages
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Collection } from './pages/Collection';
import { Auth } from './pages/Auth';
import { Checkout } from './pages/Checkout';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

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
        {/* Onboarding Splash Screen */}
        <SplashScreen />
        
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
      </>
  );
}

export default App;