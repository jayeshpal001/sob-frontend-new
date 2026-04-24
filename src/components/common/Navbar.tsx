// src/components/common/Navbar.tsx
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleCart } from "../../store/cartSlice";
import { toggleSearch } from "../../store/uiSlice";

export const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation(); // To close menu on route change
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
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
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-24 flex justify-between items-center">
          
          {/* Left: Hamburger (Mobile Only) */}
          <div className="w-1/3 flex lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
              <Menu strokeWidth={1.5} className="w-6 h-6" />
            </button>
          </div>
          
          {/* Left Space (Desktop) */}
          <div className="w-1/3 hidden lg:block"></div>

          {/* Center Logo */}
          <div className="w-1/3 flex justify-center">
            <Link to="/" className="relative flex items-center justify-center cursor-pointer group">
              <img
                src="/sob-logo.jpg"
                alt="SOB Fragrances"
                className="h-12 lg:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Right Navigation & Cart */}
          <div className="w-1/3 flex justify-end items-center gap-6 lg:gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">
            <nav className="hidden lg:flex gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className="relative group overflow-hidden">
                  <span className="group-hover:text-black transition-colors duration-300">
                    {link.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                </Link>
              ))}
            </nav>
            
            {/* Search Icon Modal Trigger */}
            <button
              onClick={() => dispatch(toggleSearch())}
              className="hidden sm:flex relative items-center justify-center group"
            >
              <Search strokeWidth={1.5} className="w-5 h-5 group-hover:stroke-black transition-colors" />
            </button>
            
            {/* Dynamic User Route Navigation (Hidden on very small screens, moved to menu) */}
            <Link to={isAuthenticated ? "/dashboard" : "/auth"} className="hidden sm:flex relative items-center justify-center group">
              <User strokeWidth={1.5} className="w-5 h-5 group-hover:stroke-black transition-colors" />
            </Link>
            
            {/* Cart Icon */}
            <button onClick={() => dispatch(toggleCart())} className="relative flex items-center justify-center group">
              <ShoppingBag strokeWidth={1.5} className="w-5 h-5 group-hover:stroke-black transition-colors" />
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-black text-white text-[9px] flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            </button>
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
                 <img src="/sob-logo.png" alt="SOB" className="h-10 w-auto object-contain" />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                <X strokeWidth={1.5} className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-1 flex flex-col justify-center px-12 gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                >
                  <Link 
                    to={link.href} 
                    className="text-4xl font-display text-black block w-fit"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 pt-8 border-t border-gray-100"
              >
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/auth"} 
                  className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-500"
                >
                  <User className="w-5 h-5" /> 
                  {isAuthenticated ? "My Account" : "Sign In / Register"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};