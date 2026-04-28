import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../context/cartcontext";
import { initiateMpesaPayment } from "../services/mpesaservies";
import {
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const PAYMENT_STATUS = {
  IDLE: "idle",
  INITIATING: "initiating",
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

const PaymentView = ({ onBack, onComplete }) => {
  const { clearCart, cartTotal, cart } = useCart();

  const [mpesaPhone, setMpesaPhone] = useState("");
  const [sunboxPassword, setSunboxPassword] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.IDLE);
  const [checkoutId, setCheckoutId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("mpesa");

  const socketRef = useRef(null);

  // Get checkout data from multiple possible sources
  const getCheckoutData = () => {
    const sessionData = sessionStorage.getItem("checkoutData");
    if (sessionData) {
      try {
        return JSON.parse(sessionData);
      } catch (e) {
        console.error("Failed to parse checkoutData:", e);
      }
    }
    
    const localData = localStorage.getItem("checkoutData");
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        console.error("Failed to parse checkoutData from localStorage:", e);
      }
    }
    
    return {
      customerName: "Guest",
      customerEmail: "guest@example.com",
      customerPhone: "",
      address: "No address provided",
      city: "Nairobi",
      total: 0,
    };
  };

  const checkoutData = getCheckoutData();
  const total = checkoutData.total || cartTotal || 0;
  const customerPhone = checkoutData.customerPhone || mpesaPhone;

  useEffect(() => {
    console.log("📦 Checkout Data:", checkoutData);
    console.log("💰 Total:", total);
    console.log("📞 Customer Phone:", customerPhone);
    console.log("🛒 Cart Items:", cart);
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log(" Cleaning up WebSocket connection");
        socketRef.current.close();
      }
    };
  }, []);

// PaymentView.jsx - Fixed createOrderAfterPayment function
const createOrderAfterPayment = async (receiptNumber, transactionId) => {
  // Get cart items from localStorage (not sessionStorage)
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Get checkout data
  const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
  
  console.log('📦 Cart items:', cartItems);
  console.log('📦 Checkout data:', checkoutData);
  
  // Validate cart has items
  if (!cartItems || cartItems.length === 0) {
    console.error('❌ Cart is empty!');
    toast.error('Your cart is empty. Cannot place order.');
    return null;
  }
  
  // Format items_data exactly like the test
  const items_data = cartItems.map(item => ({
    product_name: item.name || item.product_name || 'Product',
    quantity: item.quantity || 1,
    price: parseFloat(item.price) || 0,
    // Optional fields that your backend accepts
    product_sku: item.sku || '',
    image_url: item.image || '',
  }));
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total_amount = subtotal; // Add shipping if needed
  
  // Prepare order data - MATCH THE TEST STRUCTURE EXACTLY
  const orderData = {
    // Customer info - use same field names as test
    customer_name: checkoutData.customerName || checkoutData.fullName || 'Guest',
    customer_email: checkoutData.customerEmail || checkoutData.email || 'guest@example.com',
    customer_phone: checkoutData.customerPhone || checkoutData.phone || mpesaPhone || '0712345678',
    
    // Delivery info
    delivery_address: checkoutData.address || 'No address provided',
    delivery_city: checkoutData.city || 'Nairobi',
    delivery_area: checkoutData.area || '',
    special_instructions: checkoutData.notes || '',
    
    // Amounts
    subtotal: subtotal,
    shipping_cost: 0,
    total_amount: total_amount,
    
    // Payment info
    payment_method: 'mpesa',
    payment_status: 'payment_completed',
    order_status: 'pending',
    
    // M-PESA info
    mpesa_receipt_number: receiptNumber,
    mpesa_transaction_id: transactionId,
    mpesa_checkout_id: checkoutId,
    
    // Items data - CRITICAL: Must match test structure
    items_data: items_data
  };
  
  console.log('📤 Sending order data:', JSON.stringify(orderData, null, 2));
  
  try {
    const response = await fetch('http://localhost:8000/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order created successfully:', result);
      console.log('📋 Order number:', result.order_number);
      console.log('📋 Items in order:', result.items);
      
      // Clear cart after successful order
      clearCart();
      
      // Clear checkout data
      sessionStorage.removeItem('checkoutData');
      localStorage.removeItem('checkoutData');
      
      toast.success(`Order ${result.order_number} created!`);
      return result;
    } else {
      console.error('❌ Order creation failed:', result);
      // Display specific error messages
      const errorMsg = result.error || Object.values(result).flat().join(', ');
      toast.error(errorMsg || 'Failed to create order');
      return null;
    }
  } catch (error) {
    console.error('❌ Order creation error:', error);
    toast.error('Failed to create order. Please contact support.');
    return null;
  }
};

  const connectWebSocket = (checkoutId) => {
    const isProduction = window.location.hostname !== 'localhost';
    const wsProtocol = isProduction ? 'wss://' : 'ws://';
    const baseUrl = isProduction 
      ? 'hypermodest-irena-washy.ngrok-free.dev' 
      : 'localhost:8000';
    
    const wsUrl = `${wsProtocol}${baseUrl}/ws/mpesa/${checkoutId}/`;
    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected successfully");
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Payment update received:", data);

        if (data.status === "connected") {
          console.log("💓 WebSocket confirmed:", data.message);
          return;
        }

        if (data.status === "completed") {
          console.log("✅ Payment completed successfully");
          setPaymentStatus(PAYMENT_STATUS.COMPLETED);
          
          toast.success(`Payment successful! Receipt: ${data.receipt}`);
          
          await createOrderAfterPayment(data.receipt, data.transaction_id);
          
          setTimeout(() => {
            clearCart();
            sessionStorage.removeItem("checkoutData");
            localStorage.removeItem("checkoutData");
            
            onComplete({
              orderNumber: `GM${Date.now()}`,
              total,
              receiptNumber: data.receipt,
              paymentMethod: "M-PESA",
              transactionId: data.transaction_id,
            });
          }, 1500);

        } else if (data.status === "failed") {
          console.error("❌ Payment failed:", data);
          setPaymentStatus(PAYMENT_STATUS.FAILED);
          toast.error(data.message || "Payment failed. Please try again.");

        } else if (data.status === "cancelled") {
          console.log("⚠️ Payment cancelled by user");
          setPaymentStatus(PAYMENT_STATUS.FAILED);
          toast.error("Payment cancelled");

        } else if (data.status === "timeout") {
          console.error("⏰ Payment timeout");
          setPaymentStatus(PAYMENT_STATUS.FAILED);
          toast.error("Payment timeout. Please try again.");

        } else {
          console.log("🔄 Payment processing:", data.status);
          setPaymentStatus(PAYMENT_STATUS.PROCESSING);
        }
        
      } catch (error) {
        console.error("❌ Failed to parse WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      toast.error("Connection error. Please check your network.");
    };

    socket.onclose = (event) => {
      console.log(`🔌 WebSocket disconnected - Code: ${event.code}`);
      if (paymentStatus === PAYMENT_STATUS.PENDING) {
        toast.error("Connection lost. Please check payment status in orders.");
      }
    };
  };

  const handleMpesaPayment = async () => {
    const phoneToUse = mpesaPhone || checkoutData.customerPhone || checkoutData.phone;
    
    if (!phoneToUse || phoneToUse.trim() === "") {
      toast.error("Please enter your M-PESA phone number");
      return;
    }

    setPaymentStatus(PAYMENT_STATUS.INITIATING);

    const result = await initiateMpesaPayment(
      phoneToUse,
      total,
      `ORDER-${Date.now()}`
    );

    if (result.success) {
      setCheckoutId(result.checkoutRequestId);
      setPaymentStatus(PAYMENT_STATUS.PENDING);
      connectWebSocket(result.checkoutRequestId);
      toast.success("STK push sent. Check your phone.");
    } else {
      setPaymentStatus(PAYMENT_STATUS.FAILED);
      toast.error(result.error || "Failed to initiate payment");
    }
  };

  const handleSunboxPayment = () => {
    if (!sunboxPassword.trim()) {
      toast.error("Enter password");
      return;
    }

    setPaymentStatus(PAYMENT_STATUS.PROCESSING);

    setTimeout(() => {
      if (sunboxPassword === "1234") {
        setPaymentStatus(PAYMENT_STATUS.COMPLETED);
        
        createOrderAfterPayment(`SUNBOX-${Date.now()}`, `SUNBOX-${Date.now()}`);

        setTimeout(() => {
          clearCart();
          sessionStorage.removeItem("checkoutData");
          localStorage.removeItem("checkoutData");
          
          onComplete({
            orderNumber: `GM${Date.now()}`,
            total,
            receiptNumber: `SUNBOX-${Date.now()}`,
            paymentMethod: "Sunbox",
          });
        }, 1500);
      } else {
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        toast.error("Invalid password");
      }
    }, 1500);
  };

  // Payment Success Screen
  if (paymentStatus === PAYMENT_STATUS.COMPLETED) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center bg-gradient-to-br from-[#fefaf5] to-white">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#b89b7b] to-[#9b7a5a] flex items-center justify-center mb-6 animate-bounce">
          <CheckCircleIcon className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-light text-[#2c2c2c] mb-3">Payment Successful</h3>
        <p className="text-[#6b6b6b] mb-2">Your order has been placed successfully!</p>
        <p className="text-sm text-[#b89b7b] font-medium">✨ Check your email for order confirmation</p>
        
        <div className="mt-8 w-full max-w-sm">
          <div className="bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-2xl border border-[#f0e7db] p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6b6b6b]">Order Total</span>
              <span className="text-xl font-semibold text-[#2c2c2c]">KES {total.toLocaleString()}</span>
            </div>
            <div className="text-xs text-[#9b7a5a] text-center mt-3">
              Processing your order now...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#fefaf5] to-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#f0e7db]">
        <h2 className="text-xl font-light text-[#2c2c2c]">Complete Payment</h2>
        <p className="text-sm text-[#6b6b6b] mt-1">Choose your preferred payment method</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl border border-[#f0e7db] p-5 shadow-sm">
          <h4 className="font-light text-[#2c2c2c] mb-4 text-base flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-[#b89b7b]" />
            Order Summary
          </h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[#6b6b6b]">Customer</span>
              <span className="font-medium text-[#2c2c2c]">{checkoutData.fullName || checkoutData.customerName || 'Guest'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6b6b6b]">Email</span>
              <span className="text-[#2c2c2c]">{checkoutData.email || checkoutData.customerEmail || 'guest@example.com'}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-[#6b6b6b]">Delivery</span>
              <span className="text-[#2c2c2c] text-right max-w-[200px]">{checkoutData.address || 'No address'}, {checkoutData.city || 'Nairobi'}</span>
            </div>
            <div className="border-t border-[#f0e7db] pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-light text-[#2c2c2c]">Amount to Pay</span>
                <span className="text-xl font-semibold text-[#2c2c2c]">
                  KES {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[#2c2c2c] uppercase tracking-wide mb-3">
            Select Payment Method
          </h4>

          {/* M-PESA Payment Card */}
          <div 
            onClick={() => setSelectedMethod('mpesa')}
            className={`
              bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all shadow-sm
              ${selectedMethod === 'mpesa' 
                ? 'border-[#b89b7b] bg-gradient-to-br from-[#fefaf5] to-white' 
                : 'border-[#f0e7db] hover:border-[#b89b7b]/40'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                ${selectedMethod === 'mpesa' 
                  ? 'bg-gradient-to-br from-[#b89b7b] to-[#9b7a5a]' 
                  : 'bg-gradient-to-br from-[#faf7f2] to-[#f5ede0]'
                }
              `}>
                <DevicePhoneMobileIcon className={`w-6 h-6 ${selectedMethod === 'mpesa' ? 'text-white' : 'text-[#b89b7b]'}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-[#2c2c2c]">M-PESA</h5>
                  {selectedMethod === 'mpesa' && (
                    <CheckCircleIcon className="w-5 h-5 text-[#b89b7b]" />
                  )}
                </div>
                <p className="text-xs text-[#6b6b6b] mb-4">
                  Pay securely using your M-PESA mobile wallet
                </p>

                {selectedMethod === 'mpesa' && (
                  <div className="space-y-3 mt-4">
                    {paymentStatus === PAYMENT_STATUS.IDLE && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wide">
                            M-PESA Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="0712 345 678"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-[#f0e7db] rounded-xl focus:border-[#b89b7b] focus:outline-none transition bg-[#fefaf5]"
                          />
                        </div>
                        <button
                          onClick={handleMpesaPayment}
                          className="w-full py-3.5 bg-gradient-to-r from-[#2c2c2c] to-[#3a3a3a] text-white rounded-xl font-semibold hover:from-[#b89b7b] hover:to-[#9b7a5a] transition-all shadow-lg hover:shadow-xl transform active:scale-98"
                        >
                          Pay KES {total.toLocaleString()}
                        </button>
                      </>
                    )}

                    {paymentStatus === PAYMENT_STATUS.INITIATING && (
                      <div className="text-center py-4">
                        <div className="inline-block w-8 h-8 border-3 border-[#b89b7b] border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-[#b89b7b] font-medium">Initiating payment...</p>
                      </div>
                    )}

                    {paymentStatus === PAYMENT_STATUS.PENDING && (
                      <div className="text-center py-4 bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-xl border border-[#f0e7db] px-4">
                        <div className="inline-block w-8 h-8 border-3 border-[#b89b7b] border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-[#b89b7b] font-semibold mb-2">Waiting for confirmation...</p>
                        <p className="text-xs text-[#6b6b6b]">
                          Please check your phone and enter your M-PESA PIN
                        </p>
                      </div>
                    )}

                    {paymentStatus === PAYMENT_STATUS.PROCESSING && (
                      <div className="text-center py-4 bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-xl border border-[#f0e7db] px-4">
                        <div className="inline-block w-8 h-8 border-3 border-[#b89b7b] border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-[#b89b7b] font-semibold">Processing payment...</p>
                      </div>
                    )}

                    {paymentStatus === PAYMENT_STATUS.FAILED && (
                      <div className="text-center py-4 bg-red-50 rounded-xl border border-red-200 px-4">
                        <XCircleIcon className="w-10 h-10 text-red-500 mx-auto mb-3" />
                        <p className="text-red-600 font-medium mb-3">Payment Failed</p>
                        <button
                          onClick={() => setPaymentStatus(PAYMENT_STATUS.IDLE)}
                          className="text-sm text-[#b89b7b] hover:text-[#9b7a5a] font-medium"
                        >
                          Try Again →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sunbox Payment Card */}
          <div 
            onClick={() => setSelectedMethod('sunbox')}
            className={`
              bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all shadow-sm
              ${selectedMethod === 'sunbox' 
                ? 'border-[#b89b7b] bg-gradient-to-br from-[#fefaf5] to-white' 
                : 'border-[#f0e7db] hover:border-[#b89b7b]/40'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                ${selectedMethod === 'sunbox' 
                  ? 'bg-gradient-to-br from-[#b89b7b] to-[#9b7a5a]' 
                  : 'bg-gradient-to-br from-[#faf7f2] to-[#f5ede0]'
                }
              `}>
                <CreditCardIcon className={`w-6 h-6 ${selectedMethod === 'sunbox' ? 'text-white' : 'text-[#b89b7b]'}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h5 className="font-medium text-[#2c2c2c]">Sunbox Payment</h5>
                    <span className="text-xs text-[#9b7a5a] bg-[#faf7f2] px-2 py-0.5 rounded-full">Test Mode</span>
                  </div>
                  {selectedMethod === 'sunbox' && (
                    <CheckCircleIcon className="w-5 h-5 text-[#b89b7b]" />
                  )}
                </div>
                <p className="text-xs text-[#6b6b6b] mb-4">
                  Alternative payment method for testing
                </p>

                {selectedMethod === 'sunbox' && (
                  <div className="space-y-3 mt-4">
                    {paymentStatus === PAYMENT_STATUS.IDLE && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wide">
                            Password
                          </label>
                          <input
                            type="password"
                            placeholder="Enter password (1234)"
                            value={sunboxPassword}
                            onChange={(e) => setSunboxPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-[#f0e7db] rounded-xl focus:border-[#b89b7b] focus:outline-none transition bg-[#fefaf5]"
                          />
                          <p className="text-xs text-[#9b7a5a] mt-2">Test password: 1234</p>
                        </div>
                        <button
                          onClick={handleSunboxPayment}
                          className="w-full py-3.5 bg-gradient-to-r from-[#2c2c2c] to-[#3a3a3a] text-white rounded-xl font-semibold hover:from-[#b89b7b] hover:to-[#9b7a5a] transition-all shadow-lg hover:shadow-xl transform active:scale-98"
                        >
                          Pay KES {total.toLocaleString()}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-xl border border-[#f0e7db] p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-[#6b6b6b]">
            <svg className="w-4 h-4 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure Payment</span>
            <span className="w-px h-3 bg-[#f0e7db]"></span>
            <span>SSL Encrypted</span>
            <span className="w-px h-3 bg-[#f0e7db]"></span>
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#f0e7db] p-5 bg-gradient-to-br from-[#fefaf5] to-white">
        <button 
          onClick={onBack} 
          disabled={paymentStatus !== PAYMENT_STATUS.IDLE && paymentStatus !== PAYMENT_STATUS.FAILED}
          className="w-full py-3.5 border-2 border-[#f0e7db] text-[#6b6b6b] rounded-xl font-medium hover:bg-[#faf7f2] hover:border-[#b89b7b]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back to Checkout
        </button>
      </div>
    </div>
  );
};

export default PaymentView;