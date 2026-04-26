// src/pages/Home.tsx
import { HeroSection } from "../components/sections/HeroSection";
import { ProductGrid } from "../components/sections/ProductGrid";
import { StorySection } from "../components/sections/StorySection";
import { FeaturesSection } from "../components/sections/FeaturesSection";
import { TestimonialSection } from "../components/sections/TestimonialSection";
import { ContactSection } from "../components/sections/ContactSection";
import { FeaturedSection } from "../components/sections/FeaturedSection";

export const Home = () => {
  return (
    <div className="flex flex-col w-full min-h-screen pt-24 bg-[var(--color-surface)]">
      <HeroSection />
      <ProductGrid />
      <FeaturedSection/>
      <StorySection />
      <FeaturesSection />
      <TestimonialSection />
      <ContactSection />
    </div>
  );
};