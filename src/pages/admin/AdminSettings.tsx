// src/pages/admin/AdminSettings.tsx
import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Save, Loader2, Percent, Truck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "../../store/api/adminApi";

export const AdminSettings = () => {
  const { data: response, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const [formData, setFormData] = useState({
    taxPercentage: 18,
    deliveryCharge: 100,
    freeDeliveryThreshold: 1500,
  });

  useEffect(() => {
    if (response?.data) {
      setFormData({
        taxPercentage: response.data.taxPercentage,
        deliveryCharge: response.data.deliveryCharge,
        freeDeliveryThreshold: response.data.freeDeliveryThreshold,
      });
    }
  }, [response]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
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
        <p className="text-sm text-gray-500 mt-1">Manage tax rules and delivery thresholds.</p>
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