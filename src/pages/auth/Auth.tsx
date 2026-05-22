import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";

// Redux hooks
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";
import { 
  useLoginUserMutation, 
  useVerifyLoginMutation, 
  useRegisterUserMutation, 
  useVerifyRegisterMutation 
} from "../../store/api/userApi";

export const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Component States
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<1 | 2>(1); // 1 = Credentials, 2 = OTP
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // <-- ADDED
  const [otp, setOtp] = useState("");

  // API Mutations
  const [loginUser, { isLoading: isLogging }] = useLoginUserMutation();
  const [verifyLogin, { isLoading: isVerifyingLogin }] = useVerifyLoginMutation();
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [verifyRegister, { isLoading: isVerifyingRegister }] = useVerifyRegisterMutation();

  const isLoading = isLogging || isRegistering || isVerifyingLogin || isVerifyingRegister;

  // STEP 1: Send Data -> Gets OTP
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      toast.error("MISSING FIELDS", { description: "Please fill in all the required details." });
      return;
    }

    // <-- ADDED VALIDATION
    if (!isLogin && password !== confirmPassword) {
      toast.error("PASSWORD MISMATCH", { 
        description: "Your passwords do not match. Please try again.",
        style: { background: '#FFF0F0', color: '#D92D20', border: '1px solid #FDA29B', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', fontWeight: 'bold' }
      });
      return;
    }

    try {
      let response;
      if (isLogin) {
        response = await loginUser({ email, password }).unwrap();
      } else {
        response = await registerUser({ name, email, password, confirmPassword }).unwrap();
      }

      toast.success(response.message || "OTP sent to your email!", {
        style: { background: '#111', color: '#fff', borderRadius: '0px' }
      });
      
      setStep(2); // Move to OTP Screen
      
    } catch (error: any) {
      handleAuthError(error, isLogin ? "LOGIN FAILED" : "REGISTRATION FAILED");
    }
  };

  // STEP 2: Send Data + OTP -> Final Authentication
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("MISSING OTP", { description: "Please enter the OTP sent to your email." });
      return;
    }

    try {
      let response;
      if (isLogin) {
        response = await verifyLogin({ email, otp }).unwrap();
      } else {
        response = await verifyRegister({ name, email, password, otp }).unwrap();
      }

      // Final Success! Update Global State
      dispatch(setCredentials({ user: response.user }));

      toast.success(response.message || `Welcome to SOB Luxe, ${response.user?.name || ''}`, {
        style: { background: '#111', color: '#fff', borderRadius: '0px' }
      });
      
      navigate("/"); // Send Boss to Home!
      
    } catch (error: any) {
      handleAuthError(error, "VERIFICATION FAILED");
    }
  };

  // Error Handler Helper
  const handleAuthError = (error: any, defaultTitle: string) => {
    console.error("Auth Error:", error);
    let errorTitle = defaultTitle;
    let errorDesc = "Invalid credentials or request.";

    if (error.status === 'FETCH_ERROR') {
      errorTitle = "NETWORK ERROR";
      errorDesc = "Cannot reach the server. Please check your connection.";
    } else if (error?.data?.message || error?.data?.msg) {
      errorDesc = error.data.message || error.data.msg;
    }

    toast.error(errorTitle, {
      description: errorDesc,
      style: { background: '#FFF0F0', color: '#D92D20', border: '1px solid #FDA29B', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', fontWeight: 'bold' }
    });
  };

  return (
    <div className="w-full min-h-screen flex bg-white pt-24">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative">
        
        <AnimatePresence mode="wait">
          {/* ================= STEP 1: CREDENTIALS ================= */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md flex flex-col"
            >
              <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-gray-500 mb-4 block">
                {isLogin ? "Welcome Back" : "Join the Club"}
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-gray-900 mb-8">
                {isLogin ? "Sign In." : "Create Account."}
              </h1>

              <form onSubmit={handleStep1} className="flex flex-col gap-6">
                {!isLogin && (
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading}
                    className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                  />
                )}
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}
                  className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                />
                <input 
                  type="password" 
                  placeholder="Password (min. 6 characters)" 
                  required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                  className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                />
                
                {/* <-- ADDED CONFIRM PASSWORD INPUT */}
                {!isLogin && (
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading}
                    className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
                  />
                )}

                <Button type="submit" className="w-full mt-4 flex justify-center items-center gap-2" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Processing...' : 'Continue'}
                </Button>
              </form>

              <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button" disabled={isLoading}
                  onClick={() => { 
                    setIsLogin(!isLogin); 
                    setName(""); 
                    setPassword(""); 
                    setConfirmPassword(""); // <-- ADDED RESET
                  }}
                  className="font-bold text-black uppercase tracking-widest text-[10px] hover:underline disabled:opacity-50"
                >
                  {isLogin ? "Create One" : "Sign In"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: OTP VERIFICATION ================= */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full max-w-md flex flex-col"
            >
              <button 
                onClick={() => setStep(1)} 
                className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-green-600 mb-4 block">
                Security Check
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-gray-900 mb-4">
                Enter OTP.
              </h1>
              <p className="text-sm text-gray-500 mb-8">
                We've sent a one-time password to <br/><strong className="text-black">{email}</strong>
              </p>

              <form onSubmit={handleStep2} className="flex flex-col gap-6">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  maxLength={6}
                  required value={otp} onChange={(e) => setOtp(e.target.value)} disabled={isLoading}
                  className="w-full border-b border-gray-300 py-3 bg-transparent text-xl tracking-[0.5em] focus:outline-none focus:border-black transition-colors disabled:opacity-50 font-mono"
                />

                <Button type="submit" className="w-full mt-4 flex justify-center items-center gap-2" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Verifying...' : 'Verify & Enter'}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Right Side: Editorial Image */}
      <div className="hidden lg:flex w-1/2 bg-[#f0f0f0] relative overflow-hidden items-center justify-center">
        <motion.img 
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
          src="/sob-perfume-bottle.png" alt="SOB Luxury" className="w-[60%] h-auto object-contain drop-shadow-2xl z-10"
        />
        <div className="absolute inset-0 bg-black/5 z-0" />
      </div>
    </div>
  );
};