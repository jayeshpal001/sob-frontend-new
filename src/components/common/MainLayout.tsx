// src/components/common/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar } from "./Navbar";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { SearchModal } from "./SearchModal";

export const MainLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Navbar />
      
      <main className="flex-grow flex flex-col w-full">
        <Outlet />
      </main>
      
      <Footer />
      <CartDrawer />
      <SearchModal />
      {/* Premium Vercel-style Toaster Config */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb', // gray-200
            borderRadius: '0px', // Sharp luxury edges
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
          },
          className: 'premium-toast',
        }}
      />
    </div>
  );
};