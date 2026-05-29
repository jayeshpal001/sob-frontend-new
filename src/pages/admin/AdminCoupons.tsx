import { useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetCouponsQuery, useCreateCouponMutation, useDeleteCouponMutation } from "../../store/api/adminApi";

export const AdminCoupons = () => {
  const { data: response, isLoading } = useGetCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const coupons = response?.data || [];

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "0",
    expiryDate: ""
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCoupon(formData).unwrap();
      toast.success("Coupon created successfully");
      setFormData({ code: "", discountType: "percentage", discountValue: "", minOrderAmount: "0", expiryDate: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id).unwrap();
        toast.success("Coupon deleted");
      } catch (error: any) {
        toast.error("Failed to delete coupon");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      
      {/* Create Coupon Form */}
      <div className="bg-white p-8 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mb-6 flex items-center gap-2">
          <Ticket className="w-4 h-4" /> Create New Coupon
        </h3>
        
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Code</label>
            <input type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. FESTIVAL50" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black uppercase" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Type</label>
            <select value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Value</label>
            <input type="number" required value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} placeholder="e.g. 20" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Expiry Date</label>
            <input type="date" required value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black text-sm" />
          </div>
          <button type="submit" disabled={isCreating} className="bg-[#111] text-white py-3 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2">
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create
          </button>
        </form>
      </div>

      {/* Coupons List */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Coupon Code</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Discount</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Min Order</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Expiry Date</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon: any) => (
                <tr key={coupon._id} className="hover:bg-gray-50/50">
                  <td className="px-8 py-5 text-sm font-bold text-gray-900 tracking-wider">{coupon.code}</td>
                  <td className="px-8 py-5 text-sm text-gray-600">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-600">₹{coupon.minOrderAmount}</td>
                  <td className="px-8 py-5 text-sm text-gray-600">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => handleDelete(coupon._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};