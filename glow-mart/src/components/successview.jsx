// components/SuccessView.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, DocumentTextIcon, TruckIcon } from "@heroicons/react/24/outline";

const SuccessView = ({ orderData, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full py-12 px-6 text-center"
    >
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed! 🎉</h2>
      <p className="text-gray-500 mb-6">Thank you for shopping with us</p>

      <div className="bg-gray-50 rounded-xl p-5 w-full max-w-sm mb-6">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
          <span className="text-gray-500 text-sm">Order Number</span>
          <span className="font-mono font-semibold text-gray-800">{orderData?.orderNumber}</span>
        </div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
          <span className="text-gray-500 text-sm">Payment Method</span>
          <span className="font-medium text-gray-800">{orderData?.paymentMethod}</span>
        </div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
          <span className="text-gray-500 text-sm">Receipt Number</span>
          <span className="font-mono text-sm text-gray-800">{orderData?.receiptNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Total Paid</span>
          <span className="text-xl font-bold text-emerald-600">KES {orderData?.total?.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-4 w-full max-w-sm mb-6">
        <div className="flex items-center gap-3">
          <TruckIcon className="w-5 h-5 text-emerald-600" />
          <div className="text-left">
            <p className="text-sm font-medium text-emerald-800">Delivery Update</p>
            <p className="text-xs text-emerald-600">You'll receive a confirmation email shortly</p>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
      >
        Continue Shopping
      </button>
    </motion.div>
  );
};

export default SuccessView;