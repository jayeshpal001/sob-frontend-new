// src/pages/Auth.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser, clearAuthError } from "../store/authSlice";
import { Button } from "../components/ui/Button";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useAppSelector((state) => state.auth);

  // Redirect to home if logged in successfully
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Future me isko "/dashboard" bhej sakte hain
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());
    // Since it's mock, we use the same endpoint for both right now
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="w-full min-h-screen flex bg-white pt-24">
      
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md flex flex-col"
        >
          <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
            {isLogin ? "Welcome Back" : "Join the Club"}
          </span>
          <h1 className="text-4xl md:text-5xl font-display text-gray-900 mb-8">
            {isLogin ? "Sign In." : "Create Account."}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
              />
            )}
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
            />
            <input 
              type="password" 
              placeholder="Password (min. 6 characters)" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors"
            />

            {error && (
              <p className="text-red-500 text-xs font-sans mt-2">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full mt-4" 
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                dispatch(clearAuthError());
              }}
              className="font-bold text-black uppercase tracking-widest text-[10px] hover:underline"
            >
              {isLogin ? "Create One" : "Sign In"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Editorial Image */}
      <div className="hidden lg:flex w-1/2 bg-[#f0f0f0] relative overflow-hidden items-center justify-center">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/sob-perfume-bottle.png" // Reusing our premium asset
          alt="SOB Luxury"
          className="w-[60%] h-auto object-contain drop-shadow-2xl z-10"
        />
        {/* Subtle background overlay to make it look distinct from other pages */}
        <div className="absolute inset-0 bg-black/5 z-0" />
      </div>

    </div>
  );
};