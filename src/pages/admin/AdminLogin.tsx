// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAdminLoginMutation } from "../../store/adminApi"; 

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loginAdmin, { isLoading }] = useAdminLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("MISSING CREDENTIALS", {
        description: "Please enter both email and password.",
        style: {
          background: '#FFF0F0',
          color: '#D92D20',
          border: '1px solid #FDA29B',
          borderRadius: '0px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '10px',
          fontWeight: 'bold'
        }
      });
      return;
    }

    try {
      const response = await loginAdmin({ email, password }).unwrap();
      const { token, user, msg } = response;

      if (user.role !== "admin") {
        toast.error("ACCESS DENIED", {
          description: "Admin privileges required.",
          style: {
            background: '#FFF0F0',
            color: '#D92D20',
            border: '1px solid #FDA29B',
            borderRadius: '0px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '10px',
            fontWeight: 'bold'
          }
        });
        return;
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      toast.success(msg || "Welcome back, Master.", {
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
      
    } catch (error: any) {
      console.error("Login Error:", error);
      
      let errorTitle = "LOGIN FAILED";
      let errorDesc = "Access denied. Invalid credentials.";

      if (error.status === 'FETCH_ERROR') {
        errorTitle = "NETWORK ERROR";
        errorDesc = "Cannot reach the server. Please check your connection.";
      } else if (error?.data?.msg || error?.data?.message) {
        errorDesc = error?.data?.msg || error?.data?.message;
      }

      toast.error(errorTitle, {
        description: errorDesc,
        style: {
          background: '#FFF0F0',
          color: '#D92D20',
          border: '1px solid #FDA29B',
          borderRadius: '0px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '10px',
          fontWeight: 'bold'
        }
      });
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
        <div className="absolute top-0 left-0 w-full h-1 bg-[#111]" />

        <div className="text-center mb-10">
          <img src="/sob-logo.jpg" alt="SOB" className="h-10 mx-auto mb-6 object-contain" />
          <h1 className="text-2xl font-display text-gray-900 tracking-tight">Admin Portal</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="Admin Email"
                className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-[#111] transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#111] text-white py-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-70 group shadow-lg"
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
      </motion.div>
    </div>
  );
};