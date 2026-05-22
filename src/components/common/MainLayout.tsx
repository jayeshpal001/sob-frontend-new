// src/components/common/MainLayout.tsx
import { Outlet } from "react-router-dom";
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
    
    </div>
  );
};