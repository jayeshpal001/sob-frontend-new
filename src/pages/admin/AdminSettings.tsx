// src/pages/admin/AdminSettings.tsx
import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Save, Loader2, Percent, Truck, ShoppingBag, Package } from "lucide-react";
import { toast } from "sonner";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "../../store/api/adminApi";

export const AdminSettings = () => {
  const { data: response, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const [formData, setFormData] = useState({
    taxPercentage: 18,
    deliveryCharge: 100,
    freeDeliveryThreshold: 1500,
    bundleLimit: 4,
    bundlePrice: 899,
    bundleIsActive: true, 
  });

  useEffect(() => {
    if (response?.data) {
      setFormData({
        taxPercentage: response.data.taxPercentage ?? 18,
        deliveryCharge: response.data.deliveryCharge ?? 100,
        freeDeliveryThreshold: response.data.freeDeliveryThreshold ?? 1500,
        bundleLimit: response.data.bundleLimit ?? 4,
        bundlePrice: response.data.bundlePrice ?? 899,
        bundleIsActive: response.data.bundleIsActive ?? true, 
      });
    }
  }, [response]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    //  Smart check to handle both numbers and the new checkbox
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : Number(value) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData).unwrap();
      toast.success("Global settings updated successfully!", {
        style: { background: '#111', color: '#fff', borderRadius: '0px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update settings.");
    }
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  if (isLoading) return <div className="w-full h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-4xl">
      <motion.div variants={item}>
        <h2 className="text-3xl md:text-4xl font-display text-gray-900 tracking-tight">Global Config</h2>
        <p className="text-sm text-gray-500 mt-1">Manage tax rules, delivery thresholds, and bundles.</p>
      </motion.div>

      <motion.form variants={item} onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 shadow-sm space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tax Setting */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <Percent className="w-4 h-4 text-gray-400" /> Tax / GST Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                name="taxPercentage"
                value={formData.taxPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full p-4 bg-gray-50 border border-transparent focus:border-black outline-none text-xl font-mono text-gray-900 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">%</span>
            </div>
            <p className="text-xs text-gray-400">This percentage will be applied to the cart subtotal.</p>
          </div>

          {/* Delivery Charge */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <Truck className="w-4 h-4 text-gray-400" /> Flat Delivery Charge
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">₹</span>
              <input
                type="number"
                name="deliveryCharge"
                value={formData.deliveryCharge}
                onChange={handleChange}
                min="0"
                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-transparent focus:border-black outline-none text-xl font-mono text-gray-900 transition-colors"
              />
            </div>
            <p className="text-xs text-gray-400">Standard shipping fee applied to orders.</p>
          </div>

          {/* Free Delivery Threshold */}
          <div className="space-y-3 md:col-span-2 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <ShoppingBag className="w-4 h-4 text-gray-400" /> Free Delivery Threshold
            </label>
            <div className="relative md:w-1/2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">₹</span>
              <input
                type="number"
                name="freeDeliveryThreshold"
                value={formData.freeDeliveryThreshold}
                onChange={handleChange}
                min="0"
                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-green-200 focus:border-green-500 outline-none text-xl font-mono text-green-700 transition-colors"
              />
            </div>
            <p className="text-xs text-green-600 font-medium mt-2">
              If the cart subtotal is greater than or equal to ₹{formData.freeDeliveryThreshold}, delivery will be FREE.
            </p>
          </div>
        </div>

        {/* Build Your Own Box Config Section */}
        <div className="pt-8 border-t border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
             <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Build Your Own Box Config
                </h3>
                <p className="text-xs text-gray-500 mt-1">Manage the dynamic perfume bundle limits and pricing.</p>
             </div>
             
             {/* 🚀 Slick Toggle Switch for Feature Status */}
             <label className="relative inline-flex items-center cursor-pointer group">
               <input 
                 type="checkbox" 
                 name="bundleIsActive"
                 checked={formData.bundleIsActive}
                 onChange={handleChange}
                 className="sr-only peer"
               />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#111]"></div>
               <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">
                 {formData.bundleIsActive ? "Active" : "Paused"}
               </span>
             </label>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-opacity duration-300 ${!formData.bundleIsActive ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Bundle Limit */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Items Limit
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="bundleLimit"
                  value={formData.bundleLimit}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-4 bg-gray-50 border border-transparent focus:border-black outline-none text-xl font-mono text-gray-900 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-400">Total number of perfumes a user must pick.</p>
            </div>

            {/* Bundle Price */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Bundle Flat Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">₹</span>
                <input
                  type="number"
                  name="bundlePrice"
                  value={formData.bundlePrice}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-transparent focus:border-black outline-none text-xl font-mono text-gray-900 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-400">The fixed price charged for the completed box.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isUpdating}
            className="flex items-center gap-2 bg-[#111] text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-70"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Configuration
          </button>
        </div>

      </motion.form>
    </motion.div>
  );
};