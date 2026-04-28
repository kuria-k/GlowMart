// // components/navbar.jsx
// import { useState, useEffect, useRef } from "react";
// import MK from "../assets/mk.png";

// const navLinks = [
//   { label: "HOME",        href: "/home" },
//   { label: "COLLECTIONS", href: "/stocks" },
//   { label: "ABOUT",       href: "/about" },
//   { label: "JOURNAL",     href: "/blogs" },
// ];

// function Navbar({ cartCount = 0, onCartClick, wishlistCount = 0 }) {
//   const [activePath, setActivePath]         = useState("/home");
//   const [scrolled, setScrolled]             = useState(false);
//   const [showCartPreview, setShowCartPreview] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const cartPreviewTimer                    = useRef(null);

//   useEffect(() => {
//     setActivePath(window.location.pathname);
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   /* Close mobile menu on resize to desktop */
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) setMobileMenuOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   /* Lock body scroll when mobile menu is open */
//   useEffect(() => {
//     document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [mobileMenuOpen]);

//   /* Hover intent — small delay prevents accidental dismissal */
//   const handleCartMouseEnter = () => {
//     clearTimeout(cartPreviewTimer.current);
//     setShowCartPreview(true);
//   };
//   const handleCartMouseLeave = () => {
//     cartPreviewTimer.current = setTimeout(() => setShowCartPreview(false), 180);
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@200;300;400&display=swap');

//         @keyframes dotPop {
//           from { transform: translateX(-50%) scale(0); opacity: 0; }
//           to   { transform: translateX(-50%) scale(1); opacity: 1; }
//         }
//         @keyframes badgePop {
//           from { transform: scale(0); }
//           to   { transform: scale(1); }
//         }
//         @keyframes shimmer {
//           0%       { left: -75%; }
//           40%, 100% { left: 125%; }
//         }
//         @keyframes slideInRight {
//           from { transform: translateX(100%); }
//           to   { transform: translateX(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }

//         .nav-link.active::before {
//           content: '';
//           position: absolute;
//           top: -22px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 3px;
//           height: 3px;
//           background: #b89b7b;
//           border-radius: 50%;
//           animation: dotPop 0.3s ease forwards;
//           padding: 18px 40px;  
//         }

//         /* ── Hamburger ── */
//         .ham-line {
//           display: block;
//           width: 22px;
//           height: 1.5px;
//           background: #2c2c2c;
//           transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
//           transform-origin: center;
//         }
//         .ham-open .ham-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
//         .ham-open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
//         .ham-open .ham-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

//         /* ── Mobile drawer ── */
//         .mobile-drawer {
//           position: fixed;
//           top: 0; right: 0; bottom: 0;
//           width: min(320px, 85vw);
//           background: #fffcf9;
//           box-shadow: -8px 0 40px rgba(44,44,44,0.12);
//           z-index: 200;
//           display: flex;
//           flex-direction: column;
//           animation: slideInRight 0.32s cubic-bezier(0.4,0,0.2,1);
//           overflow-y: auto;
//           -webkit-overflow-scrolling: touch;
//         }
//         .mobile-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(44,44,44,0.38);
//           z-index: 199;
//           animation: fadeIn 0.22s ease;
//           backdrop-filter: blur(2px);
//         }

//         /* ── Cart preview responsive ── */
//         .cart-preview-panel {
//           position: absolute;
//           top: calc(100% + 8px);
//           right: 0;
//           width: min(384px, calc(100vw - 32px));
//           background: white;
//           border-radius: 14px;
//           box-shadow: 0 20px 60px rgba(44,44,44,0.14);
//           border: 1px solid #f0e7db;
//           z-index: 100;
//           transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s;
//         }
//         .cart-preview-panel.visible  { opacity: 1; visibility: visible; transform: translateY(0); }
//         .cart-preview-panel.hidden   { opacity: 0; visibility: hidden;  transform: translateY(-6px); }

//         /* ── Mobile nav link ── */
//         .mobile-nav-link {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 16px 24px;
//           font-family: 'Jost', sans-serif;
//           font-size: 11px;
//           letter-spacing: 0.18em;
//           color: #888;
//           text-decoration: none;
//           border-bottom: 1px solid #f5efe8;
//           transition: color 0.2s, background 0.2s;
//         }
//         .mobile-nav-link:hover,
//         .mobile-nav-link.active { color: #2c2c2c; background: #faf7f2; }
//         .mobile-nav-link.active { color: #b89b7b; }
//         .mobile-nav-link .arrow {
//           opacity: 0;
//           transform: translateX(-4px);
//           transition: all 0.2s;
//           font-size: 14px;
//           color: #b89b7b;
//         }
//         .mobile-nav-link:hover .arrow,
//         .mobile-nav-link.active .arrow { opacity: 1; transform: translateX(0); }
//       `}</style>

//       {/* ── NAVBAR ── */}
//       <nav
//         className={`font-['Jost'] sticky top-0 z-50 bg-[rgba(255,252,249,0.92)] backdrop-blur-md border-b border-[#f0e7db] transition-shadow duration-300 ${
//           scrolled ? "shadow-[0_4px_30px_rgba(184,155,123,0.1)]" : ""
//         }`}
//       >
//         <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-16 py-4 md:py-5 max-w-7xl mx-auto">

//           {/* Logo */}
//           <a href="/home" className="flex items-center flex-shrink-0">
//             <img src={MK} alt="mk-logo" className="h-8 w-16 md:h-10 md:w-20 object-contain" />
//           </a>

//           {/* Desktop Nav Links */}
//           <ul className="hidden md:flex items-center gap-8 lg:gap-11">
//             {navLinks.map(({ label, href }) => (
//               <li key={href}>
//                 <a
//                   href={href}
//                   className={`relative text-xs tracking-[0.15em] pb-1 transition-colors duration-250 ${
//                     activePath === href
//                       ? "text-[#2c2c2c] font-normal after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-[#b89b7b]"
//                       : "text-[#888] hover:text-[#2c2c2c] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-[#b89b7b] after:transition-all after:duration-300 hover:after:w-full"
//                   }`}
//                   onClick={() => setActivePath(href)}
//                 >
//                   {label}
//                 </a>
//               </li>
//             ))}
//           </ul>

//           {/* Action Buttons */}
//           <div className="flex items-center gap-1 sm:gap-2 md:gap-3">

//             {/* Wishlist */}
//             <button
//               className="relative p-2 hover:scale-105 transition-transform duration-200 group touch-target"
//               onClick={() => (window.location.href = "/wishlist")}
//               aria-label="Wishlist"
//               style={{ minWidth: 40, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
//             >
//               <svg className="w-5 h-5 stroke-[#2c2c2c] stroke-[1.5] fill-none group-hover:stroke-[#b89b7b] transition-all" viewBox="0 0 24 24">
//                 <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//               </svg>
//               {wishlistCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-[#b89b7b] text-white text-[10px] font-normal min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-[2px] animate-[badgePop_0.3s_ease]">
//                   {wishlistCount}
//                 </span>
//               )}
//             </button>

//             {/* Cart Button + Dropdown */}
//             <div className="relative">
//               <button
//                 className="relative p-2 hover:scale-105 transition-transform duration-200 group"
//                 onClick={onCartClick}
//                 onMouseEnter={handleCartMouseEnter}
//                 onMouseLeave={handleCartMouseLeave}
//                 aria-label="Cart"
//                 style={{ minWidth: 40, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
//               >
//                 <svg className="w-5 h-5 stroke-[#2c2c2c] stroke-[1.5] fill-none group-hover:stroke-[#b89b7b] transition-all" viewBox="0 0 24 24">
//                   <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-[#b89b7b] text-white text-[10px] font-normal min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-[2px] animate-[badgePop_0.3s_ease]">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>

//               {/* Cart Preview — desktop only */}
//               <div className="hidden md:block">
//                 <CartPreview
//                   show={showCartPreview}
//                   cartCount={cartCount}
//                   onViewCart={onCartClick}
//                   onMouseEnter={handleCartMouseEnter}
//                   onMouseLeave={handleCartMouseLeave}
//                 />
//               </div>
//             </div>

//             {/* CTA — hidden on very small screens, shown from sm up */}
//             <a
//               href="/login"
//               className="relative hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 md:px-7 md:py-3 bg-[#2c2c2c] text-white text-[10px] md:text-[11px] font-light tracking-[0.15em] no-underline rounded overflow-hidden group ml-1 md:ml-3"
//             >
//               <span className="relative z-10">GET STARTED</span>
//               <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
//               <div className="absolute inset-0 bg-gradient-to-r from-[#c9a882] to-[#b89b7b] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400" />
//               <div className="absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/12 to-transparent animate-[shimmer_3s_infinite_1s]" />
//             </a>

//             {/* Hamburger — mobile only */}
//             <button
//               className={`md:hidden flex flex-col justify-center items-center gap-[5px] p-2 ml-1 ${mobileMenuOpen ? "ham-open" : ""}`}
//               onClick={() => setMobileMenuOpen((o) => !o)}
//               aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
//               aria-expanded={mobileMenuOpen}
//               style={{ minWidth: 40, minHeight: 40 }}
//             >
//               <span className="ham-line" />
//               <span className="ham-line" />
//               <span className="ham-line" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* ── MOBILE DRAWER ── */}
//       {mobileMenuOpen && (
//         <>
//           {/* Overlay */}
//           <div
//             className="mobile-overlay"
//             onClick={() => setMobileMenuOpen(false)}
//             aria-hidden="true"
//           />

//           {/* Drawer */}
//           <div className="mobile-drawer" role="dialog" aria-label="Navigation menu">

//             {/* Drawer header */}
//             <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0e7db]">
//               <img src={MK} alt="mk-logo" className="h-8 w-16 object-contain" />
//               <button
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e8d9c8] text-[#888] hover:text-[#2c2c2c] hover:border-[#b89b7b] transition-all"
//                 aria-label="Close menu"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Nav links */}
//             <nav className="flex flex-col py-2">
//               {navLinks.map(({ label, href }) => (
//                 <a
//                   key={href}
//                   href={href}
//                   className={`mobile-nav-link ${activePath === href ? "active" : ""}`}
//                   onClick={() => { setActivePath(href); setMobileMenuOpen(false); }}
//                 >
//                   {label}
//                   <span className="arrow">→</span>
//                 </a>
//               ))}
//             </nav>

//             {/* Divider */}
//             <div className="mx-6 my-2 h-px bg-[#f0e7db]" />

//             {/* Wishlist & Cart quick links */}
//             <div className="px-6 py-3 space-y-2">
//               <button
//                 onClick={() => { window.location.href = "/wishlist"; setMobileMenuOpen(false); }}
//                 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#f0e7db] text-[#6b6b6b] text-sm hover:border-[#b89b7b] hover:text-[#b89b7b] transition-all"
//               >
//                 <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                   <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//                 <span style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.1em", fontSize: 11 }}>WISHLIST</span>
//                 {wishlistCount > 0 && (
//                   <span className="ml-auto bg-[#b89b7b] text-white text-[10px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1">
//                     {wishlistCount}
//                   </span>
//                 )}
//               </button>

//               <button
//                 onClick={() => { onCartClick?.(); setMobileMenuOpen(false); }}
//                 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#f0e7db] text-[#6b6b6b] text-sm hover:border-[#b89b7b] hover:text-[#b89b7b] transition-all"
//               >
//                 <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                   <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 <span style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.1em", fontSize: 11 }}>CART</span>
//                 {cartCount > 0 && (
//                   <span className="ml-auto bg-[#b89b7b] text-white text-[10px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* CTA */}
//             <div className="px-6 mt-2 mb-6">
//               <a
//                 href="/login"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className="block w-full text-center py-3.5 bg-[#2c2c2c] text-white rounded-xl hover:bg-[#b89b7b] transition-colors duration-300 overflow-hidden relative group"
//                 style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: "0.15em" }}
//               >
//                 GET STARTED →
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#c9a882] to-[#b89b7b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 <span className="relative z-10">GET STARTED →</span>
//               </a>
//             </div>

//             {/* Footer note */}
//             <div className="mt-auto px-6 pb-8 pt-4 border-t border-[#f5efe8]">
//               <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "#aaa", letterSpacing: "0.08em" }}>
//                 Clean beauty. Curated for you.
//               </p>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// /* ═══════════════════════════════════════════
//    CART PREVIEW COMPONENT
// ═══════════════════════════════════════════ */
// const CartPreview = ({ show, cartCount, onViewCart, onMouseEnter, onMouseLeave }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [total, setTotal]         = useState(0);

//   useEffect(() => {
//     if (!show) return;
//     try {
//       /* session-only cart — reads from sessionStorage */
//       const raw = sessionStorage.getItem("gm_cart") || sessionStorage.getItem("cart") || "[]";
//       const items = JSON.parse(raw).map((item) => ({
//         ...item,
//         price: Number(item.price),
//         image: item.image || item.image_url || "",
//       }));
//       setCartItems(items.slice(0, 3));
//       setTotal(items.reduce((s, i) => s + i.price * (i.quantity || 1), 0));
//     } catch {
//       setCartItems([]);
//       setTotal(0);
//     }
//   }, [show]);

//   const FREE_SHIP_THRESHOLD = 10000;

//   /* Empty cart state */
//   if (cartCount === 0) {
//     return (
//       <div
//         className={`cart-preview-panel ${show ? "visible" : "hidden"}`}
//         onMouseEnter={onMouseEnter}
//         onMouseLeave={onMouseLeave}
//       >
//         <div className="p-8 text-center">
//           <svg className="w-14 h-14 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="#e2d5c5" strokeWidth="1.2">
//             <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//           </svg>
//           <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 300, color: "#2c2c2c", marginBottom: 4 }}>
//             Your cart is empty
//           </p>
//           <p style={{ fontSize: 12, color: "#aaa" }}>Start shopping to add items</p>
//         </div>
//       </div>
//     );
//   }

//   const remaining = FREE_SHIP_THRESHOLD - total;

//   return (
//     <div
//       className={`cart-preview-panel ${show ? "visible" : "hidden"}`}
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//     >
//       {/* Header */}
//       <div className="px-5 py-4 border-b border-[#f0e7db]">
//         <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: "#2c2c2c" }}>
//           Cart Summary
//         </h3>
//         <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
//           {cartCount} {cartCount === 1 ? "item" : "items"}
//         </p>
//       </div>

//       {/* Items */}
//       <div style={{ maxHeight: 280, overflowY: "auto" }} className="px-3 py-2">
//         {cartItems.map((item) => (
//           <div key={item.id} className="flex items-center gap-3 py-3 border-b border-[#f9f1e8] last:border-0">
//             <div className="w-12 h-12 bg-[#faf7f2] rounded-lg overflow-hidden flex-shrink-0">
//               {item.image ? (
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
//               )}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p style={{ fontSize: 13, fontWeight: 500, color: "#2c2c2c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                 {item.name}
//               </p>
//               <p style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{item.brand || ""}</p>
//               <div className="flex items-center justify-between mt-1">
//                 <span style={{ fontSize: 13, color: "#b89b7b", fontFamily: "'Cormorant Garamond', serif" }}>
//                   KES {Number(item.price).toFixed(2)}
//                 </span>
//                 <span style={{ fontSize: 11, color: "#bbb" }}>× {item.quantity || 1}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//         {cartCount > 3 && (
//           <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", padding: "8px 0" }}>
//             +{cartCount - 3} more {cartCount - 3 === 1 ? "item" : "items"}
//           </p>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="px-5 py-4 border-t border-[#f0e7db]" style={{ background: "rgba(250,247,242,0.5)" }}>
//         {/* Subtotal */}
//         <div className="flex items-center justify-between mb-3">
//           <span style={{ fontSize: 13, color: "#6b6b6b" }}>Subtotal</span>
//           <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: "#2c2c2c" }}>
//             KES {Number(total).toFixed(2)}
//           </span>
//         </div>

//         {/* Action buttons */}
//         <div className="space-y-2 mb-3">
//           <button
//             onClick={onViewCart}
//             className="w-full py-3 bg-[#2c2c2c] text-white rounded-lg hover:bg-[#b89b7b] transition-colors duration-300"
//             style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: "0.15em" }}
//           >
//             VIEW FULL CART
//           </button>
//           <button
//             onClick={onViewCart}
//             className="w-full py-2.5 border border-[#b89b7b] text-[#b89b7b] rounded-lg hover:bg-[#b89b7b] hover:text-white transition-colors duration-300"
//             style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: "0.15em" }}
//           >
//             CHECKOUT NOW
//           </button>
//         </div>

//         {/* Free shipping progress */}
//         {remaining > 0 ? (
//           <div>
//             <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginBottom: 6 }}>
//               Add{" "}
//               <span style={{ color: "#b89b7b", fontWeight: 500 }}>
//                 KES {remaining.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
//               </span>{" "}
//               more for free shipping
//             </p>
//             <div style={{ width: "100%", height: 3, background: "#f0e7db", borderRadius: 2, overflow: "hidden" }}>
//               <div
//                 style={{
//                   height: "100%",
//                   width: `${Math.min((total / FREE_SHIP_THRESHOLD) * 100, 100)}%`,
//                   background: "linear-gradient(90deg, #c9a882, #b89b7b)",
//                   borderRadius: 2,
//                   transition: "width 0.4s ease",
//                 }}
//               />
//             </div>
//           </div>
//         ) : (
//           <p style={{ fontSize: 11, color: "#2e7d32", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
//             <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//             </svg>
//             You qualify for FREE shipping!
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

// components/navbar.jsx
import { useState, useEffect, useRef } from "react";
import { useCart } from "../hooks/usecart"; // ✅ Changed to your actual hook path
import MK from "../assets/ro.png";
import { getProducts } from "../api";

const navLinks = [
  { label: "HOME", href: "/home" },
  { label: "COLLECTIONS", href: "/stocks" },
  { label: "ABOUT", href: "/about" },
  { label: "JOURNAL", href: "/blogs" },
];

// Helper functions for offers
const isDiscountActive = (product) => {
  const discountPercent = Number(product.discount_percent) || 0;
  const discountExpiry = product.discount_expiry;
  
  if (discountPercent <= 0) return false;
  if (!discountExpiry) return false;
  
  const expiryDate = new Date(discountExpiry);
  return expiryDate > new Date();
};

const getCurrentPrice = (product) => {
  const price = Number(product.price) || 0;
  const discountPercent = Number(product.discount_percent) || 0;
  
  if (isDiscountActive(product)) {
    return price * (1 - discountPercent / 100);
  }
  return price;
};

const calculateSavings = (product) => {
  const originalPrice = Number(product.price) || 0;
  const currentPrice = getCurrentPrice(product);
  return originalPrice - currentPrice;
};

const getBestOffers = (products) => {
  const activeDiscounts = products.filter(p => {
    const discountPercent = Number(p.discount_percent) || 0;
    return discountPercent > 0 && isDiscountActive(p);
  });
  
  return activeDiscounts
    .sort((a, b) => Number(b.discount_percent) - Number(a.discount_percent))
    .slice(0, 2);
};

const getExpiringOffers = (products) => {
  const activeDiscounts = products.filter(p => {
    const discountPercent = Number(p.discount_percent) || 0;
    return discountPercent > 0 && isDiscountActive(p);
  });
  
  return activeDiscounts
    .map(p => ({
      ...p,
      daysLeft: Math.ceil((new Date(p.discount_expiry) - new Date()) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);
};

function Navbar({ onCartClick, wishlistCount = 0 }) {
  // ✅ Use your actual hook - get cartCount directly
  const { cartCount, openCart } = useCart();
  
  const [activePath, setActivePath] = useState("/home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertMessages, setAlertMessages] = useState([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const carouselIntervalRef = useRef(null);

  // Listen for cart cleared event
  useEffect(() => {
    const handleCartCleared = () => {
      console.log('Cart cleared event received');
    };
    
    window.addEventListener('cartCleared', handleCartCleared);
    return () => window.removeEventListener('cartCleared', handleCartCleared);
  }, []);

  // Fetch dynamic offers from database
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoadingAlerts(true);
        
        const productsRes = await getProducts({ page_size: 500 });
        const products = productsRes.data?.results || productsRes.data || [];
        
        const alerts = [];
        
        // 1. Get best offers (top 2)
        const bestOffers = getBestOffers(products);
        
        if (bestOffers.length > 0) {
          const bestOffer = bestOffers[0];
          const secondBest = bestOffers[1];
          
          let message = "";
          if (bestOffers.length === 1) {
            message = `${bestOffer.name} - ${bestOffer.discount_percent}% OFF! Save KES ${calculateSavings(bestOffer).toLocaleString()}`;
          } else {
            message = `${bestOffer.name} (${bestOffer.discount_percent}% OFF) & ${secondBest.name} (${secondBest.discount_percent}% OFF)`;
          }
          
          alerts.push({
            id: "best-offers",
            icon: "🏆",
            title: "BEST OFFERS",
            message: message,
            highlight: "Shop Now",
            bgGradient: "from-amber-700 to-orange-800",
            buttonText: "View Offers →",
            type: "best-offers",
            priority: 1
          });
        }
        
        // 2. Get expiring offers (nearest to expiry)
        const expiringOffers = getExpiringOffers(products);
        const soonestExpiring = expiringOffers[0];
        
        if (soonestExpiring && soonestExpiring.daysLeft <= 7) {
          const daysLeft = soonestExpiring.daysLeft;
          const isUrgent = daysLeft <= 2;
          
          alerts.push({
            id: `expiring-offer-${soonestExpiring.id}`,
            icon: isUrgent ? "🔥" : "⏰",
            title: isUrgent ? "URGENT: OFFER ENDING" : "OFFER EXPIRING SOON",
            message: `${soonestExpiring.name} - ${soonestExpiring.discount_percent}% OFF ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`,
            highlight: `${daysLeft} Days Left`,
            bgGradient: isUrgent ? "from-red-700 to-rose-800" : "from-orange-700 to-red-800",
            buttonText: "Grab Deal →",
            type: "expiring-offer",
            priority: 2
          });
        }
        
        // 3. Low stock alert
        const lowStockProducts = products.filter(p => {
          const stock = Number(p.stock) || 0;
          return stock > 0 && stock < 10;
        }).sort((a, b) => Number(a.stock) - Number(b.stock));
        
        if (lowStockProducts.length > 0) {
          const lowestStock = lowStockProducts[0];
          alerts.push({
            id: "low-stock-alert",
            icon: "⚠️",
            title: "LOW STOCK ALERT",
            message: `Only ${lowestStock.stock} units left of ${lowestStock.name}! Order now before it's gone.`,
            highlight: "Hurry!",
            bgGradient: "from-yellow-700 to-orange-800",
            buttonText: "Get yours NOW!!! →",
            type: "low-stock",
            priority: 3
          });
        }
        
        // 4. Out of stock alert
        const outOfStockProducts = products.filter(p => (Number(p.stock) || 0) === 0);
        if (outOfStockProducts.length > 0) {
          alerts.push({
            id: "outofstock-alert",
            icon: "🚫",
            title: "OUT OF STOCK",
            message: `${outOfStockProducts.length} product(s) are out of stock. Restock needed!`,
            highlight: "Restock Now",
            bgGradient: "from-red-700 to-red-800",
            buttonText: "View Inventory →",
            type: "out-of-stock",
            priority: 4
          });
        }
        
        // 5. Expiring products alert
        const today = new Date();
        const expiringProducts = products.filter(p => {
          if (p.expiry_date) {
            const daysLeft = Math.ceil((new Date(p.expiry_date) - today) / (1000 * 60 * 60 * 24));
            return daysLeft > 0 && daysLeft <= 30;
          }
          return false;
        }).sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));
        
        if (expiringProducts.length > 0) {
          const soonestExpiry = expiringProducts[0];
          const daysLeft = Math.ceil((new Date(soonestExpiry.expiry_date) - today) / (1000 * 60 * 60 * 24));
          
          if (daysLeft <= 7) {
            alerts.push({
              id: "expiring-products",
              icon: "📅",
              title: "PRODUCTS EXPIRING SOON",
              message: `${soonestExpiry.name} expires in ${daysLeft} days. Run a promotion or mark down!`,
              highlight: `${daysLeft} Days Left`,
              bgGradient: "from-purple-700 to-pink-800",
              buttonText: "Take Action →",
              type: "expiring-products",
              priority: 5
            });
          }
        }
        
        // 6. Free shipping threshold
        alerts.push({
          id: "free-shipping",
          icon: "🚚",
          title: "FREE SHIPPING",
          message: "Enjoy free delivery on all orders above KES 15,000 anywhere in Kenya!",
          highlight: "KES 15,000+",
          bgGradient: "from-green-700 to-teal-800",
          buttonText: "Shop Now →",
          type: "shipping",
          priority: 6
        });
        
        alerts.sort((a, b) => a.priority - b.priority);
        setAlertMessages(alerts.length > 0 ? alerts : [
          {
            id: "default",
            icon: "✨",
            title: "WELCOME",
            message: "Discover clean, effective products for your wellness journey!",
            highlight: "Shop Now",
            bgGradient: "from-amber-700 to-orange-800",
            buttonText: "Explore →",
            type: "default",
            priority: 10
          }
        ]);
        
      } catch (error) {
        console.error("Error fetching offers:", error);
        setAlertMessages([
          {
            id: "fallback",
            icon: "🚚",
            title: "FREE SHIPPING",
            message: "Enjoy free delivery on all orders above KES 15,000 anywhere in Kenya!",
            highlight: "KES 15,000+",
            bgGradient: "from-amber-700 to-orange-800",
            buttonText: "Shop Now →",
            type: "shipping"
          }
        ]);
      } finally {
        setLoadingAlerts(false);
      }
    };
    
    fetchOffers();
  }, []);

  useEffect(() => {
    setActivePath(window.location.pathname);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current);
    };
  }, []);

  // Start carousel
  useEffect(() => {
    if (alertMessages.length === 0) return;
    
    if (!isPaused) {
      carouselIntervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentAlertIndex((prev) => (prev + 1) % alertMessages.length);
          setIsTransitioning(false);
        }, 400);
      }, 6000);
    }
    
    return () => {
      if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current);
    };
  }, [isPaused, alertMessages.length]);

  const handleManualNavigation = (direction) => {
    if (alertMessages.length === 0) return;
    
    setIsPaused(true);
    setIsTransitioning(true);
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentAlertIndex((prev) => (prev + 1) % alertMessages.length);
      } else {
        setCurrentAlertIndex((prev) => (prev - 1 + alertMessages.length) % alertMessages.length);
      }
      setIsTransitioning(false);
    }, 400);
    
    setTimeout(() => setIsPaused(false), 10000);
  };

  if (loadingAlerts || alertMessages.length === 0) {
    return (
      <>
        <div className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#2c2418] to-[#1f1a12] h-12 animate-pulse"></div>
        <nav className="font-['Jost'] sticky top-[62px] md:top-[70px] z-50 bg-[rgba(255,252,249,0.96)] backdrop-blur-md border-b border-[#f0e7db]">
          <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 py-3 md:py-4 max-w-7xl mx-auto">
            <a href="/home" className="flex items-center flex-shrink-0">
              <img src={MK} alt="Glowmart Logo" className="h-10 w-auto md:h-12 lg:h-14 object-contain" />
            </a>
          </div>
        </nav>
      </>
    );
  }

  const currentAlert = alertMessages[currentAlertIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@200;300;400;600;700&display=swap');

        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        @keyframes shimmer {
          0%       { left: -75%; }
          40%, 100% { left: 125%; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 5px rgba(184, 155, 123, 0.3); }
          50% { box-shadow: 0 0 20px rgba(184, 155, 123, 0.6); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }

        .float-animation { animation: float 3s ease-in-out infinite; }
        .pulse-animation { animation: pulse 2s ease-in-out infinite; }
        .hover-glow:hover { animation: glowPulse 0.5s ease; }
      `}</style>

      {/* TOP ALERT CAROUSEL */}
      <div className="sticky top-0 z-40 w-full overflow-hidden bg-gradient-to-r from-[#2c2418] to-[#1f1a12] border-b border-[#b89b7b]/30 shadow-lg">
        <div className="relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #e8d4b5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          
          <div className="relative px-4 py-2 md:py-2.5">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => handleManualNavigation('prev')}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-[#b89b7b]/20 hover:bg-[#b89b7b]/40 transition-all flex items-center justify-center group hover:scale-110"
                >
                  <svg className="w-4 h-4 text-[#e8d4b5] group-hover:translate-x-[-2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex-1 overflow-hidden">
                  <div key={currentAlert.id} className="transition-all duration-400 ease-out">
                    <div className="flex items-center justify-between flex-wrap gap-2 md:gap-4">
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 float-animation">
                          <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#b89b7b]/30 to-[#e8d4b5]/20 rounded-full flex items-center justify-center shadow-inner ${currentAlert.type === 'best-offers' ? 'pulse-animation' : ''}`}>
                            <span className="text-lg md:text-xl">{currentAlert.icon}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] md:text-xs font-bold text-[#e8d4b5] uppercase tracking-wider bg-[#b89b7b]/30 px-2 py-0.5 rounded-full shadow-sm ${currentAlert.type === 'expiring-offer' ? 'animate-pulse' : ''}`}>
                              {currentAlert.title}
                            </span>
                            <p className="text-[11px] md:text-sm text-[#e8d4b5]/95 truncate font-medium">
                              {currentAlert.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                        <div className={`bg-gradient-to-r ${currentAlert.bgGradient} px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer`}>
                          <span className="text-[10px] md:text-xs font-bold text-white whitespace-nowrap">
                            {currentAlert.highlight}
                          </span>
                        </div>
                        <a 
                          href={currentAlert.type === 'low-stock' || currentAlert.type === 'out-of-stock' ? "/stocks" : "/stocks"} 
                          className="hidden sm:flex items-center gap-1.5 text-[#e8d4b5] hover:text-white transition-all text-[11px] md:text-xs font-semibold group hover-glow px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
                        >
                          <span>{currentAlert.buttonText}</span>
                          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleManualNavigation('next')}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-[#b89b7b]/20 hover:bg-[#b89b7b]/40 transition-all flex items-center justify-center group hover:scale-110"
                >
                  <svg className="w-4 h-4 text-[#e8d4b5] group-hover:translate-x-[2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="max-w-7xl mx-auto mt-1.5 md:mt-2">
                <div className="w-full h-1 bg-[#b89b7b]/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#e8d4b5] to-[#b89b7b] rounded-full transition-all duration-[6000ms] linear"
                    style={{ width: isTransitioning ? '0%' : '100%' }}
                  />
                </div>
              </div>

              <div className="flex justify-center gap-1.5 mt-1.5">
                {alertMessages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsPaused(true);
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentAlertIndex(idx);
                        setIsTransitioning(false);
                      }, 400);
                      setTimeout(() => setIsPaused(false), 10000);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentAlertIndex 
                        ? 'w-5 h-1.5 bg-[#e8d4b5]' 
                        : 'w-1.5 h-1.5 bg-[#b89b7b]/50 hover:bg-[#b89b7b]/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`font-['Jost'] sticky top-[62px] md:top-[70px] z-50 bg-[rgba(255,252,249,0.96)] backdrop-blur-md border-b border-[#f0e7db] transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_30px_rgba(184,155,123,0.1)]" : ""
        }`}
      >
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 py-3 md:py-4 max-w-7xl mx-auto">
          
          {/* Logo */}
          <a href="/home" className="flex items-center flex-shrink-0">
            <img 
              src={MK} 
              alt="Glowmart Logo" 
              className="h-10 w-auto md:h-12 lg:h-14 object-contain transition-all duration-300 hover:opacity-90" 
            />
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`relative text-xs tracking-[0.15em] pb-1 transition-colors duration-250 ${
                    activePath === href
                      ? "text-[#2c2c2c] font-normal after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-[#b89b7b]"
                      : "text-[#888] hover:text-[#2c2c2c] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-[#b89b7b] after:transition-all after:duration-300 hover:after:w-full"
                  }`}
                  onClick={() => setActivePath(href)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Wishlist */}
            <button
              className="relative p-2 hover:scale-105 transition-transform duration-200 group touch-target"
              onClick={() => (window.location.href = "/wishlist")}
              aria-label="Wishlist"
              style={{ minWidth: 40, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg className="w-5 h-5 stroke-[#2c2c2c] stroke-[1.5] fill-none group-hover:stroke-[#b89b7b] transition-all" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b89b7b] text-white text-[10px] font-normal min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-[2px] animate-[badgePop_0.3s_ease]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart - Opens the cart sidebar */}
            <div className="relative">
              <button
                className="relative p-2 hover:scale-105 transition-transform duration-200 group"
                onClick={openCart}
                aria-label="Cart"
                style={{ minWidth: 40, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg className="w-5 h-5 stroke-[#2c2c2c] stroke-[1.5] fill-none group-hover:stroke-[#b89b7b] transition-all" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#b89b7b] text-white text-[10px] font-normal min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-[2px] animate-[badgePop_0.3s_ease]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* CTA Button */}
            <a
              href="/login"
              className="relative hidden sm:inline-flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 bg-[#2c2c2c] text-white text-[10px] md:text-[11px] font-light tracking-[0.15em] no-underline rounded-full overflow-hidden group ml-1 hover-glow"
            >
              <span className="relative z-10">GET STARTED</span>
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#c9a882] to-[#b89b7b] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400" />
              <div className="absolute top-0 left-[-75%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/12 to-transparent animate-[shimmer_3s_infinite_1s]" />
            </a>

            {/* Hamburger */}
            <button
              className={`md:hidden flex flex-col justify-center items-center gap-[5px] p-2 ml-1 ${mobileMenuOpen ? "ham-open" : ""}`}
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              style={{ minWidth: 40, minHeight: 40 }}
            >
              <span className="ham-line" />
              <span className="ham-line" />
              <span className="ham-line" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-drawer" role="dialog" aria-label="Navigation menu">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0e7db]">
              <img src={MK} alt="Glowmart Logo" className="h-10 w-auto object-contain" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e8d9c8] text-[#888] hover:text-[#2c2c2c] hover:border-[#b89b7b] transition-all"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col py-2">
              {navLinks.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className={`mobile-nav-link ${activePath === href ? "active" : ""}`}
                  onClick={() => { setActivePath(href); setMobileMenuOpen(false); }}
                >
                  {label}
                  <span className="arrow">→</span>
                </a>
              ))}
            </nav>
            <div className="mx-6 my-2 h-px bg-[#f0e7db]" />
            <div className="px-6 py-3 space-y-2">
              <button
                onClick={() => { window.location.href = "/wishlist"; setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#f0e7db] text-[#6b6b6b] text-sm hover:border-[#b89b7b] hover:text-[#b89b7b] transition-all"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.1em", fontSize: 11 }}>WISHLIST</span>
                {wishlistCount > 0 && (
                  <span className="ml-auto bg-[#b89b7b] text-white text-[10px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { onCartClick?.(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#f0e7db] text-[#6b6b6b] text-sm hover:border-[#b89b7b] hover:text-[#b89b7b] transition-all"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.1em", fontSize: 11 }}>CART</span>
                {cartCount > 0 && (
                  <span className="ml-auto bg-[#b89b7b] text-white text-[10px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
            <div className="px-6 mt-2 mb-6">
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3.5 bg-[#2c2c2c] text-white rounded-xl hover:bg-[#b89b7b] transition-colors duration-300 overflow-hidden relative group"
                style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: "0.15em" }}
              >
                <span className="relative z-10">GET STARTED →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#c9a882] to-[#b89b7b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
            <div className="mt-auto px-6 pb-8 pt-4 border-t border-[#f5efe8]">
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "#aaa", letterSpacing: "0.08em" }}>
                Clean beauty. Curated for you.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Add styles
if (typeof document !== 'undefined') {
  const styles = `
    .ham-line {
      display: block;
      width: 22px;
      height: 1.5px;
      background: #2c2c2c;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      transform-origin: center;
    }
    .ham-open .ham-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    .ham-open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .ham-open .ham-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
    
    .mobile-drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: min(320px, 85vw);
      background: #fffcf9;
      box-shadow: -8px 0 40px rgba(44,44,44,0.12);
      z-index: 200;
      display: flex;
      flex-direction: column;
      animation: slideInRight 0.32s cubic-bezier(0.4,0,0.2,1);
      overflow-y: auto;
    }
    .mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(44,44,44,0.38);
      z-index: 199;
      animation: fadeIn 0.22s ease;
      backdrop-filter: blur(2px);
    }
    .mobile-nav-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      font-family: 'Jost', sans-serif;
      font-size: 11px;
      letter-spacing: 0.18em;
      color: #888;
      text-decoration: none;
      border-bottom: 1px solid #f5efe8;
      transition: color 0.2s, background 0.2s;
    }
    .mobile-nav-link:hover,
    .mobile-nav-link.active { color: #2c2c2c; background: #faf7f2; }
    .mobile-nav-link.active { color: #b89b7b; }
    .mobile-nav-link .arrow {
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.2s;
      font-size: 14px;
      color: #b89b7b;
    }
    .mobile-nav-link:hover .arrow,
    .mobile-nav-link.active .arrow { opacity: 1; transform: translateX(0); }
    
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to   { transform: translateX(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `;
  
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Navbar;