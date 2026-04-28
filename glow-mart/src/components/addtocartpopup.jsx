// components/AddToCartPopup.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

const AddToCartPopup = ({ isVisible, product, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && product && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[1100] w-full max-w-sm"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">Added to Cart</p>
                <p className="text-xs text-gray-500 truncate">{product.name}</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ShoppingBagIcon className="w-4 h-4" />
                <span className="text-xs font-medium">View Cart</span>
              </div>
            </div>
            <div className="h-1 bg-emerald-600 animate-progress origin-left"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartPopup;