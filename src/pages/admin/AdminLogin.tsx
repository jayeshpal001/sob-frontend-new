// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
// import { useAppDispatch } from "../../store/hooks";
// import { loginAdmin } from "../../store/authSlice"; // You will link your API here

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Welcome back, Master.", {
        style: {
          background: '#111',
          color: '#fff',
          borderRadius: '0px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '10px'
        }
      });
      
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Access denied. Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-gray-200 shadow-2xl p-10 md:p-12 relative overflow-hidden"
      >
        {/* Subtle Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#111]" />

        {/* Header */}
        <div className="text-center mb-10">
          <img 
            src="/sob-logo.jpg" 
            alt="SOB" 
            className="h-10 mx-auto mb-6 object-contain" 
          />
          <h1 className="text-2xl font-display text-gray-900 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm font-medium transition-all duration-300"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm font-medium transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#111] text-white py-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-70 group"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Secure Login
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Forgot credentials? Contact system architect.
          </p>
        </div>
      </motion.div>
    </div>
  );
};