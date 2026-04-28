// // src/components/CartSidebar.jsx
// import React, { useState, useEffect, useRef, Fragment, useCallback, useMemo } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Dialog, Transition } from "@headlessui/react";
// import {
//   CheckCircleIcon,
//   XCircleIcon,
//   KeyIcon,
//   CreditCardIcon,
//   TruckIcon,
//   UserIcon,
//   PhoneIcon,
// } from "@heroicons/react/24/outline";

// import { orderAPI, inventoryAPI, sunboxAPI, mpesaAPI } from "../services/apii";
// import { useMpesaPayment, PAYMENT_STATUS } from "../hooks/usempesapayment";
// import { useCart } from "../context/cartcontext";

// // ==================== UTILITY FUNCTIONS ====================

// /**
//  * SAFE NUMBER UTILITY - Prevents NaN and ensures valid numbers throughout the app
//  * @param {any} value - The value to convert to a safe number
//  * @param {number} defaultValue - Fallback value if conversion fails
//  * @returns {number} Safe number
//  */
// const safeNumber = (value, defaultValue = 0) => {
//   if (typeof value === 'number' && !isNaN(value)) return value;
//   const parsed = parseFloat(value);
//   return isNaN(parsed) ? defaultValue : parsed;
// };

// /**
//  * SAFE INTEGER UTILITY - For quantities and counts
//  * @param {any} value - The value to convert to a safe integer
//  * @param {number} defaultValue - Fallback value
//  * @returns {number} Safe integer
//  */
// const safeInteger = (value, defaultValue = 0) => {
//   if (typeof value === 'number' && !isNaN(value) && Number.isInteger(value)) return value;
//   const parsed = parseInt(value, 10);
//   return isNaN(parsed) ? defaultValue : parsed;
// };

// /**
//  * Format currency for Kenyan Shillings
//  */
// const formatKES = (amount) => {
//   const safeAmount = safeNumber(amount);
//   return `KES ${safeAmount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;
// };

// // ==================== CONSTANTS ====================
// const DELIVERY_ZONES = {
//   central: { label: "Central Nairobi", fee: 150, eta: "1–3 hours", color: "#22c55e" },
//   inner: { label: "Inner Nairobi", fee: 250, eta: "2–5 hours", color: "#3b82f6" },
//   outer: { label: "Outer Nairobi", fee: 350, eta: "3–8 hours", color: "#f59e0b" },
//   peri: { label: "Peri-Urban", fee: 0, eta: "Next Day", color: "#ef4444" },
//   outside: { label: "Outside Nairobi", fee: 0, eta: "2–4 days", color: "#6b7280" },
// };

// const FREE_SHIPPING_THRESHOLD = 15000;

// // Nairobi delivery areas
// const nairobiAreas = [
//   { name: "Westlands", zone: "central", neighborhoods: ["Westlands", "Waiyaki Way", "Ring Road"] },
//   { name: "Kilimani", zone: "central", neighborhoods: ["Kilimani", "Wood Avenue", "Lenana Road"] },
//   { name: "Kileleshwa", zone: "central", neighborhoods: ["Kileleshwa", "Muthithi Road"] },
//   { name: "Karen", zone: "inner", neighborhoods: ["Karen", "Hardy", "Lang'ata Road"] },
//   { name: "Lang'ata", zone: "inner", neighborhoods: ["Lang'ata", "Ongata Rongai"] },
//   { name: "Kayole", zone: "outer", neighborhoods: ["Kayole", "Komarock", "Pipeline"] },
//   { name: "Kasarani", zone: "outer", neighborhoods: ["Kasarani", "Mwiki", "Githurai"] },
//   { name: "Embakasi", zone: "outer", neighborhoods: ["Embakasi", "Tena", "Mihang'o"] },
// ];

// const kenyanCities = [
//   "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Naivasha",
//   "Nyeri", "Machakos", "Kitale", "Malindi", "Garissa", "Kakamega",
// ];

// // Build location suggestions
// const buildLocationSuggestions = () => {
//   const suggestions = [];
//   nairobiAreas.forEach((area) => {
//     suggestions.push({ label: area.name, zone: area.zone, isNairobi: true });
//     area.neighborhoods.forEach((hood) => {
//       suggestions.push({ label: hood, zone: area.zone, parent: area.name, isNairobi: true });
//     });
//   });
//   kenyanCities.forEach((city) => {
//     suggestions.push({ label: city, zone: "outside", isNairobi: false });
//   });
//   return suggestions;
// };

// const locationSuggestions = buildLocationSuggestions();

// const resolveLocation = (value) => {
//   if (!value) return null;
//   const input = value.trim().toLowerCase();
//   const match = locationSuggestions.find(
//     (l) => l.label.toLowerCase() === input || l.label.toLowerCase().includes(input)
//   );
//   if (!match) return { zone: "outside", label: value };
//   const zoneInfo = DELIVERY_ZONES[match.zone] || DELIVERY_ZONES.outside;
//   return { ...match, ...zoneInfo };
// };

// const generateOrderNumber = () => {
//   const year = new Date().getFullYear().toString().slice(-2);
//   const random = Math.floor(Math.random() * 99999) + 1;
//   return `GM${year}${random.toString().padStart(5, "0")}`;
// };

// // ==================== MAIN COMPONENT ====================
// const CartSidebar = () => {
//   const {
//     cart,
//     total,
//     itemCount,
//     loading: cartLoading,
//     isCartOpen,
//     closeCart,
//     updateQuantity,
//     removeItem,
//     clearCart,
//   } = useCart();

//   // State management
//   const [checkoutStep, setCheckoutStep] = useState("cart");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [paymentCompleted, setPaymentCompleted] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [showSunboxModal, setShowSunboxModal] = useState(false);
//   const [sunboxPassword, setSunboxPassword] = useState("");
//   const [isVerifyingSunbox, setIsVerifyingSunbox] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);
  
//   // Loading state to prevent double submissions
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);

//   const { paymentState, initiatePayment, cancelPayment, resetPayment } = useMpesaPayment();

//   const [customerDetails, setCustomerDetails] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "Nairobi",
//     area: "",
//     notes: "",
//     mpesaPhone: "",
//   });

//   const contentRef = useRef(null);

//   // ==================== SAFE CALCULATIONS ====================
//   // FIX: Ensures all totals are valid numbers, prevents NaN bugs
//   const resolvedLocation = useMemo(() => resolveLocation(customerDetails.area), [customerDetails.area]);
  
//   const subtotal = useMemo(() => safeNumber(total), [total]);
//   const shippingCost = useMemo(() => {
//     if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
//     return safeNumber(resolvedLocation?.fee, DELIVERY_ZONES.outside.fee);
//   }, [subtotal, resolvedLocation]);
//   const grandTotal = useMemo(() => subtotal + shippingCost, [subtotal, shippingCost]);

//   // Scroll to top on step change
//   useEffect(() => {
//     if (contentRef.current) contentRef.current.scrollTop = 0;
//   }, [checkoutStep]);

//   // Auto-close after order placed
//   useEffect(() => {
//     if (orderPlaced) {
//       const timer = setTimeout(() => {
//         closeCart();
//         setOrderPlaced(false);
//         setCheckoutStep("cart");
//         resetPayment();
//         setPaymentCompleted(false);
//         setIsProcessingPayment(false);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [orderPlaced, closeCart, resetPayment]);

//   if (!isCartOpen) return null;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerDetails((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAreaChange = (value) => {
//     setCustomerDetails((prev) => ({ ...prev, area: value }));
//   };

//   const isFormValid = () => {
//     const { name, email, phone, address, city, area } = customerDetails;
//     return name && email && phone && address && city && area;
//   };

//   // ==================== STOCK DEDUCTION ====================
//   // FIX: Stock is deducted ONLY AFTER payment confirmation
//   // FIX: Added rollback handling and prevents negative stock
//   const deductStock = async (cartItems) => {
//     const results = await Promise.all(
//       cartItems.map(async (item) => {
//         try {
//           const product = await inventoryAPI.getProduct(item.id);
//           const currentStock = safeInteger(product.data.stock);
//           const requestedQty = safeInteger(item.quantity);
          
//           if (currentStock < requestedQty) {
//             throw new Error(`Insufficient stock for ${item.name}. Only ${currentStock} left.`);
//           }
          
//           const newStock = currentStock - requestedQty;
//           await inventoryAPI.updateStock(item.id, newStock);
//           return { success: true, id: item.id, name: item.name };
//         } catch (error) {
//           console.error(`Stock deduction failed for ${item.id}:`, error);
//           return { success: false, id: item.id, error: error.message };
//         }
//       })
//     );

//     const failed = results.filter((r) => !r.success);
//     if (failed.length > 0) {
//       const errorMessages = failed.map(f => f.error).join(', ');
//       throw new Error(`Stock deduction failed: ${errorMessages}`);
//     }
//     return true;
//   };

//   // ==================== ORDER CREATION ====================
//   // FIX: Order created with PENDING status, NOT marked as paid yet
//   const createOrder = async () => {
//     setIsSubmitting(true);
//     try {
//       const orderNumber = generateOrderNumber();
//       const resolvedZone = resolveLocation(customerDetails.area);

//       const orderData = {
//         order_number: orderNumber,
//         customer_name: customerDetails.name,
//         customer_email: customerDetails.email,
//         customer_phone: customerDetails.phone,
//         delivery_address: customerDetails.address,
//         delivery_city: customerDetails.city,
//         delivery_area: customerDetails.area,
//         delivery_zone: resolvedZone?.zone || "outside",
//         special_instructions: customerDetails.notes || "",
//         subtotal: subtotal,
//         shipping_cost: shippingCost,
//         total_amount: grandTotal,
//         payment_method: paymentMethod,
//         payment_status: "pending_payment", // CRITICAL: Not paid yet!
//         order_status: "pending",
//         items_data: cart.map((item) => ({
//           product_id: item.id,
//           product_name: item.name,
//           quantity: safeInteger(item.quantity),
//           price: safeNumber(item.price),
//           total: safeNumber(item.price) * safeInteger(item.quantity),
//           image_url: item.image_url || item.image || "",
//         })),
//       };

//       const response = await orderAPI.createOrder(orderData);
//       const order = response.data;

//       setCurrentOrder({
//         id: order.id,
//         number: orderNumber,
//         total: grandTotal,
//       });

//       return { success: true, orderId: order.id, orderNumber };
//     } catch (error) {
//       console.error("Order creation error:", error);
//       toast.error("Failed to create order. Please try again.");
//       return { success: false, error: error.message };
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ==================== FINALIZE ORDER (After Payment) ====================
//   // FIX: Only called AFTER successful payment confirmation
//   const finalizeOrder = async (receiptNumber) => {
//     setIsProcessingPayment(true);
//     try {
//       // Step 1: Deduct stock
//       await deductStock(cart);
      
//       // Step 2: Clear cart
//       clearCart();
      
//       setPaymentCompleted(true);
//       setOrderPlaced(true);
      
//       // Step 3: Show success message
//       toast.success(
//         `🎉 ORDER CONFIRMED!\n\nOrder: ${currentOrder?.number}\nReceipt: ${receiptNumber}\nTotal: ${formatKES(grandTotal)}`,
//         {
//           icon: "🎉",
//           duration: 8000,
//           style: { background: "#4caf50", color: "#fff", fontWeight: "bold", whiteSpace: "pre-line" },
//         }
//       );
      
//     } catch (error) {
//       console.error("Finalize order error:", error);
//       toast.error(error.message || "Order created but stock update failed. Contact support.", {
//         icon: "⚠️",
//         duration: 8000,
//       });
//     } finally {
//       setIsProcessingPayment(false);
//     }
//   };

//   // ==================== M-PESA PAYMENT HANDLER ====================
//   // FIX: Proper flow - Create order → Initiate payment → On success → Finalize
//   const handleMpesaPayment = async () => {
//     // Prevent double submission
//     if (isProcessingPayment || isSubmitting) {
//       toast.warn("Payment already in progress. Please wait.");
//       return;
//     }

//     const mpesaPhone = customerDetails.mpesaPhone?.trim();
//     if (!mpesaPhone) {
//       toast.error("Please enter your M-PESA phone number");
//       return;
//     }

//     setPaymentMethod("mpesa");
//     setIsProcessingPayment(true);

//     try {
//       // STEP 1: Create order with pending payment status
//       const orderResult = await createOrder();
//       if (!orderResult.success) throw new Error("Failed to create order");

//       // STEP 2: Initiate M-PESA payment
//       toast.loading("Initiating M-PESA payment...", { toastId: "mpesa-init" });

//       const success = await initiatePayment(
//         mpesaPhone,
//         grandTotal,
//         orderResult.orderNumber,
//         orderResult.orderId,
//         orderResult.orderNumber,
//         // Success callback
//         async (receiptNumber, amount) => {
//           toast.dismiss("mpesa-init");
//           toast.success(`✅ Payment confirmed! Receipt: ${receiptNumber}`, { duration: 5000 });
          
//           // STEP 3: Update order status to paid
//           await orderAPI.updatePaymentStatus(orderResult.orderId, "payment_completed", receiptNumber);
//           await orderAPI.updateOrderStatus(orderResult.orderId, "processing");
          
//           // STEP 4: Finalize order (deduct stock, clear cart)
//           await finalizeOrder(receiptNumber);
//           setIsProcessingPayment(false);
//         },
//         // Failure callback
//         (error) => {
//           toast.dismiss("mpesa-init");
//           toast.error(error || "Payment failed. Please try again.");
//           setIsProcessingPayment(false);
//         }
//       );

//       if (success) {
//         toast.dismiss("mpesa-init");
//         toast.success("📱 STK push sent! Check your phone for the M-PESA prompt", { duration: 4000 });
//         toast.loading("Waiting for payment confirmation...\nPlease enter your PIN on your phone", {
//           toastId: "waiting-payment",
//           duration: 120000,
//         });
//       }
//     } catch (error) {
//       console.error("M-PESA payment error:", error);
//       toast.dismiss("mpesa-init");
//       toast.error("Failed to initiate payment. Please try again.");
//       setIsProcessingPayment(false);
//     }
//   };

//   // ==================== SUNBOX PAYMENT HANDLER ====================
//   const handleSunboxPayment = () => {
//     if (isProcessingPayment || isSubmitting) {
//       toast.warn("Payment already in progress. Please wait.");
//       return;
//     }
//     setPaymentMethod("sunbox");
//     setShowSunboxModal(true);
//   };

//   const verifySunboxPayment = async () => {
//     if (!sunboxPassword.trim()) {
//       toast.error("Please enter your Sunbox password");
//       return;
//     }

//     setIsVerifyingSunbox(true);
//     setIsProcessingPayment(true);

//     try {
//       // STEP 1: Create order with pending payment status
//       const orderResult = await createOrder();
//       if (!orderResult.success) throw new Error("Failed to create order");

//       toast.loading("Verifying Sunbox payment...", { toastId: "sunbox-verify" });

//       // STEP 2: Verify Sunbox payment
//       const verification = await sunboxAPI.verifyPayment(
//         sunboxPassword,
//         grandTotal,
//         orderResult.orderNumber
//       );

//       if (verification.success) {
//         toast.dismiss("sunbox-verify");
//         toast.success("✅ Payment verified successfully!", { duration: 3000 });

//         // STEP 3: Update order status to paid
//         await orderAPI.updatePaymentStatus(
//           orderResult.orderId,
//           "payment_completed",
//           verification.receipt_number || `SUNBOX-${Date.now()}`
//         );
//         await orderAPI.updateOrderStatus(orderResult.orderId, "processing");

//         setShowSunboxModal(false);
//         setSunboxPassword("");

//         // STEP 4: Finalize order (deduct stock, clear cart)
//         await finalizeOrder(verification.receipt_number);
//       } else {
//         toast.dismiss("sunbox-verify");
//         toast.error(verification.error || "Invalid password. Please try again.");
//       }
//     } catch (error) {
//       console.error("Sunbox verification error:", error);
//       toast.dismiss("sunbox-verify");
//       toast.error("Payment verification failed. Please try again.");
//     } finally {
//       setIsVerifyingSunbox(false);
//       setIsProcessingPayment(false);
//     }
//   };

//   const handleCancelMpesaPayment = () => {
//     cancelPayment();
//     toast.dismiss("waiting-payment");
//     toast.warn("Payment cancelled. You can try again.");
//     setIsProcessingPayment(false);
//   };

//   const handleCheckout = () => {
//     if (checkoutStep === "cart") {
//       setCheckoutStep("checkout");
//     } else if (checkoutStep === "checkout") {
//       setCheckoutStep("payment");
//     }
//   };

//   const getPaymentStatusMessage = () => {
//     switch (paymentState.status) {
//       case PAYMENT_STATUS.PENDING:
//         return { message: "⏳ Waiting for PIN entry on your phone...", type: "info" };
//       case PAYMENT_STATUS.PROCESSING:
//         return { message: "🔄 Processing payment...", type: "info" };
//       case PAYMENT_STATUS.FAILED:
//         return { message: `❌ ${paymentState.error || "Payment failed"}`, type: "error" };
//       case PAYMENT_STATUS.CANCELLED:
//         return { message: "🚫 Payment cancelled", type: "warning" };
//       case PAYMENT_STATUS.TIMEOUT:
//         return { message: "⏰ Payment timeout. Please try again.", type: "error" };
//       default:
//         return null;
//     }
//   };

//   const statusInfo = getPaymentStatusMessage();
//   const isPaymentLocked = isProcessingPayment || isSubmitting || isVerifyingSunbox;

//   // ==================== MODALS ====================
//   const SunboxModal = () => (
//     <Transition appear show={showSunboxModal} as={Fragment}>
//       <Dialog as="div" className="relative z-[1000003]" onClose={() => !isVerifyingSunbox && setShowSunboxModal(false)}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-50" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
//                 <div className="flex items-center justify-between mb-4">
//                   <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
//                     <KeyIcon className="w-6 h-6 inline mr-2 text-amber-600" />
//                     Sunbox Secure Payment
//                   </Dialog.Title>
//                   {!isVerifyingSunbox && (
//                     <button onClick={() => setShowSunboxModal(false)} className="text-gray-400 hover:text-gray-500">
//                       <XCircleIcon className="w-5 h-5" />
//                     </button>
//                   )}
//                 </div>

//                 <div className="mt-2">
//                   <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg mb-4 border border-amber-200">
//                     <p className="text-sm text-amber-800 mb-2">Amount to pay:</p>
//                     <p className="text-2xl font-bold text-amber-700">{formatKES(grandTotal)}</p>
//                     <p className="text-xs text-amber-600 mt-2">Order will be created after successful payment</p>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Payment Password</label>
//                     <input
//                       type="password"
//                       value={sunboxPassword}
//                       onChange={(e) => setSunboxPassword(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
//                       placeholder="Enter your Sunbox payment password"
//                       disabled={isVerifyingSunbox}
//                       autoFocus
//                       onKeyPress={(e) => e.key === "Enter" && verifySunboxPayment()}
//                     />
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       type="button"
//                       onClick={() => setShowSunboxModal(false)}
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
//                       disabled={isVerifyingSunbox}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={verifySunboxPayment}
//                       disabled={isVerifyingSunbox || !sunboxPassword.trim()}
//                       className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                     >
//                       {isVerifyingSunbox ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
//                           Verifying...
//                         </>
//                       ) : (
//                         "Verify & Pay"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );

//   // ==================== RENDER ====================
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={4000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//         style={{ zIndex: 1000004 }}
//       />

//       <div className="fixed inset-0 z-[1000002] overflow-hidden">
//         <style>{`
//           @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
//           .cart-slide-in { animation: slideIn 0.3s ease-out; }
//           @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
//           .payment-success { animation: bounce 0.5s ease-in-out; }
//           .cart-scrollable-content::-webkit-scrollbar { width: 4px; }
//           .cart-scrollable-content::-webkit-scrollbar-track { background: #f0e7db; border-radius: 10px; }
//           .cart-scrollable-content::-webkit-scrollbar-thumb { background: #b89b7b; border-radius: 10px; }
//         `}</style>

//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
          
//           <div className="fixed inset-y-0 right-0 max-w-full flex">
//             <div className="w-screen max-w-2xl cart-slide-in">
//               <div className="h-full flex flex-col bg-white shadow-2xl">
                
//                 {/* Header */}
//                 <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-[#faf7f2] to-white border-b border-[#f0e7db]">
//                   <div className="flex items-center min-w-0 flex-1">
//                     <button onClick={closeCart} className="mr-3 sm:mr-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f5efe8] border border-[#f0e7db]">
//                       <svg className="w-4 h-4 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                     <div>
//                       <h2 className="font-serif text-xl sm:text-2xl font-light text-[#2c2c2c]">
//                         {checkoutStep === "cart" && "Shopping Cart"}
//                         {checkoutStep === "checkout" && "Delivery Details"}
//                         {checkoutStep === "payment" && "Payment Method"}
//                       </h2>
//                       <p className="text-xs text-[#888] mt-1">
//                         {checkoutStep === "cart" && `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
//                         {checkoutStep === "checkout" && "Enter delivery information"}
//                         {checkoutStep === "payment" && "Choose payment method"}
//                       </p>
//                     </div>
//                   </div>
                  
//                   {/* Step indicator */}
//                   <div className="hidden sm:flex items-center space-x-2">
//                     {["cart", "checkout", "payment"].map((step, i) => {
//                       const steps = ["cart", "checkout", "payment"];
//                       const isActive = steps.indexOf(checkoutStep) >= i;
//                       const isCompleted = steps.indexOf(checkoutStep) > i;
//                       return (
//                         <React.Fragment key={step}>
//                           <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all
//                             ${isActive ? "bg-[#b89b7b] text-white" : "bg-[#f0e7db] text-[#888]"}
//                             ${isCompleted ? "ring-2 ring-[#b89b7b] ring-offset-2" : ""}`}>
//                             {i + 1}
//                           </div>
//                           {i < 2 && (
//                             <div className={`w-6 h-0.5 transition-all ${steps.indexOf(checkoutStep) > i ? "bg-[#b89b7b]" : "bg-[#f0e7db]"}`} />
//                           )}
//                         </React.Fragment>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div ref={contentRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6 bg-[#faf7f2]/30" style={{ maxHeight: "calc(100vh - 180px)" }}>
//                   {cartLoading && (
//                     <div className="flex justify-center py-12">
//                       <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#b89b7b] border-t-transparent" />
//                     </div>
//                   )}

//                   {checkoutStep === "cart" && (
//                     cart.length === 0 ? (
//                       <EmptyCart onClose={closeCart} />
//                     ) : (
//                       <div className="space-y-3 sm:space-y-4">
//                         {cart.map((item) => (
//                           <CartItem
//                             key={item.id}
//                             item={item}
//                             onUpdateQuantity={updateQuantity}
//                             onRemoveItem={removeItem}
//                           />
//                         ))}
//                         <OrderSummary
//                           subtotal={subtotal}
//                           shipping={shippingCost}
//                           total={grandTotal}
//                           zoneLabel={resolvedLocation?.label || "Standard"}
//                           eta={resolvedLocation?.eta}
//                           threshold={FREE_SHIPPING_THRESHOLD}
//                         />
//                         <div className="mt-4">
//                           <label className="block text-sm font-medium text-[#2c2c2c] mb-2">Special Instructions</label>
//                           <textarea
//                             name="notes"
//                             value={customerDetails.notes}
//                             onChange={handleInputChange}
//                             placeholder="Gift note, delivery instructions, etc."
//                             rows="3"
//                             className="w-full px-3 sm:px-4 py-2.5 border border-[#f0e7db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89b7b]/20 focus:border-[#b89b7b] bg-white text-sm"
//                           />
//                         </div>
//                       </div>
//                     )
//                   )}

//                   {checkoutStep === "checkout" && (
//                     <CheckoutForm
//                       customerDetails={customerDetails}
//                       onInputChange={handleInputChange}
//                       onAreaChange={handleAreaChange}
//                       shippingCost={shippingCost}
//                       resolvedZone={resolvedLocation}
//                       locationSuggestions={locationSuggestions}
//                       DELIVERY_ZONES={DELIVERY_ZONES}
//                     />
//                   )}

//                   {checkoutStep === "payment" && (
//                     <PaymentMethodForm
//                       customerDetails={customerDetails}
//                       onInputChange={handleInputChange}
//                       onMpesaPayment={handleMpesaPayment}
//                       onSunboxPayment={handleSunboxPayment}
//                       onCancelMpesaPayment={handleCancelMpesaPayment}
//                       total={grandTotal}
//                       paymentState={paymentState}
//                       isSubmitting={isPaymentLocked}
//                       paymentCompleted={paymentCompleted}
//                       orderPlaced={orderPlaced}
//                       statusInfo={statusInfo}
//                     />
//                   )}
//                 </div>

//                 {/* Footer */}
//                 {cart.length > 0 && !orderPlaced && checkoutStep !== "payment" && (
//                   <div className="flex-shrink-0 border-t border-[#f0e7db] px-4 sm:px-6 py-4 sm:py-5 bg-white">
//                     <div className="flex justify-between items-center mb-4">
//                       <span className="text-sm text-[#6b6b6b]">Total (KES)</span>
//                       <span className="font-serif text-2xl sm:text-3xl font-light text-[#2c2c2c]">{formatKES(grandTotal)}</span>
//                     </div>
//                     <div className="space-y-2">
//                       {checkoutStep !== "cart" && (
//                         <button onClick={() => setCheckoutStep(checkoutStep === "checkout" ? "cart" : "checkout")}
//                           className="w-full text-center text-xs text-[#888] hover:text-[#b89b7b] py-2 flex items-center justify-center">
//                           <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                           </svg>
//                           Back
//                         </button>
//                       )}
//                       <button
//                         onClick={handleCheckout}
//                         disabled={checkoutStep === "checkout" && !isFormValid()}
//                         className={`w-full py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]
//                           ${checkoutStep === "checkout" && !isFormValid()
//                             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                             : checkoutStep === "cart"
//                             ? "bg-[#2c2c2c] text-white hover:bg-[#b89b7b]"
//                             : "bg-[#b89b7b] text-white hover:bg-[#2c2c2c]"
//                           }`}>
//                         {checkoutStep === "cart" && "PROCEED TO DELIVERY"}
//                         {checkoutStep === "checkout" && "CONTINUE TO PAYMENT"}
//                       </button>
//                       {checkoutStep === "cart" && (
//                         <button onClick={() => { if (window.confirm("Clear your cart?")) clearCart(); }}
//                           className="w-full text-center text-xs text-[#888] hover:text-red-500 py-2">
//                           Clear Cart
//                         </button>
//                       )}
//                     </div>
//                     <div className="flex items-center justify-center mt-4 text-[10px] text-[#888]">
//                       <svg className="w-3 h-3 mr-1 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                       </svg>
//                       <span>Secure Checkout · M-PESA & Sunbox Protected</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Order placed success screen */}
//                 {orderPlaced && (
//                   <div className="flex-shrink-0 border-t border-[#f0e7db] px-4 sm:px-6 py-6 sm:py-8 bg-gradient-to-r from-green-50 to-emerald-50">
//                     <div className="text-center">
//                       <div className="text-5xl mb-3 animate-bounce">🎉</div>
//                       <h3 className="font-bold text-xl text-green-700 mb-2">Order Placed Successfully!</h3>
//                       <p className="text-sm text-green-600 mb-1">Order #{currentOrder?.number}</p>
//                       <p className="text-xs text-green-600 mb-1">
//                         {paymentMethod === "sunbox" ? "Sunbox" : "M-PESA"} Receipt: {paymentState.receiptNumber || "N/A"}
//                       </p>
//                       <p className="text-xs text-green-600">Confirmation sent to {customerDetails.email}</p>
//                       <p className="text-xs text-green-600 mt-2">Redirecting to products page...</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <SunboxModal />
//     </>
//   );
// };

// // ==================== SUB-COMPONENTS ====================

// const EmptyCart = ({ onClose }) => (
//   <div className="text-center py-12 sm:py-16 px-4">
//     <div className="text-6xl mb-4 animate-bounce opacity-50">🛒</div>
//     <h3 className="font-serif text-xl font-light text-[#2c2c2c] mb-2">Your cart is empty</h3>
//     <p className="text-[#888] mb-6 text-sm">Looks like you haven't added anything yet.</p>
//     <button onClick={onClose} className="px-6 py-2.5 bg-[#2c2c2c] text-white rounded-lg hover:bg-[#b89b7b] text-sm font-medium transition">
//       Continue Shopping
//     </button>
//   </div>
// );

// const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
//   // FIX: Safe number conversion prevents NaN errors
//   const price = safeNumber(item.price);
//   const quantity = safeInteger(item.quantity, 1);
//   const itemTotal = price * quantity;
//   const imageUrl = item.image_url || item.image;

//   return (
//     <div className="flex items-center space-x-3 sm:space-x-4 py-4 border-b border-[#f0e7db] last:border-0 bg-white px-3 sm:px-4 rounded-xl shadow-sm">
//       <div className="w-16 h-16 bg-gradient-to-br from-[#faf7f2] to-[#f5efe8] rounded-xl flex items-center justify-center overflow-hidden border border-[#f0e7db] flex-shrink-0">
//         {imageUrl ? <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-2xl">📦</span>}
//       </div>
//       <div className="flex-1 min-w-0">
//         <h3 className="text-sm font-medium text-[#2c2c2c] line-clamp-1">{item.name}</h3>
//         <p className="text-[10px] text-[#888] mb-1">{item.brand || "Product"}</p>
//         <p className="text-xs font-medium text-[#b89b7b]">{formatKES(price)}</p>
//       </div>
//       <div className="flex items-center space-x-1">
//         <button onClick={() => onUpdateQuantity(item.id, quantity - 1)} className="w-7 h-7 border border-[#f0e7db] rounded-lg flex items-center justify-center hover:bg-[#faf7f2]">−</button>
//         <span className="w-6 text-center text-sm font-medium">{quantity}</span>
//         <button onClick={() => onUpdateQuantity(item.id, quantity + 1)} className="w-7 h-7 border border-[#f0e7db] rounded-lg flex items-center justify-center hover:bg-[#faf7f2]">+</button>
//       </div>
//       <div className="text-right min-w-[70px]">
//         <p className="text-sm font-medium">{formatKES(itemTotal)}</p>
//       </div>
//       <button onClick={() => onRemoveItem(item.id)} className="text-[#aaa] hover:text-red-500 transition">
//         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//         </svg>
//       </button>
//     </div>
//   );
// };

// const OrderSummary = ({ subtotal, shipping, total, zoneLabel, eta, threshold }) => {
//   const safeSubtotal = safeNumber(subtotal);
//   const safeShipping = safeNumber(shipping);
//   const safeTotal = safeNumber(total);
//   const safeThreshold = safeNumber(threshold, 15000);
//   const isFreeShipping = safeSubtotal >= safeThreshold;

//   return (
//     <div className="bg-white rounded-xl p-4 space-y-2 border border-[#f0e7db] shadow-sm">
//       <h3 className="font-serif text-base font-light mb-3">Order Summary</h3>
//       <div className="flex justify-between text-sm">
//         <span className="text-[#6b6b6b]">Subtotal</span>
//         <span className="font-medium">{formatKES(safeSubtotal)}</span>
//       </div>
//       <div className="flex justify-between text-sm">
//         <span className="text-[#6b6b6b]">Shipping {zoneLabel && `(${zoneLabel}${eta ? ` · ${eta}` : ""})`}</span>
//         {isFreeShipping ? <span className="text-green-600 font-medium">FREE</span> : <span>{formatKES(safeShipping)}</span>}
//       </div>
//       {isFreeShipping && (
//         <div className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
//           🎉 Free shipping on orders over {formatKES(safeThreshold)}!
//         </div>
//       )}
//       <div className="flex justify-between text-base font-medium pt-2 border-t border-[#f0e7db] mt-2">
//         <span>Total</span>
//         <span className="font-serif text-xl">{formatKES(safeTotal)}</span>
//       </div>
//     </div>
//   );
// };

// const CheckoutForm = ({ customerDetails, onInputChange, onAreaChange, shippingCost, resolvedZone, locationSuggestions, DELIVERY_ZONES }) => {
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const handleAreaInput = (value) => {
//     onAreaChange(value);
//     if (value.length > 1) {
//       const filtered = locationSuggestions.filter((l) => l.label.toLowerCase().includes(value.toLowerCase())).slice(0, 6);
//       setSuggestions(filtered);
//       setShowSuggestions(true);
//     } else {
//       setSuggestions([]);
//       setShowSuggestions(false);
//     }
//   };

//   const selectSuggestion = (loc) => {
//     onAreaChange(loc.label);
//     setSuggestions([]);
//     setShowSuggestions(false);
//   };

//   const zoneColor = resolvedZone?.color || DELIVERY_ZONES.outside.color;
//   const safeShipping = safeNumber(shippingCost);

//   return (
//     <div className="space-y-4">
//       <div className="bg-white rounded-xl p-5 border border-[#f0e7db] shadow-sm">
//         <h3 className="font-serif text-lg font-light mb-4 flex items-center"><UserIcon className="w-5 h-5 mr-2 text-[#b89b7b]" />Contact Information</h3>
//         <div className="space-y-3">
//           <div><label className="block text-xs text-[#888] mb-1">Full Name *</label><input type="text" name="name" value={customerDetails.name} onChange={onInputChange} className="w-full px-4 py-2.5 border border-[#f0e7db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89b7b]/20 focus:border-[#b89b7b] text-sm" placeholder="John Doe" required /></div>
//           <div><label className="block text-xs text-[#888] mb-1">Email *</label><input type="email" name="email" value={customerDetails.email} onChange={onInputChange} className="w-full px-4 py-2.5 border border-[#f0e7db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89b7b]/20 focus:border-[#b89b7b] text-sm" placeholder="john@example.com" required /></div>
//           <div><label className="block text-xs text-[#888] mb-1">Phone Number *</label><input type="tel" name="phone" value={customerDetails.phone} onChange={onInputChange} className="w-full px-4 py-2.5 border border-[#f0e7db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89b7b]/20 focus:border-[#b89b7b] text-sm" placeholder="0712345678" required /></div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl p-5 border border-[#f0e7db] shadow-sm">
//         <h3 className="font-serif text-lg font-light mb-4 flex items-center"><TruckIcon className="w-5 h-5 mr-2 text-[#b89b7b]" />Delivery Address</h3>
//         <div className="space-y-3">
//           <div className="relative">
//             <label className="block text-xs text-[#888] mb-1">Area / Location *</label>
//             <input type="text" name="area" value={customerDetails.area} onChange={(e) => handleAreaInput(e.target.value)} onFocus={() => customerDetails.area.length > 1 && setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} className="w-full px-4 py-2.5 border border-[#f0e7db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89b7b]/20 focus:border-[#b89b7b] text-sm" placeholder="e.g., Westlands, Karen, Kilimani..." required />
//             {showSuggestions && suggestions.length > 0 && (
//               <div className="absolute z-20 w-full mt-1 bg-white border border-[#f0e7db] rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                 {suggestions.map((loc, i) => {
//                   const zoneInfo = DELIVERY_ZONES[loc.zone];
//                   return <div key={i} onMouseDown={() => selectSuggestion(loc)} className="px-4 py-2 hover:bg-[#faf7f2] cursor-pointer text-sm flex items-center justify-between"><span>{loc.label}</span><span className="text-xs text-[#888]">{zoneInfo?.fee === 0 ? "FREE" : formatKES(zoneInfo?.fee)}</span></div>;
//                 })}
//               </div>
//             )}
//           </div>
//           <div><label className="block text-xs text-[#888] mb-1">Street / Building / Estate *</label><input type="text" name="address" value={customerDetails.address} onChange={onInputChange} className="w-full px-4 py-2.5 border border-[#f0e7db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89b7b]/20 focus:border-[#b89b7b] text-sm" placeholder="Moi Avenue, Icon House, etc." required /></div>
//           <div><label className="block text-xs text-[#888] mb-1">City / Town *</label><input type="text" name="city" value={customerDetails.city} onChange={onInputChange} className="w-full px-4 py-2.5 border border-[#f0e7db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b89b7b]/20 focus:border-[#b89b7b] text-sm" placeholder="Nairobi" required /></div>
//         </div>

//         {resolvedZone && (
//           <div className="mt-4 p-3 rounded-lg" style={{ background: zoneColor + "10", borderLeft: `3px solid ${zoneColor}` }}>
//             <p className="text-sm font-medium" style={{ color: zoneColor }}>{resolvedZone.label} Delivery</p>
//             <p className="text-xs text-[#888] mt-1">ETA: {resolvedZone.eta} • Delivery Fee: {safeShipping === 0 ? "FREE" : formatKES(safeShipping)}</p>
//           </div>
//         )}
//       </div>

//       <div className="bg-[#faf7f2] rounded-xl p-4 border border-[#f0e7db]">
//         <h4 className="text-sm font-medium mb-2">🚚 Delivery Information</h4>
//         <ul className="text-xs text-[#888] space-y-1">
//           <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>CBD & Central: KES 150 (1–3 hrs)</li>
//           <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Inner Nairobi: KES 250 (2–5 hrs)</li>
//           <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Outer Nairobi: KES 350 (3–8 hrs)</li>
//           <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>Outside Nairobi: KES 500 (2–4 days)</li>
//           <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#b89b7b] rounded-full mr-2"></span>Free shipping on orders over KES 15,000</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// const PaymentMethodForm = ({ customerDetails, onInputChange, onMpesaPayment, onSunboxPayment, onCancelMpesaPayment, total, paymentState, isSubmitting, paymentCompleted, orderPlaced, statusInfo }) => {
//   const safeTotal = safeNumber(total);
//   const isProcessingMpesa = paymentState?.status === PAYMENT_STATUS.PENDING || paymentState?.status === PAYMENT_STATUS.PROCESSING || paymentState?.status === PAYMENT_STATUS.INITIATING;

//   if (orderPlaced) {
//     return (
//       <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center payment-success">
//         <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-3" />
//         <p className="text-green-700 font-bold text-lg">ORDER PLACED!</p>
//         <p className="text-green-600 text-sm mt-1">Thank you for your purchase</p>
//       </div>
//     );
//   }

//   if (paymentCompleted) {
//     return (
//       <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center payment-success">
//         <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-3" />
//         <p className="text-green-700 font-bold text-lg">PAYMENT CONFIRMED!</p>
//         {paymentState?.receiptNumber && <p className="text-sm text-green-600 mt-1">Receipt: {paymentState.receiptNumber}</p>}
//         <p className="text-sm text-green-600 mt-2">Completing your order...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="bg-white rounded-xl p-5 border border-[#f0e7db] shadow-sm">
//         <h3 className="font-serif text-lg font-light mb-4 flex items-center"><CreditCardIcon className="w-5 h-5 mr-2 text-[#b89b7b]" />Select Payment Method</h3>

//         <button onClick={onSunboxPayment} disabled={isSubmitting || isProcessingMpesa} className="w-full mb-4 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
//           <KeyIcon className="w-5 h-5" /><span>Pay with Sunbox (Password)</span>
//         </button>

//         <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-gray-500">OR</span></div></div>

//         <div className="space-y-3">
//           <div className="flex items-center mb-2"><div className="w-8 h-8 mr-3 bg-green-600 rounded-full flex items-center justify-center"><span className="text-white text-sm font-bold">M</span></div><h4 className="font-medium text-gray-700">M-PESA Payment</h4></div>

//           <div className="bg-[#faf7f2] p-4 rounded-lg border border-[#f0e7db]"><p className="text-sm text-[#2c2c2c] mb-2">Amount to Pay:</p><p className="font-serif text-3xl font-light text-[#b89b7b]">{formatKES(safeTotal)}</p></div>

//           {statusInfo && (
//             <div className={`p-3 rounded-lg text-sm ${statusInfo.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : statusInfo.type === "warning" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
//               <div className="flex items-center justify-between"><span>{statusInfo.message}</span>{isProcessingMpesa && <button onClick={onCancelMpesaPayment} className="text-xs text-red-600 hover:text-red-800 underline">Cancel</button>}</div>
//               {paymentState?.attemptCount > 0 && <p className="text-xs mt-1 opacity-75">Checking status... ({paymentState.attemptCount}/40)</p>}
//             </div>
//           )}

//           <div><label className="block text-xs text-[#888] mb-1">M-PESA Phone Number *</label><div className="flex items-center"><span className="inline-flex items-center px-3 py-3 bg-[#faf7f2] border border-r-0 border-[#f0e7db] rounded-l-lg text-sm text-[#888]">+254</span><input type="tel" name="mpesaPhone" value={customerDetails.mpesaPhone} onChange={onInputChange} disabled={paymentCompleted || isProcessingMpesa || isSubmitting} className="flex-1 px-4 py-3 border border-[#f0e7db] rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#b89b7b]/20 focus:border-[#b89b7b] text-sm disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder="712345678" /></div><p className="text-xs text-[#888] mt-1">Enter Safaricom number to receive STK push</p></div>

//           {!isProcessingMpesa ? (
//             <button onClick={onMpesaPayment} disabled={!customerDetails.mpesaPhone || isSubmitting} className="w-full py-4 bg-[#2c2c2c] text-white rounded-xl text-sm font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
//               <PhoneIcon className="w-5 h-5" />PAY WITH M-PESA
//             </button>
//           ) : (
//             <button onClick={onCancelMpesaPayment} className="w-full py-4 bg-red-600 text-white rounded-xl text-sm font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
//               <XCircleIcon className="w-5 h-5" />CANCEL PAYMENT
//             </button>
//           )}

//           <div className="bg-blue-50 rounded-lg p-3 mt-3"><p className="text-xs text-blue-700 flex items-start"><svg className="w-4 h-4 mr-1 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>You'll receive an STK prompt on your phone. Enter your M-PESA PIN to complete payment.</p></div>
//         </div>
//       </div>

//       <div className="bg-[#faf7f2] rounded-xl p-5 border border-[#f0e7db]"><h3 className="font-serif text-lg font-light mb-4">Order Summary</h3><div className="flex justify-between"><span className="text-sm text-[#6b6b6b]">Total to pay</span><span className="font-serif text-xl text-[#b89b7b]">{formatKES(safeTotal)}</span></div></div>
//     </div>
//   );
// };

// export default CartSidebar;


// components/CartSidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/cartcontext";
import { getProducts, getCategories, createOrder, checkStock } from "../api";
import CartView from "./cartview";
import CheckoutView from "./checkoutview";
import PaymentView from "./paymentview";
import SuccessView from "./successview";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CartSidebar = () => {
  const { isCartOpen, closeCart, cart, itemCount } = useCart();
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [orderData, setOrderData] = useState(null);
  const sidebarRef = useRef();

  // Reset step when cart closes
  useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => setCheckoutStep("cart"), 300);
    }
  }, [isCartOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isCartOpen) closeCart();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const handleProceedToCheckout = () => setCheckoutStep("checkout");
  const handleBackToCart = () => setCheckoutStep("cart");
  const handleProceedToPayment = () => setCheckoutStep("payment");
  const handleBackToCheckout = () => setCheckoutStep("checkout");
  const handleOrderComplete = (data) => {
    setOrderData(data);
    setCheckoutStep("success");
  };
  const handleCloseSuccess = () => {
    closeCart();
    setTimeout(() => {
      setCheckoutStep("cart");
      setOrderData(null);
    }, 300);
  };

  // Step progress configuration
  const steps = [
    { id: "cart", label: "Cart", icon: "🛒" },
    { id: "checkout", label: "Details", icon: "📝" },
    { id: "payment", label: "Payment", icon: "💳" },
    { id: "success", label: "Complete", icon: "✅" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === checkoutStep);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/10 backdrop-blur-md z-[1000]"
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[1001] flex flex-col"
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
          >
            {/* Header with progress */}
           <div className="flex-shrink-0 border-b border-[#f0e7db] bg-white/95 backdrop-blur-sm sticky top-0 z-10">
  <div className="px-6 py-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-[#2c2c2c] tracking-tight">
        {checkoutStep === "cart" && `Your Cart ${itemCount > 0 ? `(${itemCount})` : ""}`}
        {checkoutStep === "checkout" && "Delivery Details"}
        {checkoutStep === "payment" && "Select Payment"}
        {checkoutStep === "success" && "Order Confirmed"}
      </h2>

      <button
        onClick={closeCart}
        className="p-2 rounded-full hover:bg-[#faf7f2] transition-colors"
      >
        <XMarkIcon className="w-5 h-5 text-[#6b6b6b]" />
      </button>
    </div>

    {/* Progress Steps */}
    {checkoutStep !== "success" && (
      <div className="flex items-center justify-between">
        {steps.slice(0, 3).map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${
                    currentStepIndex >= idx
                      ? "bg-[#b89b7b] text-white shadow-md"
                      : "bg-[#f5ede0] text-[#b89b7b]"
                  }
                `}
              >
                {currentStepIndex > idx ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>

              <span
                className={`text-xs mt-1 font-medium ${
                  currentStepIndex >= idx ? "text-[#2c2c2c]" : "text-[#6b6b6b]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < 2 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded-full transition-all
                  ${
                    currentStepIndex > idx
                      ? "bg-[#b89b7b]"
                      : "bg-[#f0e7db]"
                  }
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    )}
  </div>
</div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {checkoutStep === "cart" && (
                <CartView onProceed={handleProceedToCheckout} />
              )}
              {checkoutStep === "checkout" && (
                <CheckoutView
                  onBack={handleBackToCart}
                  onProceed={handleProceedToPayment}
                />
              )}
              {checkoutStep === "payment" && (
                <PaymentView
                  onBack={handleBackToCheckout}
                  onComplete={handleOrderComplete}
                />
              )}
              {checkoutStep === "success" && (
                <SuccessView orderData={orderData} onClose={handleCloseSuccess} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;