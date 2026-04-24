// src/pages/Checkout.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { useAppSelector } from "../store/hooks";
import { Button } from "../components/ui/Button";

export const Checkout = () => {
  const { items } = useAppSelector((state) => state.cart);
  
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0; // Flat $15 shipping, free over some amount can be added
  const total = subtotal + shipping;

  return (
    <div className="w-full min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Header / Back Link */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <h1 className="text-4xl font-display text-gray-900 mt-6">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Contact Info */}
            <section>
              <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-6">1. Contact Information</h2>
              <div className="space-y-4">
                <input type="email" placeholder="Email Address" className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
                <div className="flex gap-4">
                  <input type="text" placeholder="First Name" className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
                  <input type="text" placeholder="Last Name" className="w-1/2 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-6">2. Shipping Address</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Street Address" className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
                <div className="flex gap-4">
                  <input type="text" placeholder="City" className="w-1/3 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
                  <input type="text" placeholder="State / Province" className="w-1/3 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
                  <input type="text" placeholder="Postal Code" className="w-1/3 border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
              </div>
            </section>

            {/* Payment Dummy */}
            <section>
              <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-6 flex items-center gap-2">
                3. Payment <Lock className="w-4 h-4 text-gray-400" />
              </h2>
              <div className="p-6 bg-[var(--color-surface)] border border-gray-100 flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 text-sm font-sans mb-4">This is a secure 256-bit encrypted test environment.</p>
                <Button className="w-full max-w-sm">Place Order — ${total}</Button>
              </div>
            </section>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 bg-[var(--color-surface)] p-8 lg:p-10 border border-gray-100">
            <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black mb-8">Order Summary</h2>
            
            {/* Cart Items List */}
            <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-white flex items-center justify-center p-2 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-md">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-sans font-medium text-sm">${item.price * item.quantity}</p>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-6 space-y-4 font-sans text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{subtotal > 0 ? `$${shipping}` : "$0"}</span>
              </div>
              <div className="flex justify-between text-black font-bold text-lg pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${subtotal > 0 ? total : 0}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};