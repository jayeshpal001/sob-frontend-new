// src/pages/NotFound.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";

export const NotFound = () => {
  return (
    <div className="w-full min-h-screen bg-[var(--color-surface)] flex items-center justify-center pt-24">
      <div className="max-w-2xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-[120px] leading-none font-display text-gray-200 mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-display text-gray-900 mb-6">
            Scent Not Found.
          </h2>
          <p className="text-gray-500 font-sans mb-10 max-w-md mx-auto">
            The page you are looking for has evaporated. Let's get you back to our collection of signature fragrances.
          </p>
          
          <Link to="/">
            <Button className="flex items-center gap-3 mx-auto">
              Return to Homepage <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};