// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useLoginUserMutation, useVerifyLoginMutation } from "../../store/api/userApi";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";

export const AdminLogin = () => {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Creds, 2 = OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // API Mutations
  const [loginAdmin, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const [verifyLogin, { isLoading: isVerifying }] = useVerifyLoginMutation();

  const isLoading = isLoggingIn || isVerifying;

  // STEP 1: Send Credentials -> Receive OTP
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("MISSING CREDENTIALS", {
        description: "Please enter both email and password.",
        style: { background: '#FFF0F0', color: '#D92D20', border: '1px solid #FDA29B', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', fontWeight: 'bold' }
      });
      return;
    }

    try {
      const response = await loginAdmin({ email, password }).unwrap();
      toast.success(response.message || "OTP sent to your email!", {
        style: { background: '#111', color: '#fff', borderRadius: '0px' }
      });
      setStep(2); // Move to OTP Screen
    } catch (error: any) {
      handleError(error, "LOGIN FAILED");
    }
  };

  // STEP 2: Send Email + OTP -> Final Authentication
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("MISSING OTP", {
        description: "Please enter the 6-digit OTP."
      });
      return;
    }

    try {
      const response = await verifyLogin({ email, otp }).unwrap();
      const { user, token, message, msg } = response;

      // SECURITY CHECK: Is this user actually an admin?
      if (user.role !== "admin") {
        toast.error("ACCESS DENIED", {
          description: "Admin privileges required.",
          style: { background: '#FFF0F0', color: '#D92D20', border: '1px solid #FDA29B', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', fontWeight: 'bold' }
        });
        return;
      }

      // Update LocalStorage for AdminProtectedRoute
      localStorage.setItem("adminToken", token || "cookie-based-auth-active"); 
      localStorage.setItem("adminUser", JSON.stringify(user));

      // Update Global Redux State
      dispatch(setCredentials({ user }));

      toast.success(msg || message || "Welcome back, Master.", {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }
      });
      
      navigate("/admin/dashboard");
      
    } catch (error: any) {
      handleError(error, "VERIFICATION FAILED");
    }
  };

  const handleError = (error: any, defaultTitle: string) => {
    console.error("Auth Error:", error);
    let errorTitle = defaultTitle;
    let errorDesc = "Access denied. Invalid credentials.";

    if (error.status === 'FETCH_ERROR') {
      errorTitle = "NETWORK ERROR";
      errorDesc = "Cannot reach the server. Please check your connection.";
    } else if (error?.data?.msg || error?.data?.message) {
      errorDesc = error?.data?.msg || error?.data?.message;
    }

    toast.error(errorTitle, {
      description: errorDesc,
      style: { background: '#FFF0F0', color: '#D92D20', border: '1px solid #FDA29B', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', fontWeight: 'bold' }
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-gray-200 shadow-2xl p-10 md:p-12 relative overflow-hidden min-h-[450px] flex flex-col justify-center"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-[#111]" />

        <div className="text-center mb-10">
          <img src="/sob-logo.png" alt="SOB" className="h-10 mx-auto mb-6 object-contain" />
          <h1 className="text-2xl font-display text-gray-900 tracking-tight">Admin Portal</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">
            {step === 1 ? "Authorized Personnel Only" : "Security Verification"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: CREDENTIALS */}
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleStep1} 
              className="space-y-6"
            >
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
                    className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm font-medium transition-all duration-300 disabled:opacity-50"
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
                    className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-sm font-medium transition-all duration-300 disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111] text-white py-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-70 group shadow-lg"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleStep2} 
              className="space-y-6"
            >
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-4 bg-[#F9FAFB] border border-transparent focus:border-gray-300 focus:bg-white outline-none text-xl tracking-[0.5em] text-center font-mono font-bold transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111] text-white py-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-70 group shadow-lg"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    Verify & Enter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};