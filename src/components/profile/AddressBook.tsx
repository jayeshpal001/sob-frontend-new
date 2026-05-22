// src/components/profile/AddressBook.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";

import { 
  useGetProfileQuery, 
  useAddAddressMutation,
  useDeleteAddressMutation, 
  useSetDefaultAddressMutation 
} from "../../store/api/userApi";

export const AddressBook = () => {
  // Queries and Mutations
  const { data: profileResponse, isLoading: isLoadingProfile } = useGetProfileQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [setDefaultAddress, { isLoading: isSettingDefault }] = useSetDefaultAddressMutation();

  const addresses = profileResponse?.data?.addresses || profileResponse?.addresses || [];

  // Local State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress(formData).unwrap();
      toast.success("Address added successfully");
      setIsFormOpen(false);
      setFormData({ name: "", phone: "", addressLine: "", city: "", state: "", pincode: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add address");
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!window.confirm("Are you sure you want to remove this address?")) return;
    try {
      await deleteAddress(index).unwrap(); 
      toast.success("Address removed successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove address");
    }
  };

  const handleMakeDefault = async (index: number) => {
    try {
      await setDefaultAddress(index).unwrap();
      toast.success("Default address updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update default address");
    }
  };

  const isProcessing = isDeleting || isSettingDefault;

  return (
    <motion.div
      key="addresses"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-black" />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
        <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-black flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Address Book
        </h2>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        )}
      </div>

      {/* Add Address Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddAddress}
            className="mb-8 p-6 bg-gray-50 border border-gray-200 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black">New Address Details</h3>
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Full Name" className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Phone Number" className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
              <input type="text" name="addressLine" value={formData.addressLine} onChange={handleInputChange} required placeholder="Address Line" className="w-full border-b border-gray-300 py-3 bg-transparent text-sm sm:col-span-2 focus:outline-none focus:border-black transition-colors" />
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="City" className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} required placeholder="State / Province" className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
              <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required placeholder="Pincode" className="w-full border-b border-gray-300 py-3 bg-transparent text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            
            <Button type="submit" disabled={isAdding} className="w-full sm:w-auto flex items-center justify-center gap-2">
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isAdding ? "Saving..." : "Save Address"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Address List */}
      {isLoadingProfile ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      ) : addresses.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
          <MapPin className="w-8 h-8 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">No addresses saved.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr: any, index: number) => (
            <div key={addr._id || index} className="p-6 border border-gray-100 hover:border-black transition-colors flex flex-col justify-between h-full relative group">
              
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                  Default
                </div>
              )}

              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center justify-between">
                  {addr.name}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  {addr.addressLine}<br />
                  {addr.city}, {addr.state} {addr.pincode}
                </p>
                <p className="text-xs text-gray-500 font-mono tracking-widest">PH: {addr.phone}</p>
              </div>
              
              <div className="mt-8 flex gap-4 text-xs font-bold uppercase tracking-widest">
                {!addr.isDefault && (
                  <button 
                    onClick={() => handleMakeDefault(index)}
                    className="text-gray-400 border-b border-transparent hover:text-black hover:border-black pb-0.5 transition-colors"
                  >
                    Set Default
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteAddress(index)}
                  className="text-red-400 border-b border-transparent hover:text-red-600 hover:border-red-600 pb-0.5 transition-colors ml-auto"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};