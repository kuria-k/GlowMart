// import { useState } from "react";
// import Navbar from "../components/navbar";
// import Footer from "../components/footer";
// import CartSidebar from "../components/CartSidebar";
// import { useCart } from "../hooks/useCart";
// import { useWishlist } from "../hooks/useWishlist";

// const VALUES = [
//   {
//     num: "01",
//     title: "One Roof",
//     body: "Every supplement you need, sourced and verified, in a single elegant destination. No more searching.",
//   },
//   {
//     num: "02",
//     title: "Clean Standards",
//     body: "Every product passes a rigorous review. If it doesn't meet our standard for quality and purity, it doesn't make the shelf.",
//   },
//   {
//     num: "03",
//     title: "Transparent Always",
//     body: "Full ingredient lists, supplier origins, and honest descriptions — because you deserve to know exactly what you're putting in your body.",
//   },
//   {
//     num: "04",
//     title: "Effortless Access",
//     body: "We handle the research so you don't have to. Browse with confidence, knowing every product has been carefully curated for you.",
//   },
// ];

// const STATS = [
//   { value: "200+", label: "Curated Products" },
//   { value: "2025", label: "Year Founded" },
//   { value: "100%", label: "Clean Formulas" },
//   { value: "1",    label: "Roof for All" },
// ];

// export default function About() {
//   const [hovered, setHovered] = useState(null);
//   const [isCartOpen, setIsCartOpen] = useState(false);

//   const { cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
//   const { wishlist } = useWishlist();

//   return (
//     <>
//       <Navbar
//         cartCount={cartCount}
//         onCartClick={() => setIsCartOpen(true)}
//         wishlistCount={wishlist.length}
//       />

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300&family=Jost:wght@200;300;400&display=swap');
        
//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .ab-root {
//           background: #faf7f2;
//           font-family: 'Jost', sans-serif;
//           color: #2c2c2c;
//           padding-top: 0;
//         }

//         /* ── HERO ── */
//         .ab-hero {
//           min-height: 90vh;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//           padding: 140px 40px 100px;
//           position: relative;
//           overflow: hidden;
//           border-bottom: 1px solid #e3e3b8;
//         }

//         .ab-hero-bg {
//           position: absolute;
//           inset: 0;
//           pointer-events: none;
//         }

//         .ab-eyebrow {
//           font-size: 10px;
//           letter-spacing: 0.35em;
//           color: #b89b7b;
//           font-weight: 300;
//           margin-bottom: 32px;
//           display: flex;
//           align-items: center;
//           gap: 14px;
//         }

//         .ab-eyebrow::before,
//         .ab-eyebrow::after {
//           content: '';
//           display: block;
//           width: 36px;
//           height: 1px;
//           background: #b89b7b;
//           opacity: 0.5;
//         }

//         .ab-hero-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(52px, 8vw, 108px);
//           font-weight: 200;
//           line-height: 0.95;
//           letter-spacing: -0.02em;
//           color: #2c2c2c;
//           margin-bottom: 36px;
//         }

//         .ab-hero-title em {
//           font-style: italic;
//           color: #b89b7b;
//           font-weight: 200;
//         }

//         .ab-hero-sub {
//           font-size: 14px;
//           font-weight: 300;
//           color: #9a8c7e;
//           line-height: 1.9;
//           max-width: 460px;
//           letter-spacing: 0.02em;
//           margin-bottom: 48px;
//         }

//         .ab-hero-cta {
//           display: inline-flex;
//           align-items: center;
//           gap: 10px;
//           padding: 13px 30px;
//           background: #2c2c2c;
//           color: white;
//           font-size: 10px;
//           letter-spacing: 0.2em;
//           font-weight: 300;
//           text-decoration: none;
//           transition: background 0.3s ease;
//           position: relative;
//           z-index: 1;
//         }

//         .ab-hero-cta:hover { background: #b89b7b; }

//         /* ── STATS ── */
//         .ab-stats {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           border-bottom: 1px solid #f0e7db;
//           background: white;
//         }

//         .ab-stat {
//           padding: 36px 20px;
//           text-align: center;
//           border-right: 1px solid #f0e7db;
//         }
//         .ab-stat:last-child { border-right: none; }

//         .ab-stat-val {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 40px;
//           font-weight: 300;
//           color: #2c2c2c;
//           letter-spacing: -0.02em;
//           line-height: 1;
//           margin-bottom: 8px;
//         }

//         .ab-stat-label {
//           font-size: 9px;
//           letter-spacing: 0.22em;
//           color: #b89b7b;
//           font-weight: 300;
//           text-transform: uppercase;
//         }

//         /* ── STORY ── */
//         .ab-section {
//           max-width: 1100px;
//           margin: 0 auto;
//           padding: 0 48px;
//         }

//         .ab-story {
//           padding: 100px 0;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 80px;
//           align-items: center;
//           border-bottom: 1px solid #f0e7db;
//         }

//         .ab-story-left {}

//         .ab-section-label {
//           font-size: 9px;
//           letter-spacing: 0.35em;
//           color: #b89b7b;
//           font-weight: 300;
//           margin-bottom: 20px;
//           display: block;
//         }

//         .ab-story-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(34px, 3.5vw, 50px);
//           font-weight: 300;
//           color: #2c2c2c;
//           line-height: 1.1;
//           letter-spacing: -0.02em;
//           margin-bottom: 28px;
//         }

//         .ab-story-title em {
//           font-style: italic;
//           color: #b89b7b;
//         }

//         .ab-story-line {
//           width: 48px;
//           height: 1px;
//           background: linear-gradient(90deg, #b89b7b, transparent);
//           margin-bottom: 28px;
//         }

//         .ab-story-body {
//           font-size: 14px;
//           font-weight: 300;
//           color: #7a6e64;
//           line-height: 1.95;
//           letter-spacing: 0.02em;
//         }

//         .ab-story-body + .ab-story-body {
//           margin-top: 16px;
//         }

//         /* Story visual */
//         .ab-story-right {
//           display: flex;
//           flex-direction: column;
//           gap: 2px;
//         }

//         .ab-story-card {
//           background: white;
//           border: 1px solid #f0e7db;
//           padding: 28px 28px;
//           display: flex;
//           align-items: flex-start;
//           gap: 18px;
//           transition: border-color 0.3s ease, box-shadow 0.3s ease;
//           cursor: default;
//         }

//         .ab-story-card:hover {
//           border-color: rgba(184,155,123,0.4);
//           box-shadow: 0 8px 32px rgba(184,155,123,0.08);
//         }

//         .ab-story-card-num {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 13px;
//           font-weight: 300;
//           color: #d4c4b0;
//           letter-spacing: 0.05em;
//           flex-shrink: 0;
//           margin-top: 2px;
//         }

//         .ab-story-card-title {
//           font-size: 13px;
//           font-weight: 400;
//           color: #2c2c2c;
//           letter-spacing: 0.08em;
//           margin-bottom: 5px;
//         }

//         .ab-story-card-body {
//           font-size: 12px;
//           font-weight: 300;
//           color: #9a8c7e;
//           line-height: 1.7;
//           letter-spacing: 0.02em;
//         }

//         /* ── VALUES ── */
//         .ab-values {
//           padding: 100px 0;
//           border-bottom: 1px solid #f0e7db;
//         }

//         .ab-values-header {
//           margin-bottom: 52px;
//         }

//         .ab-values-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(32px, 3.5vw, 48px);
//           font-weight: 300;
//           color: #2c2c2c;
//           letter-spacing: -0.02em;
//           margin-top: 10px;
//         }

//         .ab-values-title em {
//           font-style: italic;
//           color: #b89b7b;
//         }

//         .ab-values-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 1px;
//           background: #f0e7db;
//           border: 1px solid #f0e7db;
//         }

//         .ab-val {
//           background: #faf7f2;
//           padding: 36px 28px;
//           transition: background 0.3s ease;
//           cursor: default;
//         }

//         .ab-val:hover { background: white; }

//         .ab-val-num {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 11px;
//           color: #d4c4b0;
//           letter-spacing: 0.1em;
//           margin-bottom: 24px;
//           display: block;
//         }

//         .ab-val-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 20px;
//           font-weight: 400;
//           color: #2c2c2c;
//           margin-bottom: 12px;
//           letter-spacing: -0.01em;
//         }

//         .ab-val-body {
//           font-size: 12px;
//           font-weight: 300;
//           color: #9a8c7e;
//           line-height: 1.8;
//           letter-spacing: 0.02em;
//         }

//         .ab-val-line {
//           width: 0;
//           height: 1px;
//           background: #b89b7b;
//           margin-top: 20px;
//           transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
//         }

//         .ab-val:hover .ab-val-line { width: 32px; }

//         /* ── CLOSING CTA ── */
//         .ab-closing {
//           padding: 100px 0;
//           text-align: center;
//         }

//         .ab-closing-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(36px, 5vw, 68px);
//           font-weight: 200;
//           color: #2c2c2c;
//           line-height: 1.05;
//           letter-spacing: -0.02em;
//           margin-bottom: 20px;
//         }

//         .ab-closing-title em {
//           font-style: italic;
//           color: #b89b7b;
//         }

//         .ab-closing-sub {
//           font-size: 13px;
//           font-weight: 300;
//           color: #9a8c7e;
//           letter-spacing: 0.03em;
//           line-height: 1.85;
//           max-width: 380px;
//           margin: 0 auto 40px;
//         }

//         .ab-closing-btns {
//           display: flex;
//           gap: 12px;
//           justify-content: center;
//           flex-wrap: wrap;
//         }

//         .ab-btn-dark {
//           padding: 13px 30px;
//           background: #2c2c2c;
//           color: white;
//           font-size: 10px;
//           letter-spacing: 0.2em;
//           font-weight: 300;
//           text-decoration: none;
//           transition: background 0.3s ease;
//           position: relative;
//           overflow: hidden;
//         }

//         .ab-btn-dark:hover { background: #b89b7b; }

//         .ab-btn-outline {
//           padding: 13px 30px;
//           border: 1px solid #e0d5c8;
//           color: #2c2c2c;
//           font-size: 10px;
//           letter-spacing: 0.2em;
//           font-weight: 300;
//           text-decoration: none;
//           transition: border-color 0.3s, color 0.3s;
//         }

//         .ab-btn-outline:hover { border-color: #b89b7b; color: #b89b7b; }

//         @media (max-width: 860px) {
//           .ab-hero { padding: 120px 24px 80px; }
//           .ab-story { grid-template-columns: 1fr; gap: 48px; }
//           .ab-stats { grid-template-columns: repeat(2,1fr); }
//           .ab-stat:nth-child(2) { border-right: none; }
//           .ab-values-grid { grid-template-columns: repeat(2,1fr); }
//           .ab-section { padding: 0 24px; }
//         }
//       `}</style>

//       <div className="ab-root">
//         {/* ── HERO ── */}
//         <section className="ab-hero">
//           <div className="ab-hero-bg" />

//           <div className="ab-eyebrow">OUR STORY</div>

//           <h1 className="ab-hero-title">
//             All Your<br />
//             Wellness, <em>Under</em><br />
//             One Roof.
//           </h1>

//           <p className="ab-hero-sub">
//             Founded in 2025 with a simple purpose — to make every supplement you need
//             easy to find, easy to trust, and easy to access in one beautiful place.
//           </p>

//           <a href="/stocks" className="ab-hero-cta">
//             EXPLORE THE COLLECTION
//             <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
//             </svg>
//           </a>
//         </section>

//         {/* ── STATS ── */}
//         <div className="ab-stats">
//           {STATS.map((s) => (
//             <div key={s.label} className="ab-stat">
//               <div className="ab-stat-val">{s.value}</div>
//               <div className="ab-stat-label">{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── STORY + PILLARS ── */}
//         <div className="ab-section">
//           <div className="ab-story">
//             <div className="ab-story-left">
//               <span className="ab-section-label">WHY WE EXIST</span>
//               <h2 className="ab-story-title">
//                 Born from<br />
//                 <em>frustration,</em><br />
//                 built with purpose.
//               </h2>
//               <div className="ab-story-line" />
//               <p className="ab-story-body">
//                 Finding the right supplement shouldn't require hours of research, ten different websites,
//                 and a degree in biochemistry. We saw how fragmented and confusing the wellness market was —
//                 and we decided to fix it.
//               </p>
//               <p className="ab-story-body" style={{ marginTop: 16 }}>
//                 GlowMart launched in 2025 as a single, curated destination where every product has been
//                 reviewed for quality, transparency, and real efficacy. One roof. No compromise.
//               </p>
//             </div>

//             <div className="ab-story-right">
//               {[
//                 { num: "—", title: "Carefully Curated", body: "Every product passes a quality review before it reaches our shelves." },
//                 { num: "—", title: "Trusted Brands", body: "We carry only brands with proven track records and clean ingredient lists." },
//                 { num: "—", title: "Simple Experience", body: "Browse by goal, category, or brand — finding the right product takes minutes, not hours." },
//                 { num: "—", title: "Delivered to You", body: "From our shelf to your door, effortlessly." },
//               ].map((c, i) => (
//                 <div key={i} className="ab-story-card">
//                   <span className="ab-story-card-num">{c.num}</span>
//                   <div>
//                     <div className="ab-story-card-title">{c.title}</div>
//                     <div className="ab-story-card-body">{c.body}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── VALUES ── */}
//           <div className="ab-values">
//             <div className="ab-values-header">
//               <span className="ab-section-label">WHAT WE STAND FOR</span>
//               <h2 className="ab-values-title">Our <em>Principles</em></h2>
//             </div>
//             <div className="ab-values-grid">
//               {VALUES.map((v, i) => (
//                 <div
//                   key={i}
//                   className="ab-val"
//                   onMouseEnter={() => setHovered(i)}
//                   onMouseLeave={() => setHovered(null)}
//                 >
//                   <span className="ab-val-num">{v.num}</span>
//                   <div className="ab-val-title">{v.title}</div>
//                   <p className="ab-val-body">{v.body}</p>
//                   <div className="ab-val-line" />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── CLOSING ── */}
//           <div className="ab-closing">
//             <span className="ab-section-label" style={{ display: "block", marginBottom: 16 }}>READY TO START?</span>
//             <h2 className="ab-closing-title">
//               Everything you need,<br />
//               <em>finally in one place.</em>
//             </h2>
//             <p className="ab-closing-sub">
//               Browse 500+ carefully curated supplements from brands you can trust,
//               all in one effortless experience.
//             </p>
//             <div className="ab-closing-btns">
//               <a href="/stocks" className="ab-btn-dark">SHOP THE COLLECTION</a>
//               <a href="/blogs" className="ab-btn-outline">READ THE JOURNAL</a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Cart sidebar */}
//       <CartSidebar
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         cart={cart}
//         onUpdateQuantity={updateQuantity}
//         onRemoveItem={removeFromCart}
//         total={cartTotal}
//       />

//       <Footer />
//     </>
//   );
// }


// pages/About.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Whatsapp from "../components/whatsapp";
import CartSidebar from "../components/CartSidebar";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import Suppliments from "../assets/suppliments.jpg";
import Gym from "../assets/gymit.png";
import Style from "../assets/glowing.png";

function About() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { wishlist } = useWishlist();

  return (
    <div
      className="min-h-screen"
      style={{ background: "#faf7f2", fontFamily: "'Jost', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f0e7db; }
        ::-webkit-scrollbar-thumb { background: #b89b7b; border-radius: 99px; }

        .navbar-wrapper {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(250,247,242,0.98);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(184,155,123,0.15);
        }

        .side-line {
          position: fixed; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(to bottom, transparent, #f0e7db 20%, #f0e7db 80%, transparent);
          pointer-events: none;
          animation: lineGrow 1.2s ease both;
          transform-origin: top;
          z-index: 40;
        }

        @keyframes lineGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to { opacity:1; transform:translateY(0); }
        }
        
        .fade-up { animation: fadeUp .8s cubic-bezier(.22,1,.36,1) both; }
        .delay-1 { animation-delay: .1s; }
        .delay-2 { animation-delay: .22s; }
        .delay-3 { animation-delay: .36s; }
        .delay-4 { animation-delay: .50s; }

        .pill {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(184,155,123,.28); padding: 8px 18px;
          border-radius: 999px; background: rgba(255,255,255,.7); backdrop-filter: blur(8px);
        }
        
        .pill-dot { width: 5px; height: 5px; border-radius: 50%; background: #b89b7b; }

        .stat-card {
          background: white;
          border: 1px solid #f0e7db;
          border-radius: 24px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(184,155,123,.12);
          border-color: #b89b7b;
        }

        .value-card {
          background: white;
          border: 1px solid #f0e7db;
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s ease;
        }
        
        .value-card:hover {
          background: #ffffff;
          border-color: #b89b7b;
          transform: translateY(-4px);
        }

        .timeline-dot {
          width: 12px;
          height: 12px;
          background: #b89b7b;
          border-radius: 50%;
          position: relative;
        }
        
        .timeline-dot::after {
          content: '';
          position: absolute;
          top: 12px;
          left: 5px;
          width: 2px;
          height: 80px;
          background: linear-gradient(to bottom, #b89b7b, transparent);
        }
        
        .timeline-item:last-child .timeline-dot::after {
          display: none;
        }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border: 1px solid #e0d5c8;
          background: transparent; color: #2c2c2c;
          font-size: 10px; letter-spacing: 0.2em; font-weight: 300;
          text-decoration: none; cursor: pointer;
          transition: all .3s ease;
        }
        
        .btn-outline:hover { border-color: #b89b7b; color: #b89b7b; background: rgba(184,155,123,.04); }

        .btn-dark {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px; background: #2c2c2c; color: white;
          font-size: 10px; letter-spacing: 0.2em; font-weight: 300;
          text-decoration: none; border: none; cursor: pointer;
          position: relative; overflow: hidden;
        }
        
        .btn-dark::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, #c9a882, #b89b7b);
          transform: translateX(-100%); transition: transform .35s cubic-bezier(.22,1,.36,1);
        }
        
        .btn-dark:hover::after { transform: translateX(0); }
        .btn-dark span, .btn-dark svg { position: relative; z-index: 1; }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          inset: 0;
          background: white;
          z-index: 1200;
          display: flex;
          flex-direction: column;
          padding: 40px 20px;
          isolation: isolate;
          will-change: transform;
        }

        /* Cart Overlay */
        .cart-above-all {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10001;
          pointer-events: none;
        }

        .cart-above-all .cart-sidebar {
          pointer-events: auto;
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 100%;
          background: white;
          box-shadow: -4px 0 24px rgba(0,0,0,0.2);
          z-index: 10002;
          transition: transform 0.3s ease;
          transform: translateX(100%);
        }

        .cart-above-all .cart-sidebar.open {
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .stat-card { padding: 24px 16px; }
          .value-card { padding: 20px; }
        }
      `}</style>

      {/* Navbar */}
      <div className="navbar-wrapper">
        <Navbar
          cartCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
          wishlistCount={wishlist.length}
          onMenuToggle={() => setIsMenuOpen(true)}
        />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <button 
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#2c2c2c'
            }}
          >
            ✕
          </button>
          <div style={{ marginTop: 60 }}>
            <Link 
              to="/stocks" 
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: 'block',
                padding: '16px 0',
                fontSize: 18,
                color: '#2c2c2c',
                textDecoration: 'none',
                borderBottom: '1px solid #f0e7db'
              }}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: 'block',
                padding: '16px 0',
                fontSize: 18,
                color: '#2c2c2c',
                textDecoration: 'none',
                borderBottom: '1px solid #f0e7db'
              }}
            >
              About Us
            </Link>
            <Link 
              to="/blogs" 
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: 'block',
                padding: '16px 0',
                fontSize: 18,
                color: '#2c2c2c',
                textDecoration: 'none',
                borderBottom: '1px solid #f0e7db'
              }}
            >
              Blogs
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: 'block',
                padding: '16px 0',
                fontSize: 18,
                color: '#2c2c2c',
                textDecoration: 'none',
                borderBottom: '1px solid #f0e7db'
              }}
            >
              Contact
            </Link>
          </div>
        </div>
      )}

      {/* Side decorative lines */}
      <div className="side-line" style={{ left: 0 }} />
      <div className="side-line" style={{ right: 0, animationDelay: ".2s" }} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 40px 0" }}>
        
        {/* Hero Section */}
        <section style={{ padding: "0 0 80px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <div className="pill fade-up delay-1" style={{ marginBottom: 32 }}>
              <span className="pill-dot" />
              <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#b89b7b", fontWeight: 300 }}>
                OUR STORY
              </span>
              <span className="pill-dot" />
            </div>
            
            <h1 className="fade-up delay-1" style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(48px, 8vw, 80px)",
              fontWeight: 200,
              color: "#2c2c2c",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 24
            }}>
              Making Wellness
              <br />
              <em style={{ color: "#b89b7b", fontStyle: "italic" }}>Effortlessly Accessible</em>
            </h1>
            
            <div style={{ 
              width: 60, 
              height: 2, 
              background: "#b89b7b", 
              margin: "0 auto 32px",
              animation: "fadeUp .8s both .22s"
            }} />
            
            <p className="fade-up delay-2" style={{
              fontSize: 18,
              fontWeight: 300,
              color: "#7a6e64",
              lineHeight: 1.8,
              maxWidth: 650,
              margin: "0 auto"
            }}>
              Founded in 2025, Glow Mart was born from a simple idea: 
              premium supplements and skincare should be easy to find, 
              simple to understand, and a joy to purchase.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ padding: "40px 0 80px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24
          }}>
            {[
              { number: "2025", label: "Year Founded", icon: "✨" },
              { number: "500+", label: "Premium Products", icon: "💊" },
              { number: "50K+", label: "Happy Customers", icon: "❤️" },
              { number: "100%", label: "Clean Ingredients", icon: "🌿" }
            ].map((stat, i) => (
              <div key={i} className="stat-card fade-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{stat.icon}</div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 42,
                  fontWeight: 300,
                  color: "#b89b7b",
                  marginBottom: 8
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#9a8c7e",
                  textTransform: "uppercase"
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Mission Section */}
        <section style={{ padding: "60px 0", borderTop: "1px solid #f0e7db" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center"
          }}>
            <div>
              <span style={{
                fontSize: 9,
                letterSpacing: "0.35em",
                color: "#b89b7b",
                fontWeight: 300,
                display: "block",
                marginBottom: 20
              }}>
                OUR MISSION
              </span>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 200,
                color: "#2c2c2c",
                lineHeight: 1.2,
                marginBottom: 24
              }}>
                Simplify. <em style={{ color: "#b89b7b" }}>Elevate.</em> Thrive.
              </h2>
              <p style={{
                fontSize: 15,
                fontWeight: 300,
                color: "#7a6e64",
                lineHeight: 1.9,
                marginBottom: 24
              }}>
                We believe that taking care of your health shouldn't feel like a chore. 
                That's why we've created a seamless experience where you can discover, 
                learn, and purchase the finest supplements and skincare products—all in one place.
              </p>
              <p style={{
                fontSize: 15,
                fontWeight: 300,
                color: "#7a6e64",
                lineHeight: 1.9
              }}>
                Every product in our collection is carefully vetted by our wellness experts, 
                ensuring you get nothing but the purest, most effective formulations available.
              </p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #f5efe8 0%, #ede4d8 100%)",
              borderRadius: 32,
              padding: 40,
              textAlign: "center"
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 80,
                fontWeight: 200,
                color: "#b89b7b",
                marginBottom: 16
              }}>
                "
              </div>
              <p style={{
                fontSize: 18,
                fontWeight: 300,
                color: "#2c2c2c",
                lineHeight: 1.6,
                fontStyle: "italic",
                marginBottom: 24
              }}>
                Wellness isn't about perfection—it's about making small, 
                consistent choices that add up to a healthier, happier you.
              </p>
              <div style={{
                fontSize: 12,
                letterSpacing: "0.1em",
                color: "#b89b7b"
              }}>
                — GLOW MART FOUNDERS
              </div>
            </div>
          </div>
        </section>

        {/* The Problem We Solved */}
        <section style={{ padding: "80px 0", borderTop: "1px solid #f0e7db" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{
              fontSize: 9,
              letterSpacing: "0.35em",
              color: "#b89b7b",
              fontWeight: 300,
              display: "block",
              marginBottom: 16
            }}>
              THE CHALLENGE
            </span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 5vw, 44px)",
              fontWeight: 200,
              color: "#2c2c2c",
              marginBottom: 16
            }}>
              Why We Started Glow Mart
            </h2>
            <p style={{
              fontSize: 16,
              fontWeight: 300,
              color: "#7a6e64",
              maxWidth: 600,
              margin: "0 auto"
            }}>
              The supplement and skincare market was broken. We fixed it.
            </p>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 32
          }}>
            {[
              {
                title: "Overwhelming Choices",
                description: "Too many products, too little clarity. We curate only the best, so you don't have to guess.",
                icon: "🤔"
              },
              {
                title: "Complex Ingredients",
                description: "Clean, transparent labels. No hidden fillers, no confusing jargon—just what your body needs.",
                icon: "📋"
              },
              {
                title: "Inconsistent Quality",
                description: "Every product is vetted by experts and sourced from certified, trusted suppliers.",
                icon: "✨"
              }
            ].map((problem, i) => (
              <div key={i} className="value-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>{problem.icon}</div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  fontWeight: 400,
                  color: "#2c2c2c",
                  marginBottom: 12
                }}>
                  {problem.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: "#9a8c7e",
                  lineHeight: 1.7
                }}>
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section style={{ padding: "80px 0", background: "white", borderRadius: 48, margin: "40px 0" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{
                fontSize: 9,
                letterSpacing: "0.35em",
                color: "#b89b7b",
                fontWeight: 300,
                display: "block",
                marginBottom: 16
              }}>
                WHAT WE BELIEVE
              </span>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 5vw, 44px)",
                fontWeight: 200,
                color: "#2c2c2c"
              }}>
                Our Core Values
              </h2>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 32
            }}>
              {[
                {
                  title: "Simplicity First",
                  description: "No complexity, no confusion. Just straightforward wellness solutions.",
                  icon: "🎯"
                },
                {
                  title: "Quality Above All",
                  description: "We never compromise on ingredients, sourcing, or manufacturing standards.",
                  icon: "⭐"
                },
                {
                  title: "Customer Trust",
                  description: "Your health journey is personal. We earn your trust with every product.",
                  icon: "🤝"
                },
                {
                  title: "Continuous Innovation",
                  description: "Always evolving, always improving—bringing you the best in wellness.",
                  icon: "🚀"
                }
              ].map((value, i) => (
                <div key={i} className="value-card">
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{value.icon}</div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 400,
                    color: "#b89b7b",
                    marginBottom: 12
                  }}>
                    {value.title}
                  </h3>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 300,
                    color: "#7a6e64",
                    lineHeight: 1.7
                  }}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section style={{ padding: "60px 0", borderTop: "1px solid #f0e7db" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{
              fontSize: 9,
              letterSpacing: "0.35em",
              color: "#b89b7b",
              fontWeight: 300,
              display: "block",
              marginBottom: 16
            }}>
              OUR JOURNEY
            </span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 5vw, 44px)",
              fontWeight: 200,
              color: "#2c2c2c"
            }}>
              From Vision to Reality
            </h2>
          </div>
          
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            {[
              { year: "Early 2025", title: "The Idea", description: "Founders recognized the need for a simplified wellness shopping experience." },
              { year: "Spring 2025", title: "Curating Excellence", description: "Vetted over 500 products to select only the highest quality supplements and skincare." },
              { year: "Summer 2025", title: "Launch", description: "Glow Mart officially opens, bringing premium wellness to customers worldwide." },
              { year: "Today", title: "Growing Strong", description: "Thousands of satisfied customers, expanding collection, and a community that trusts us." }
            ].map((item, i) => (
              <div key={i} className="timeline-item" style={{ display: "flex", gap: 24, marginBottom: 48 }}>
                <div style={{ flexShrink: 0 }}>
                  <div className="timeline-dot" />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18,
                    fontWeight: 400,
                    color: "#b89b7b",
                    marginBottom: 8
                  }}>
                    {item.year}
                  </div>
                  <h3 style={{
                    fontSize: 20,
                    fontWeight: 400,
                    color: "#2c2c2c",
                    marginBottom: 12
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 300,
                    color: "#7a6e64",
                    lineHeight: 1.7
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: "80px 0",
          textAlign: "center",
          borderTop: "1px solid #f0e7db",
          marginTop: 40
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 200,
            color: "#2c2c2c",
            marginBottom: 24
          }}>
            Ready to Start Your<br />
            <em style={{ color: "#b89b7b", fontStyle: "italic" }}>Wellness Journey?</em>
          </h2>
          <p style={{
            fontSize: 15,
            fontWeight: 300,
            color: "#7a6e64",
            maxWidth: 500,
            margin: "0 auto 40px",
            lineHeight: 1.8
          }}>
            Join thousands of customers who've discovered the joy of simple, 
            effective wellness solutions.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/stocks" className="btn-dark">
              <span>SHOP NOW</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/contact" className="btn-outline">
              CONTACT US
            </Link>
          </div>
        </section>
      </main>
       <Whatsapp/>

      <Footer />

      {/* Cart Sidebar Portal */}
      {createPortal(
        <div className="cart-above-all">
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            total={cartTotal}
          />
        </div>,
        document.body
      )}
    </div>
  );
}

export default About;