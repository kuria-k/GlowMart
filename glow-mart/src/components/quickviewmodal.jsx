// // components/QuickViewModal.jsx
// import React, { useState } from 'react';

// const QuickViewModal = ({ isOpen, onClose, product, onAddToCart, onViewDetails }) => {
//   const [quantity, setQuantity] = useState(1);

//   if (!isOpen || !product) return null;

//   const handleAddToCart = () => {
//     onAddToCart(product, quantity);
//     onClose();
//   };

//   // Ensure price is a number
//   const safePrice = Number(product.price) || 0;
//   const safeOriginalPrice = product.originalPrice ? Number(product.originalPrice) : null;
//   const discount = safeOriginalPrice ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100) : 0;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-8px); }
//         }
        
//         @keyframes shimmer {
//           0% { background-position: -200% 0; }
//           100% { background-position: 200% 0; }
//         }
        
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
        
//         .modal-animate {
//           animation: fadeIn 0.3s ease-out;
//         }
        
//         .floating {
//           animation: float 6s ease-in-out infinite;
//         }
//       `}</style>

//       <div className="flex items-center justify-center min-h-screen px-4 py-8">
//         {/* Backdrop with warm overlay */}
//         <div 
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
//           onClick={onClose}
//         />
        
//         {/* Modal Container */}
//         <div className="relative max-w-3xl w-full modal-animate">
//           {/* Main Modal - Warm White with Elegant Border */}
//           <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#f0e7db]">
//             {/* Decorative header accent */}
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c9a882] via-[#b89b7b] to-[#c9a882]"></div>
            
//             {/* Decorative orbs - subtle warmth */}
//             <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#b89b7b]/5 rounded-full blur-3xl"></div>
//             <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#c9a882]/5 rounded-full blur-3xl"></div>
            
//             {/* Close button */}
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full 
//                        flex items-center justify-center hover:bg-[#f5efe8] transition-all
//                        text-[#2c2c2c] shadow-md border border-[#f0e7db] z-10"
//               aria-label="Close"
//             >
//               <span className="text-xl">✕</span>
//             </button>

//             <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
//               {/* Image Section - Warm Background */}
//               <div className="bg-gradient-to-br from-[#faf7f2] to-[#f5efe8] p-8 flex items-center justify-center min-h-[320px] border-r border-[#f0e7db]">
//                 <div className="relative w-full h-full flex items-center justify-center">
//                   <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl"></div>
//                   <img
//                     src={product.image_url || product.image || 'https://via.placeholder.com/300'}
//                     alt={product.name}
//                     className="w-full h-full object-contain max-h-[280px] relative z-10 drop-shadow-lg"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = 'https://via.placeholder.com/300';
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Details Section - Warm White */}
//               <div className="p-8 bg-white">
//                 {/* Back Button */}
//                 <button
//                   onClick={onClose}
//                   className="flex items-center text-sm text-[#6b6b6b] hover:text-[#b89b7b] transition-colors mb-4 group"
//                 >
//                   <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                   Back
//                 </button>

//                 {/* Badges */}
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {product.isNew && (
//                     <span className="bg-[#2c2c2c] text-white text-xs px-3 py-1.5 rounded-full font-medium">
//                       ✨ NEW
//                     </span>
//                   )}
//                   {product.isBestseller && !product.isNew && (
//                     <span className="bg-[#b89b7b] text-white text-xs px-3 py-1.5 rounded-full font-medium">
//                       🔥 BESTSELLER
//                     </span>
//                   )}
//                   {discount > 0 && (
//                     <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium">
//                       -{discount}% SALE
//                     </span>
//                   )}
//                   {product.stock && product.stock < 5 && (
//                     <span className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-medium">
//                       ⚡ LOW STOCK
//                     </span>
//                   )}
//                 </div>
                
//                 {/* Title and Brand */}
//                 <h3 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#2c2c2c] mb-2">
//                   {product.name}
//                 </h3>
//                 <p className="text-sm text-[#6b6b6b] mb-4 flex items-center">
//                   <span className="w-1 h-1 bg-[#b89b7b] rounded-full mr-2"></span>
//                   {product.brand || 'Premium Collection'}
//                 </p>
                
//                 {/* Rating */}
//                 {product.rating && (
//                   <div className="flex items-center mb-4">
//                     <div className="flex text-amber-400 mr-2">
//                       {[...Array(5)].map((_, i) => (
//                         <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                       ))}
//                     </div>
//                     <span className="text-xs text-[#888]">
//                       {product.rating} ({product.review_count || product.reviews || 0} reviews)
//                     </span>
//                   </div>
//                 )}
                
//                 {/* Price */}
//                 <div className="flex items-baseline mb-6">
//                   <span className="font-['Cormorant_Garamond'] text-3xl font-light text-[#2c2c2c]">
//                     KES {safePrice.toFixed(2)}
//                   </span>
//                   {safeOriginalPrice && (
//                     <>
//                       <span className="ml-3 text-sm text-[#888] line-through">
//                         KES {safeOriginalPrice.toFixed(2)}
//                       </span>
//                       <span className="ml-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                         Save KES {(safeOriginalPrice - safePrice).toFixed(2)}
//                       </span>
//                     </>
//                   )}
//                 </div>

//                 {/* Description */}
//                 <div className="mb-6">
//                   <p className="text-sm text-[#6b6b6b] leading-relaxed">
//                     {product.description || 'No description available'}
//                   </p>
//                 </div>

//                 {/* Key Features/Benefits - if available */}
//                 {product.features && product.features.length > 0 && (
//                   <div className="mb-6">
//                     <h4 className="text-xs font-medium text-[#2c2c2c] uppercase tracking-wider mb-2">Key Benefits</h4>
//                     <ul className="space-y-1">
//                       {product.features.slice(0, 3).map((feature, idx) => (
//                         <li key={idx} className="flex items-center text-xs text-[#6b6b6b]">
//                           <span className="w-1 h-1 bg-[#b89b7b] rounded-full mr-2"></span>
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Quantity and Add to Cart */}
//                 <div className="flex items-center space-x-4 mb-6">
//                   <div className="flex items-center border border-[#f0e7db] rounded-lg overflow-hidden">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="px-4 py-2 text-[#6b6b6b] hover:bg-[#faf7f2] transition-colors"
//                     >
//                       −
//                     </button>
//                     <span className="px-4 py-2 text-[#2c2c2c] font-medium border-x border-[#f0e7db] min-w-[50px] text-center">
//                       {quantity}
//                     </span>
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       className="px-4 py-2 text-[#6b6b6b] hover:bg-[#faf7f2] transition-colors"
//                     >
//                       +
//                     </button>
//                   </div>
                  
//                   <button
//                     onClick={handleAddToCart}
//                     disabled={!product.inStock && product.inStock !== undefined}
//                     className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium tracking-wide 
//                              transition-all transform hover:scale-105 active:scale-95
//                              ${product.inStock || product.inStock === undefined
//                                ? 'bg-[#2c2c2c] text-white hover:bg-[#b89b7b] shadow-md hover:shadow-lg' 
//                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                              }`}
//                   >
//                     {product.inStock || product.inStock === undefined ? (
//                       <span className="flex items-center justify-center">
//                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                                 d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                         ADD TO CART
//                       </span>
//                     ) : (
//                       'OUT OF STOCK'
//                     )}
//                   </button>
//                 </div>

//                 {/* View Full Details Link */}
//                 <button
//                   onClick={onViewDetails}
//                   className="text-sm text-[#b89b7b] hover:text-[#2c2c2c] transition-colors 
//                            flex items-center group mb-6"
//                 >
//                   <span>View Full Details</span>
//                   <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
//                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>

//                 {/* Trust Badges */}
//                 <div className="pt-6 border-t border-[#f0e7db] grid grid-cols-3 gap-2 text-xs">
//                   <div className="text-center">
//                     <svg className="w-5 h-5 mx-auto mb-1 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
//                             d="M5 13l4 4L19 7" />
//                     </svg>
//                     <span className="text-[#6b6b6b]">Free Shipping</span>
//                   </div>
//                   <div className="text-center">
//                     <svg className="w-5 h-5 mx-auto mb-1 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
//                             d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                     </svg>
//                     <span className="text-[#6b6b6b]">Secure</span>
//                   </div>
//                   <div className="text-center">
//                     <svg className="w-5 h-5 mx-auto mb-1 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
//                             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                     </svg>
//                     <span className="text-[#6b6b6b]">30-Day Returns</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuickViewModal;

// components/ProductModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { getProducts } from '../api';

const ProductModal = ({
  isOpen,
  onClose,
  product: initialProduct,
  onAddToCart,
  onToggleWishlist,
  wishlist = [], // Array of product IDs
}) => {
  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [zoom, setZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [wishlistAnimating, setWishlistAnimating] = useState(false);
  const [productHistory, setProductHistory] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ── Check if product is in wishlist (re-evaluates when wishlist changes) ──
  const isInWishlist = product ? wishlist.includes(product.id) : false;

  // ── Sync product when parent prop changes ──
  useEffect(() => {
    setProduct(initialProduct);
    setProductHistory([]);
  }, [initialProduct]);

  // ── Reset UI when product changes ──
  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    setActiveTab('description');
    setZoom(false);
  }, [product?.id]);

  // ── Real-time clock for discount expiration ──
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Escape key to close ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (productHistory.length > 0) handleBack();
        else onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, productHistory, onClose]);

  // ── Lock body scroll ──
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Fetch related products ──
  useEffect(() => {
    if (!product) return;

    const fetchRelated = async () => {
      try {
        const price = getCurrentPrice();
        const minPrice = Math.max(0, price - 500);
        const maxPrice = price + 400;

        const res = await getProducts({
          min_price: minPrice,
          max_price: maxPrice,
          page_size: 6,
          ordering: '-sales_count',
        });

        let items = [];
        if (res.data && Array.isArray(res.data)) {
          items = res.data;
        } else if (res.data?.results) {
          items = res.data.results;
        }

        const filtered = items.filter((p) => p.id !== product.id).slice(0, 3);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error('Failed to fetch related products:', err);
        setRelatedProducts([]);
      }
    };

    fetchRelated();
  }, [product]);

  // ── Pricing helpers ──
  const getCurrentPrice = useCallback(() => {
    if (!product) return 0;
    
    const discountPercent = Number(product.discount_percent) || 0;
    const discountExpiry = product.discount_expiry;
    
    let isDiscountValid = false;
    if (discountPercent > 0 && discountExpiry) {
      const expiryDate = new Date(discountExpiry);
      isDiscountValid = expiryDate > currentTime;
    }
    
    if (product.is_discount_active === true) {
      isDiscountValid = true;
    } else if (product.is_discount_active === false) {
      isDiscountValid = false;
    }
    
    if (isDiscountValid && product.current_price !== undefined && product.current_price !== null) {
      return Number(product.current_price);
    }
    
    return Number(product.price) || 0;
  }, [product, currentTime]);

  const getOriginalPrice = useCallback(() => {
    if (!product) return 0;
    return Number(product.original_price || product.originalPrice || product.price) || 0;
  }, [product]);

  const hasActiveDiscount = useCallback(() => {
    if (!product) return false;
    
    const discountPercent = Number(product.discount_percent) || 0;
    const discountExpiry = product.discount_expiry;
    
    if (discountPercent > 0 && discountExpiry) {
      const expiryDate = new Date(discountExpiry);
      if (expiryDate > currentTime) {
        return true;
      }
    }
    
    if (product.is_discount_active === true) {
      return true;
    }
    
    return false;
  }, [product, currentTime]);

  const getDiscountPercent = useCallback(() => {
    if (!product) return 0;
    
    const discountPercent = Number(product.discount_percent) || 0;
    const discountExpiry = product.discount_expiry;
    
    if (discountPercent > 0 && discountExpiry) {
      const expiryDate = new Date(discountExpiry);
      if (expiryDate > currentTime) {
        return discountPercent;
      }
    }
    
    return 0;
  }, [product, currentTime]);

  // ── Navigation ──
  const handleOpenRelated = useCallback((relatedProduct) => {
    setProductHistory((prev) => [...prev, product]);
    setProduct(relatedProduct);
    setTimeout(() => {
      document.getElementById('modal-right-panel')?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, [product]);

  const handleBack = useCallback(() => {
    if (productHistory.length > 0) {
      const prev = productHistory[productHistory.length - 1];
      setProductHistory((h) => h.slice(0, -1));
      setProduct(prev);
    } else {
      onClose();
    }
  }, [productHistory, onClose]);

  // ── Stock helpers ──
  const stockQty = Number(product?.stock) || 0;
  const isInStock = stockQty > 0;
  const isLowStock = isInStock && stockQty < 10;

  const handleIncrement = useCallback(() => {
    if (quantity >= stockQty) {
      toast.error(`Only ${stockQty} unit${stockQty !== 1 ? 's' : ''} available`);
      return;
    }
    setQuantity((q) => q + 1);
  }, [quantity, stockQty]);

  const handleDecrement = useCallback(() => setQuantity((q) => Math.max(1, q - 1)), []);

  // ── Add to cart ──
  const handleAddToCart = useCallback(() => {
    if (!isInStock) {
      toast.error('This product is out of stock');
      return;
    }
    if (quantity > stockQty) {
      toast.error(`Only ${stockQty} unit${stockQty !== 1 ? 's' : ''} available`);
      return;
    }
    onAddToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`, { icon: '🛍️', duration: 2000 });
  }, [isInStock, quantity, stockQty, onAddToCart, product]);

  // ── Wishlist toggle with safety check ──
  const handleWishlistToggle = useCallback(() => {
    if (!onToggleWishlist) {
      console.error('onToggleWishlist is not provided - make sure to pass it as a prop');
      toast.error('Wishlist feature not available', { duration: 2000 });
      return;
    }
    
    setWishlistAnimating(true);
    setTimeout(() => setWishlistAnimating(false), 400);
    onToggleWishlist(product);
  }, [onToggleWishlist, product]);

  // ── Image zoom ──
  const handleMouseMove = useCallback((e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setZoomPosition({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  }, []);

  const imageUrl = product?.image_url || product?.image || null;
  const safePrice = getCurrentPrice();
  const safeOriginalPrice = hasActiveDiscount() ? getOriginalPrice() : null;
  const discount = getDiscountPercent();
  const savings = safeOriginalPrice ? (safeOriginalPrice - safePrice).toFixed(2) : 0;

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Product details: ${product.name}`}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.4); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes discountPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .modal-animate   { animation: modalFadeIn 0.35s cubic-bezier(0.16,1,0.3,1); }
        .slide-up        { animation: slideUp 0.4s ease-out; }
        .heart-pop       { animation: heartPop 0.4s ease-out; }
        .product-fadein  { animation: fadeSlideIn 0.3s ease-out; }
        .discount-pulse  { animation: discountPulse 1.5s ease-in-out infinite; }
      `}</style>

      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
          onClick={handleBack}
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div
          key={product.id}
          className="inline-block overflow-hidden text-left align-bottom transition-all
                     transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle
                     sm:max-w-6xl sm:w-full modal-animate border border-[#f0e7db] product-fadein"
        >
          <div className="relative">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c9a882] via-[#b89b7b] to-[#c9a882]" />

            {/* Decorative orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#b89b7b]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#c9a882]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full
                         shadow-lg flex items-center justify-center hover:bg-[#f5efe8]
                         transition-all hover:scale-110 border border-[#f0e7db]"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 text-[#2c2c2c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Wishlist button - RED when in wishlist */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-16 z-20 w-10 h-10 bg-white rounded-full
                         shadow-lg flex items-center justify-center hover:bg-[#f5efe8]
                         transition-all hover:scale-110 border border-[#f0e7db]"
              aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isInWishlist}
            >
              <svg
                className={`w-5 h-5 transition-all duration-300 ${wishlistAnimating ? 'heart-pop' : ''} ${
                  isInWishlist ? 'text-red-500 fill-current' : 'text-[#6b6b6b] fill-none'
                }`}
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Back / breadcrumb */}
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 z-20 flex items-center text-sm text-[#6b6b6b]
                         hover:text-[#b89b7b] transition-colors bg-white/80 backdrop-blur-sm
                         px-3 py-1.5 rounded-full shadow-sm border border-[#f0e7db]"
              aria-label={productHistory.length > 0 ? 'Back to previous product' : 'Close'}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {productHistory.length > 0 ? 'Back' : 'Close'}
            </button>

            {/* Breadcrumb trail */}
            {productHistory.length > 0 && (
              <div className="absolute top-14 left-4 z-20 flex items-center text-xs text-[#aaa] bg-white/70 px-3 py-1 rounded-full border border-[#f0e7db] backdrop-blur-sm max-w-xs truncate">
                {productHistory.map((p, i) => (
                  <span key={p.id} className="flex items-center">
                    <span className="truncate max-w-[80px]">{p.name}</span>
                    {i < productHistory.length - 1 && (
                      <svg className="w-3 h-3 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </span>
                ))}
                <svg className="w-3 h-3 mx-1 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-[#b89b7b] font-medium truncate max-w-[80px]">{product.name}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
              {/* LEFT: Images */}
              <div className="p-6 bg-gradient-to-br from-[#faf7f2] to-[#f5efe8] border-r border-[#f0e7db]">
                {/* Main image with zoom */}
                <div
                  className="relative h-150 bg-white rounded-xl shadow-inner flex items-center
                             justify-center mb-4 overflow-hidden group border border-[#f0e7db] cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setZoom(true)}
                  onMouseLeave={() => setZoom(false)}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${zoom ? 'scale-150' : 'scale-100'}`}
                      style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
                    />
                  ) : (
                    <span className="text-8xl">{product.emoji || '📦'}</span>
                  )}

                  {/* Zoom hint */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm
                                  px-3 py-1.5 rounded-full text-xs text-[#6b6b6b] border border-[#f0e7db] shadow-sm
                                  opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Hover to zoom
                  </div>

                  {/* Discount badge */}
                  {discount > 0 && hasActiveDiscount() && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg discount-pulse flex items-center gap-2">
                      <span className="text-base">🔥</span>
                      <span>-{discount}% OFF</span>
                    </div>
                  )}

                  {!isInStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg tracking-wide">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      aria-label={`View image ${idx + 1}`}
                      aria-pressed={selectedImage === idx}
                      className={`h-20 bg-white rounded-lg border-2 transition-all overflow-hidden
                                  hover:border-[#b89b7b] ${
                                    selectedImage === idx
                                      ? 'border-[#b89b7b] shadow-md scale-105'
                                      : 'border-transparent'
                                  }`}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-[#faf7f2]">
                          {product.emoji || '📦'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Share */}
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <span className="text-xs text-[#888] mr-2">Follow Us:</span>
                  {[
                    <svg key="fb" className="w-4 h-4 text-[#b89b7b]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                    <svg key="tw" className="w-4 h-4 text-[#b89b7b]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.577-12.39c0-.213-.005-.425-.014-.636A9.936 9.936 0 0024 4.59z"/></svg>,
                    <svg key="pt" className="w-4 h-4 text-[#b89b7b]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.163-1.49-.694-2.424-2.875-2.424-4.624 0-3.761 2.748-7.218 7.886-7.218 4.135 0 7.353 2.946 7.353 6.886 0 4.107-2.585 7.416-6.17 7.416-1.205 0-2.339-.624-2.729-1.363 0 0-.597 2.274-.743 2.831-.269 1.04-1 2.343-1.488 3.141 1.12.347 2.312.534 3.552.534 6.607 0 11.985-5.366 11.985-11.987C23.97 5.367 18.627 0 12.017 0z"/></svg>,
                  ].map((icon, i) => (
                    <button key={i} className="p-2 bg-white rounded-full hover:bg-[#f5efe8] transition-colors border border-[#f0e7db]">
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: Product details */}
              <div
                id="modal-right-panel"
                className="p-8 overflow-y-auto max-h-[calc(130vh-8rem)] bg-white"
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.is_new && (
                    <span className="bg-[#2c2c2c] text-white text-xs px-3 py-1.5 rounded-full font-medium">✨ NEW ARRIVAL</span>
                  )}
                  {product.is_bestseller && (
                    <span className="bg-[#b89b7b] text-white text-xs px-3 py-1.5 rounded-full font-medium">🔥 BESTSELLER</span>
                  )}
                  {discount > 0 && hasActiveDiscount() && (
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 discount-pulse">
                      <span>🔥</span> SAVE {discount}%
                    </span>
                  )}
                  {!isInStock ? (
                    <span className="bg-gray-700 text-white text-xs px-3 py-1.5 rounded-full font-semibold tracking-wide">✕ OUT OF STOCK</span>
                  ) : isLowStock ? (
                    <span className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-medium animate-pulse">⚡ ONLY {stockQty} LEFT</span>
                  ) : null}
                </div>

                <h2 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#2c2c2c] mb-2">
                  {product.name}
                </h2>

                <p className="text-lg text-[#6b6b6b] mb-4">
                  {product.brand || product.supplier_name || 'Premium Collection'}
                </p>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center mb-6">
                    <div className="flex text-amber-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-[#888]">
                      {product.rating} ({(product.review_count || product.reviews || 0).toLocaleString()} reviews)
                    </span>
                  </div>
                )}

                {/* Price block */}
                <div className="mb-6 p-4 bg-[#faf7f2] rounded-xl">
                  <div className="flex items-baseline flex-wrap gap-2">
                    {hasActiveDiscount() ? (
                      <>
                        <span className="font-['Cormorant_Garamond'] text-4xl font-semibold text-red-500">
                          KES {safePrice.toFixed(2)}
                        </span>
                        <span className="text-lg text-[#888] line-through">KES {safeOriginalPrice.toFixed(2)}</span>
                        <span className="text-sm bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full font-medium flex items-center gap-1">
                          <span>🔥</span> Save KES {savings}
                        </span>
                      </>
                    ) : (
                      <span className="font-['Cormorant_Garamond'] text-4xl font-light text-[#2c2c2c]">
                        KES {safePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#888] mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Price match guaranteed
                  </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-[#f0e7db] mb-6">
                  <div className="flex space-x-6">
                    {['description', 'shipping'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        aria-selected={activeTab === tab}
                        role="tab"
                        className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                          activeTab === tab
                            ? 'border-[#b89b7b] text-[#2c2c2c]'
                            : 'border-transparent text-[#888] hover:text-[#6b6b6b]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab content */}
                <div className="mb-6 min-h-[120px]">
                  {activeTab === 'description' && (
                    <div className="prose prose-sm">
                      <p className="text-[#6b6b6b] leading-relaxed">
                        {product.description || 'No description available for this product.'}
                      </p>
                      {product.features && product.features.length > 0 && (
                        <ul className="mt-3 space-y-2 list-none p-0">
                          {product.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-[#6b6b6b]">
                              <svg className="w-4 h-4 text-[#b89b7b] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-3 bg-[#faf7f2] p-4 rounded-lg">
                      {[
                        { icon: '🚚', text: 'Free shipping on orders over KES 10,000' },
                        { icon: '📦', text: 'Estimated delivery: 1–2 business days within Nairobi' },
                        { icon: '🔄', text: '30-day easy returns — no questions asked' },
                        { icon: '🔒', text: 'Secure & insured packaging on all orders' },
                      ].map((item, i) => (
                        <p key={i} className="flex items-center text-sm text-[#6b6b6b]">
                          <span className="w-6 h-6 bg-[#b89b7b]/10 rounded-full flex items-center justify-center mr-2 text-sm flex-shrink-0">
                            {item.icon}
                          </span>
                          {item.text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity and Add to Cart */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#2c2c2c] mb-2">Quantity</label>
                  <div className="flex items-center space-x-4 flex-wrap gap-y-3">
                    <div className="flex items-center border border-[#f0e7db] rounded-lg overflow-hidden">
                      <button
                        onClick={handleDecrement}
                        disabled={!isInStock || quantity <= 1}
                        aria-label="Decrease quantity"
                        className="px-4 py-2.5 text-[#6b6b6b] hover:bg-[#faf7f2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <span
                        aria-live="polite"
                        className="px-4 py-2.5 text-[#2c2c2c] border-x border-[#f0e7db] min-w-[60px] text-center font-medium"
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={!isInStock || quantity >= stockQty}
                        aria-label="Increase quantity"
                        className="px-4 py-2.5 text-[#6b6b6b] hover:bg-[#faf7f2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    {isInStock && (
                      <span className="text-xs text-[#888]">
                        {stockQty} unit{stockQty !== 1 ? 's' : ''} available
                      </span>
                    )}

                    <button
                      onClick={handleAddToCart}
                      disabled={!isInStock}
                      className={`flex-1 min-w-[140px] px-6 py-3 rounded-lg text-sm font-medium tracking-wide
                                  transition-all transform hover:scale-105 active:scale-95
                                  shadow-md hover:shadow-lg
                                  ${isInStock
                                    ? 'bg-[#2c2c2c] text-white hover:bg-[#b89b7b]'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    >
                      {isInStock ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          ADD TO CART
                        </span>
                      ) : (
                        'OUT OF STOCK'
                      )}
                    </button>
                  </div>
                </div>

                {/* Stock status + delivery */}
                {isInStock ? (
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      In stock — Ready to ship
                    </p>
                    <div className="bg-[#faf7f2] rounded-xl p-4 border border-[#f0e7db]">
                      <p className="text-sm text-[#6b6b6b] flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Order within <span className="font-medium text-[#2c2c2c] mx-1">2h 15m</span> for delivery
                      </p>
                      <p className="text-sm text-[#b89b7b] ml-7">
                        <span className="font-medium">Tomorrow</span> by 8pm
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 flex items-center font-medium">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      This product is currently out of stock.
                    </p>
                    <p className="text-xs text-[#888] mt-1 ml-6">
                      Add to your wishlist to be notified when it's back.
                    </p>
                  </div>
                )}

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    {
                      icon: (
                        <svg className="w-5 h-5 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ),
                      label: 'Cruelty Free',
                    },
                    {
                      icon: (
                        <svg className="w-5 h-5 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                        </svg>
                      ),
                      label: 'Vegan',
                    },
                    {
                      icon: (
                        <svg className="w-5 h-5 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      ),
                      label: 'Clean Formula',
                    },
                  ].map((b, i) => (
                    <div key={i} className="text-center p-3 bg-[#faf7f2] rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border border-[#f0e7db]">
                        {b.icon}
                      </div>
                      <p className="text-xs text-[#6b6b6b]">{b.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="border-t border-[#f0e7db] p-8 bg-[#faf7f2]">
                <h3 className="font-['Cormorant_Garamond'] text-xl font-light text-[#2c2c2c] mb-1">
                  You might also like
                </h3>
                <p className="text-xs text-[#888] mb-6">
                  Products in a similar price range
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((related) => {
                    const hasRelDiscount = () => {
                      const discountPercent = Number(related.discount_percent) || 0;
                      const discountExpiry = related.discount_expiry;
                      if (discountPercent > 0 && discountExpiry) {
                        return new Date(discountExpiry) > new Date();
                      }
                      return related.is_discount_active === true;
                    };
                    
                    const getRelCurrentPrice = () => {
                      if (hasRelDiscount() && related.current_price) {
                        return Number(related.current_price);
                      }
                      return Number(related.price) || 0;
                    };
                    
                    const getRelOriginalPrice = () => {
                      return Number(related.original_price || related.originalPrice || related.price) || 0;
                    };
                    
                    const relPrice = getRelCurrentPrice();
                    const relOriginalPrice = getRelOriginalPrice();
                    const relDiscount = hasRelDiscount() ? Math.round(((relOriginalPrice - relPrice) / relOriginalPrice) * 100) : 0;
                    const relImg = related.image || related.image_url || null;
                    const relInStock = Number(related.stock) > 0;
                    const relInWishlist = wishlist.includes(related.id);

                    return (
                      <div
                        key={related.id}
                        className="group bg-white rounded-xl p-4 border border-[#f0e7db] hover:shadow-lg
                                   transition-all hover:-translate-y-0.5 relative"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleWishlist) onToggleWishlist(related);
                          }}
                          aria-label={relInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                          aria-pressed={relInWishlist}
                          className="absolute top-6 right-6 z-10 w-7 h-7 bg-white/90 rounded-full shadow-sm
                                     flex items-center justify-center border border-[#f0e7db]
                                     opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                          <svg
                            className={`w-3.5 h-3.5 ${relInWishlist ? 'text-red-500' : 'text-[#aaa]'}`}
                            fill={relInWishlist ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleOpenRelated(related)}
                          className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b89b7b] rounded-lg"
                          aria-label={`Preview ${related.name}`}
                        >
                          <div className="aspect-square bg-gradient-to-br from-[#faf7f2] to-[#f5efe8] rounded-lg mb-3
                                          flex items-center justify-center overflow-hidden
                                          group-hover:scale-[1.02] transition-transform relative">
                            {relImg ? (
                              <img src={relImg} alt={related.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-5xl">{related.emoji || '📦'}</span>
                            )}
                            {!relInStock && (
                              <div className="absolute inset-0 bg-white/55 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-full border border-gray-200">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                            {relDiscount > 0 && (
                              <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                <span>🔥</span>-{relDiscount}%
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#2c2c2c] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-[#f0e7db]">
                                Quick view →
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-[#b89b7b] mb-1">{related.brand || related.supplier_name || 'Collection'}</p>
                          <p className="text-sm font-medium text-[#2c2c2c] mb-1 line-clamp-2 leading-snug group-hover:text-[#b89b7b] transition-colors">
                            {related.name}
                          </p>
                        </button>

                        {related.rating && (
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} width="10" height="10" viewBox="0 0 20 20"
                                className={i < Math.floor(related.rating) ? 'fill-amber-400' : 'fill-gray-200'}>
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                            <span className="text-[10px] text-[#888] ml-0.5">{related.rating}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          <div>
                            {hasRelDiscount() ? (
                              <>
                                <span className="text-lg font-semibold text-red-500 font-['Cormorant_Garamond']">
                                  KES {relPrice.toFixed(2)}
                                </span>
                                <span className="ml-1 text-xs text-[#aaa] line-through">
                                  KES {relOriginalPrice.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-light text-[#2c2c2c] font-['Cormorant_Garamond']">
                                KES {relPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (relInStock && onAddToCart) {
                                onAddToCart(related, 1);
                                toast.success(`${related.name} added to cart`, { icon: '🛍️', duration: 2000 });
                              }
                            }}
                            disabled={!relInStock}
                            aria-label={relInStock ? `Add ${related.name} to cart` : `${related.name} is sold out`}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                              ${relInStock
                                ? 'bg-[#2c2c2c] text-white hover:bg-[#b89b7b]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                          >
                            {relInStock ? '+ Add' : 'Sold Out'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;