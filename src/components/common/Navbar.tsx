// src/components/common/Navbar.tsx
import { useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleCart } from "../../store/slices/cartSlice";
import { toggleSearch } from "../../store/slices/uiSlice";

// Import the Cart API to get the true database count
import { useGetCartQuery } from "../../store/api/userApi";

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Authentication State
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Local Redux Cart State (For Guests)
  const localCartItems = useAppSelector((state) => state.cart.items);

  // Live Database Cart State (For Logged In Users)
  const { data: dbCartResponse } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Calculate True Cart Count
  const itemCount = useMemo(() => {
    if (isAuthenticated) {
      const rawDbCart = dbCartResponse?.data || dbCartResponse || {};
      const dbCartItems = rawDbCart.items || [];
      return dbCartItems.reduce((total: number, item: any) => total + (item.quantity || 1), 0);
    }
    return localCartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [isAuthenticated, dbCartResponse, localCartItems]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Smart Hide/Show Logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > 100 && latest > previous && !mobileMenuOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collection" },
    { name: "Build Your Own Box", href: "/build-your-own-box" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-24 flex justify-between items-center gap-8">
          
          {/* Left: Hamburger (Mobile Only) & Logo */}
          <div className="flex-shrink-0 flex items-center justify-start gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex lg:hidden p-2 -ml-2"
            >
              <Menu strokeWidth={1.5} className="w-6 h-6" />
            </button>
            <Link
              to="/"
              className="relative flex items-center cursor-pointer group"
            >
              <img
                src="/sob-logo.png"
                alt="SOB Fragrances"
                className="h-10 lg:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Right Navigation & Cart */}
          <div className="flex-1 flex justify-end items-center gap-6 lg:gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">
            
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative group overflow-hidden flex-shrink-0 pb-1"
                >
                  <span className="group-hover:text-black transition-colors duration-300 block whitespace-nowrap">
                    {link.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 lg:gap-6 ml-2 lg:ml-4 border-l border-gray-200 pl-4 lg:pl-6">
              {/* Search Icon */}
              <button
                onClick={() => dispatch(toggleSearch())}
                className="hidden sm:flex relative items-center justify-center group"
              >
                <Search
                  strokeWidth={1.5}
                  className="w-5 h-5 group-hover:stroke-black transition-colors"
                />
              </button>

              {/* Dynamic User Route Navigation */}
              <Link
                to={isAuthenticated ? "/profile" : "/auth"}
                className="hidden sm:flex relative items-center justify-center group"
              >
                <User
                  strokeWidth={1.5}
                  className="w-5 h-5 group-hover:stroke-black transition-colors"
                />
              </Link>

              {/* Cart Icon */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative flex items-center justify-center group"
              >
                <ShoppingBag
                  strokeWidth={1.5}
                  className="w-5 h-5 group-hover:stroke-black transition-colors"
                />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
            
          </div>
        </div>
      </motion.header>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            {/* Mobile Menu Header */}
            <div className="h-24 px-6 flex justify-between items-center border-b border-gray-100">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img
                  src="/sob-logo.png"
                  alt="SOB"
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-gray-50 hover:bg-gray-100 transition-colors rounded-full"
              >
                <X strokeWidth={1.5} className="w-6 h-6 text-gray-900" />
              </button>
            </div>

            <div className="flex-1 flex flex-col pt-8 px-8 overflow-y-auto">
              
              {/* Links List */}
              <div className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                    className="border-b border-gray-100"
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-5 text-2xl font-display text-gray-900 flex justify-between items-center w-full hover:text-gray-600 transition-colors"
                    >
                      {link.name}
                      {/* Luxury subtle plus icon to indicate clickable link */}
                      <span className="text-gray-300 font-sans text-xl font-light">+</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Actions & Support Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-10 flex flex-col gap-8 pb-12"
              >
                {/* Account Login/Register */}
                <Link
                  to={isAuthenticated ? "/profile" : "/auth"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 bg-gray-50 p-4 rounded-sm"
                >
                  <User className="w-4 h-4" />
                  {isAuthenticated ? "My Account" : "Sign In / Register"}
                </Link>

                {/* Support Info to fill empty space aesthetically */}
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Need Help?</p>
                  <a href="mailto:contact@sobperfumes.com" className="text-sm text-gray-600 underline underline-offset-4 decoration-gray-300">
                    contact@sobperfumes.com
                  </a>
                </div>
              </motion.div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};