// src/components/common/BannerPopup.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetActiveBannerQuery } from "../../store/api/userApi";

export const BannerPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const { data, isLoading } = useGetActiveBannerQuery();
  const banners = data?.data || [];

  useEffect(() => {
    if (banners.length > 0) {
      //  Smart Session Logic
      const bannerSignature = banners.map((b: any) => b._id).join(",");
      const storedSignature = sessionStorage.getItem("bannerSignature");

      if (bannerSignature !== storedSignature) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("bannerSignature", bannerSignature);
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [banners]);

  //  Auto-Slide Logic
  useEffect(() => {
    if (isOpen && banners.length > 1) {
      const slideTimer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 4000);

      return () => clearInterval(slideTimer); // Cleanup on unmount/close
    }
  }, [isOpen, banners.length]);

  if (isLoading || banners.length === 0) return null;

  const getImageUrl = (image: string) => {
    if (!image) return "";
    return image.startsWith("http")
      ? image
      : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/uploads/${image}`;
  };

  const handleBannerClick = (url: string) => {
    setIsOpen(false);
    if (url) {
      if (url.startsWith("http")) {
        window.open(url, "_blank");
      } else {
        navigate(url);
      }
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBanner = banners[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Banner Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-4xl bg-white shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-30 p-2 bg-black/40 hover:bg-black text-white rounded-full transition-all backdrop-blur-md"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Slider Area */}
            <div className="relative w-full aspect-video sm:aspect-[21/9] group bg-gray-100">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentBanner._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className={`absolute inset-0 w-full h-full ${currentBanner.redirectUrl ? "cursor-pointer" : ""}`}
                  onClick={() => handleBannerClick(currentBanner.redirectUrl)}
                >
                  <img
                    src={getImageUrl(currentBanner.image)}
                    alt="Promotional Banner"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </motion.div>
              </AnimatePresence>

              {banners.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/40 hover:bg-white text-black rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/40 hover:bg-white text-black rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dots / Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    {banners.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(idx);
                        }}
                        className={`transition-all duration-300 rounded-full ${
                          idx === currentIndex
                            ? "w-6 h-1.5 bg-white"
                            : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
