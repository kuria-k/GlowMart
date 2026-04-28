// components/CartView.jsx
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/cartcontext";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { getProduct } from "../api"; 

const CartView = ({ onProceed }) => {
  const { cart, updateQuantity, removeItem, cartTotal, itemCount } = useCart();
  const [enrichedCart, setEnrichedCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product details for all cart items
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cart.length === 0) {
        setEnrichedCart([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productPromises = cart.map(async (item) => {
          try {
            const response = await getProduct(item.id);
            return {
              ...item,
              productDetails: response.data,
              image_url: response.data.image_url || response.data.image || item.image_url,
              name: response.data.name || item.name,
              description: response.data.description || item.description,
            };
          } catch (error) {
            console.error(`Failed to fetch product ${item.id}:`, error);
            // Fallback to cart data if API fails
            return item;
          }
        });

        const enrichedProducts = await Promise.all(productPromises);
        setEnrichedCart(enrichedProducts);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setEnrichedCart(cart); // Fallback to original cart data
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [cart]);

  const subtotal = useMemo(() => cartTotal, [cartTotal]);
  const deliveryFee = subtotal > 15000 ? 0 : 250;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center bg-gradient-to-br from-[#fefaf5] to-white">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-light text-[#2c2c2c] mb-2">Your cart is empty</h3>
        <p className="text-[#6b6b6b] text-sm mb-8 max-w-xs">Start adding your favorite products to create your perfect collection</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-gradient-to-r from-[#b89b7b] to-[#9b7a5a] text-white rounded-xl font-medium hover:from-[#9b7a5a] hover:to-[#8a6948] transition-all transform hover:scale-105"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#fefaf5] to-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#f0e7db]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-light text-[#2c2c2c]">Shopping Cart</h2>
          <span className="text-sm text-[#b89b7b] font-medium">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 px-5 py-6 space-y-4 overflow-y-auto">
        {loading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#f0e7db] animate-pulse">
                <div className="w-24 h-24 bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-[#f0e7db] rounded w-3/4"></div>
                  <div className="h-3 bg-[#f0e7db] rounded w-1/2"></div>
                  <div className="h-8 bg-[#f0e7db] rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          enrichedCart.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group"
            >
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#f0e7db] hover:border-[#b89b7b]/30 transition-all shadow-sm hover:shadow-md">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span className="text-3xl" style={{ display: item.image_url ? 'none' : 'flex' }}>✨</span>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-light text-[#2c2c2c] line-clamp-2 mb-1 pr-6">{item.name}</h4>
                  {item.description && (
                    <p className="text-xs text-[#6b6b6b] line-clamp-1 mb-2">{item.description}</p>
                  )}
                  <p className="text-base text-[#b89b7b] font-semibold mb-3">
                    KES {Number(item.price).toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#faf7f2] rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md bg-white border border-[#f0e7db] flex items-center justify-center hover:bg-[#b89b7b] hover:text-white hover:border-[#b89b7b] transition-all"
                      >
                        <MinusIcon className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-medium text-[#2c2c2c] text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md bg-white border border-[#f0e7db] flex items-center justify-center hover:bg-[#b89b7b] hover:text-white hover:border-[#b89b7b] transition-all"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="flex-1 text-right">
                      <p className="font-semibold text-[#2c2c2c] text-sm">
                        KES {(Number(item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 p-1.5 text-[#b89b7b]/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove item"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Order Summary */}
      <div className="border-t border-[#f0e7db] px-6 py-6 bg-gradient-to-br from-[#fefaf5] to-white">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6b6b6b] font-light">Subtotal</span>
            <span className="font-medium text-[#2c2c2c]">KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6b6b6b] font-light">Delivery Fee</span>
            {deliveryFee === 0 ? (
              <span className="text-[#b89b7b] font-semibold text-xs uppercase tracking-wider">Free</span>
            ) : (
              <span className="font-medium text-[#2c2c2c]">KES {deliveryFee.toLocaleString()}</span>
            )}
          </div>
          
          {subtotal > 15000 && (
            <div className="bg-gradient-to-r from-[#faf7f2] to-[#f5ede0] rounded-xl p-3 text-center border border-[#f0e7db]">
              <p className="text-xs text-[#9b7a5a] font-medium">✨ Complimentary delivery unlocked</p>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-3 border-t border-[#f0e7db]">
            <span className="font-light text-[#2c2c2c]">Total</span>
            <span className="text-2xl font-light text-[#2c2c2c]">
              KES <span className="font-semibold">{total.toLocaleString()}</span>
            </span>
          </div>
        </div>

        <button
          onClick={onProceed}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#2c2c2c] to-[#3a3a3a] text-white rounded-xl font-medium hover:from-[#b89b7b] hover:to-[#9b7a5a] transition-all transform active:scale-98 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Proceed to Checkout →'}
        </button>

        <div className="mt-4 pt-4 border-t border-[#f0e7db]">
          <div className="flex items-center justify-center space-x-4 text-xs text-[#6b6b6b]">
            <span className="flex items-center space-x-1">
              <svg className="w-3.5 h-3.5 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure Checkout</span>
            </span>
            <span className="w-px h-3 bg-[#f0e7db]"></span>
            <span>Free Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;