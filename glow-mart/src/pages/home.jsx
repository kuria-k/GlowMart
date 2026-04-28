// Landing.jsx - Complete working version
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Whatsapp from "../components/whatsapp";
import CartSidebar from "../components/CartSidebar";
import Suppliments from "../assets/suppliments.jpg";
import Gym from "../assets/gymit.png";
import Style from "../assets/glowing.png";
import Beach from "../assets/beachs.png";
import Sleep from "../assets/sonp.png";
import { useCart } from "../hooks/usecart";
import { useWishlist } from "../hooks/useWishlist";
import { createPortal } from "react-dom";

function Landing() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // ✅ Get full cart functionality including clearCart
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartTotal, 
    cartCount,
    clearCart  // ✅ IMPORTANT: Add clearCart
  } = useCart();
  
  const { wishlist } = useWishlist();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const carouselImages = [
    { src: Suppliments, title: "Premium Supplements", badge: "Wellness" },
    { src: Gym, title: "Performance", badge: "Fitness" },
    { src: Style, title: "Luxury Skincare", badge: "Beauty" },
    { src: Beach, title: "Summer Essentials", badge: "Lifestyle" },
    { src: Sleep, title: "Restorative Sleep", badge: "Wellness" },
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((p) => (p + 1) % carouselImages.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };
  
  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide(
      (p) => (p - 1 + carouselImages.length) % carouselImages.length,
    );
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };
  
  const goToSlide = (i) => {
    setIsAutoPlaying(false);
    setCurrentSlide(i);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // ✅ Handle cart cleared
  const handleCartCleared = () => {
    clearCart();
    console.log('✅ Cart cleared in Landing');
  };

  // ✅ Handle payment complete
  const handlePaymentComplete = () => {
    setIsCartOpen(false);
    console.log('✅ Payment complete, cart closed');
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#faf7f2", fontFamily: "'Jost', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f0e7db; }
        ::-webkit-scrollbar-thumb { background: #b89b7b; border-radius: 99px; }

        .ld-navbar-wrapper {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(250,247,242,0.98);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(184,155,123,0.15);
        }

        .cart-above-all {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10001;
          pointer-events: none;
        }

        .cart-above-all > * {
          pointer-events: auto;
        }

        .cart-above-all::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          pointer-events: auto;
          z-index: 10000;
        }

        .cart-above-all:has(.cart-sidebar.open)::before {
          opacity: 1;
          visibility: visible;
        }

        @keyframes ld-line-grow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        .ld-side-line {
          position: fixed; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(to bottom, transparent, #f0e7db 20%, #f0e7db 80%, transparent);
          pointer-events: none;
          animation: ld-line-grow 1.2s ease both;
          transform-origin: top;
          z-index: 40;
        }

        @keyframes ld-fade-up {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ld-fade { animation: ld-fade-up .8s cubic-bezier(.22,1,.36,1) both; }
        .ld-d1{animation-delay:.1s}  .ld-d2{animation-delay:.22s}
        .ld-d3{animation-delay:.36s} .ld-d4{animation-delay:.50s}
        .ld-d5{animation-delay:.64s} .ld-d6{animation-delay:.78s}

        .ld-pill {
          display:inline-flex; align-items:center; gap:8px;
          border:1px solid rgba(184,155,123,.28); padding:8px 18px;
          border-radius:999px; background:rgba(255,255,255,.7); backdrop-filter:blur(8px);
        }
        .ld-pill-dot { width:5px; height:5px; border-radius:50%; background:#b89b7b; flex-shrink:0; }

        .ld-h1 {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(52px,7vw,96px); font-weight:200;
          line-height:1.0; letter-spacing:-0.02em; color:#2c2c2c;
        }
        .ld-h1 em { font-style:italic; color:#b89b7b; font-weight:200; }

        .ld-btn-dark {
          display:inline-flex; align-items:center; gap:10px;
          padding:14px 32px; background:#2c2c2c; color:white;
          font-size:10px; letter-spacing:0.2em; font-weight:300;
          text-decoration:none; border:none; cursor:pointer;
          position:relative; overflow:hidden;
        }
        .ld-btn-dark::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,#c9a882,#b89b7b);
          transform:translateX(-100%); transition:transform .35s cubic-bezier(.22,1,.36,1);
        }
        .ld-btn-dark:hover::after { transform:translateX(0); }
        .ld-btn-dark span,.ld-btn-dark svg { position:relative; z-index:1; }

        .ld-btn-outline {
          display:inline-flex; align-items:center; gap:8px;
          padding:14px 32px; border:1px solid #e0d5c8;
          background:transparent; color:#2c2c2c;
          font-size:10px; letter-spacing:0.2em; font-weight:300;
          text-decoration:none; cursor:pointer;
          transition:border-color .3s,color .3s,background .3s;
        }
        .ld-btn-outline:hover { border-color:#b89b7b; color:#b89b7b; background:rgba(184,155,123,.04); }

        .ld-stat-val {
          font-family:'Cormorant Garamond',serif;
          font-size:36px; font-weight:200; color:#2c2c2c; line-height:1; margin-bottom:6px;
        }
        .ld-stat-label { font-size:9px; letter-spacing:0.22em; color:#b89b7b; font-weight:300; text-transform:uppercase; }

        .ld-carousel {
          position:relative; width:100%; border-radius:32px; overflow:hidden;
          background:linear-gradient(145deg,#f5efe8 0%,#ede4d8 100%);
          box-shadow:0 40px 80px rgba(44,44,44,.08),0 8px 24px rgba(184,155,123,.12);
        }
        .carousel-container { position:relative; width:100%; aspect-ratio:4/5; overflow:hidden; }
        .carousel-track { display:flex; transition:transform 0.6s cubic-bezier(0.22,1,0.36,1); height:100%; }
        .carousel-slide { flex:0 0 100%; position:relative; height:100%; }
        .carousel-slide img { width:100%; height:100%; object-fit:cover; transition:transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .carousel-slide:hover img { transform:scale(1.05); }
        .carousel-overlay {
          position:absolute; bottom:0; left:0; right:0;
          background:linear-gradient(to top,rgba(0,0,0,.7) 0%,rgba(0,0,0,0) 100%);
          padding:40px 24px 24px; transition:transform 0.4s ease;
        }
        .carousel-slide:hover .carousel-overlay { transform:translateY(-8px); }
        .carousel-badge {
          display:inline-block; background:rgba(184,155,123,0.95);
          backdrop-filter:blur(8px); padding:4px 12px; border-radius:20px;
          font-size:9px; letter-spacing:0.15em; color:white; margin-bottom:12px; text-transform:uppercase;
        }
        .carousel-title { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:400; color:white; margin:0; letter-spacing:-0.02em; }

        .carousel-nav-btn {
          position:absolute; top:50%; transform:translateY(-50%);
          width:44px; height:44px; border-radius:50%;
          background:rgba(255,255,255,0.9); backdrop-filter:blur(8px);
          border:1px solid rgba(184,155,123,0.3);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all 0.3s ease; color:#2c2c2c; z-index:10;
        }
        .carousel-nav-btn:hover { background:#b89b7b; color:white; transform:translateY(-50%) scale(1.1); }
        .carousel-nav-prev { left:16px; }
        .carousel-nav-next { right:16px; }

        .carousel-dots {
          position:absolute; bottom:20px; left:50%; transform:translateX(-50%);
          display:flex; gap:12px; z-index:10;
        }
        .carousel-dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.5); cursor:pointer; transition:all 0.3s ease; }
        .carousel-dot.active { background:#b89b7b; width:24px; border-radius:4px; }

        .ld-float-badge {
          position:absolute; z-index:15;
          background:rgba(255,255,255,.95); backdrop-filter:blur(12px);
          border:1px solid rgba(184,155,123,.2); border-radius:14px;
          padding:12px 16px; box-shadow:0 8px 24px rgba(44,44,44,.08); pointer-events:none;
        }
        .ld-float-badge-top  { top:40px; left:-24px; animation:ld-float 4s ease-in-out infinite; }
        .ld-float-badge-bottom { bottom:60px; right:-24px; animation:ld-float 4s ease-in-out infinite .8s; }
        @keyframes ld-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .ld-badge-val { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; color:#2c2c2c; line-height:1; }
        .ld-badge-label { font-size:9px; letter-spacing:0.16em; color:#b89b7b; font-weight:300; margin-top:2px; text-transform:uppercase; }

        .ld-brands {
          border-top:1px solid #f0e7db; border-bottom:1px solid #f0e7db;
          padding:28px 0; display:flex; align-items:center; justify-content:center;
          overflow:hidden; background:white;
        }
        .ld-brand-item {
          padding:0 40px; border-right:1px solid #f0e7db;
          font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:300;
          letter-spacing:0.22em; color:#c4b09a; opacity:.65; transition:opacity .25s; white-space:nowrap;
        }
        .ld-brand-item:last-child { border-right:none; }
        .ld-brand-item:hover { opacity:1; color:#b89b7b; }

        .ld-hero-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        .ld-trust { display:flex; align-items:center; gap:32px; flex-wrap:wrap; }
        .ld-trust-item { display:flex; align-items:center; gap:8px; font-size:11px; font-weight:300; color:#9a8c7e; letter-spacing:0.04em; }
        .ld-stats { display:flex; gap:56px; }

        @media (max-width:1024px) {
          .ld-hero-grid { gap:48px; }
          .ld-stats { gap:32px; }
          .ld-brand-item { padding:0 24px; }
          .carousel-nav-btn { width:36px; height:36px; }
        }
        @media (max-width:768px) {
          .ld-hero-grid { grid-template-columns:1fr; gap:48px; }
          .ld-float-badge-top  { left:0; top:20px; }
          .ld-float-badge-bottom { right:0; bottom:32px; }
          .ld-stats { gap:24px; flex-wrap:wrap; }
          .ld-brands { flex-wrap:wrap; }
          .ld-brand-item { border-right:none; border-bottom:1px solid #f0e7db; padding:12px 28px; }
          .carousel-nav-btn { width:32px; height:32px; }
          .carousel-nav-prev { left:12px; }
          .carousel-nav-next { right:12px; }
          .carousel-title { font-size:20px; }
        }
        @media (max-width:480px) {
          .ld-h1 { font-size:46px; }
          .ld-float-badge { display:none; }
          .carousel-nav-btn { width:28px; height:28px; }
          .carousel-title { font-size:18px; }
        }

        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
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
      `}</style>

      {/* NAVBAR */}
      <div className="ld-navbar-wrapper">
        <Navbar
          cartCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
          wishlistCount={wishlist.length}
          onMenuToggle={() => setIsMenuOpen(true)}
        />
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <button onClick={() => setIsMenuOpen(false)}>Close</button>
          <a href="/stocks">Shop</a>
          <a href="/blogs">Blogs</a>
        </div>
      )}

      <div className="ld-side-line" style={{ left: 0 }} />
      <div className="ld-side-line" style={{ right: 0, animationDelay: ".2s" }} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "200px 100px 0" }}>
        {/* ══ HERO ══ */}
        <section style={{ padding: "0 0 90px" }}>
          <div className="ld-hero-grid">
            {/* Left */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="ld-pill ld-fade ld-d1" style={{ alignSelf: "flex-start", marginBottom: 36 }}>
                <span className="ld-pill-dot" />
                <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#b89b7b", fontWeight: 300 }}>
                  NEW ESSENTIALS COLLECTION
                </span>
                <span className="ld-pill-dot" />
              </div>

              <h1 className="ld-h1 ld-fade ld-d2" style={{ marginBottom: 28 }}>
                Where Beauty<br /><em>Meets</em><br />Wellness
              </h1>

              <div className="ld-fade ld-d3" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{ width: 48, height: 1, background: "linear-gradient(90deg,#b89b7b,transparent)" }} />
                <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#b89b7b", fontWeight: 300 }}>
                  GLOWMART 2025
                </span>
              </div>

              <p className="ld-fade ld-d3" style={{ fontSize: 15, fontWeight: 300, color: "#7a6e64", lineHeight: 1.9, maxWidth: 420, marginBottom: 40, letterSpacing: "0.02em" }}>
                Discover our curated selection of premium supplements and skincare, crafted for those who demand nothing but the finest in their wellness journey.
              </p>

              <div className="ld-trust ld-fade ld-d4" style={{ marginBottom: 40 }}>
                {[
                  { icon: "✓", text: "100% Clean Ingredients" },
                  { icon: "✓", text: "Certified Suppliers" },
                  { icon: "✓", text: "Fast Delivery" },
                ].map((t, i) => (
                  <div key={i} className="ld-trust-item">
                    <span style={{ color: "#b89b7b", fontSize: 12 }}>{t.icon}</span>
                    {t.text}
                  </div>
                ))}
              </div>

              <div className="ld-fade ld-d5" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 52 }}>
                <a href="/stocks" className="ld-btn-dark">
                  <span>EXPLORE THE COLLECTION</span>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a href="/about" className="ld-btn-outline">OUR STORY</a>
              </div>

              <div className="ld-stats ld-fade ld-d6">
                {[
                  { val: "50K+", label: "Discerning Clients" },
                  { val: "500+", label: "Premium Products" },
                  { val: "100%", label: "Clean Ingredients" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="ld-stat-val">{s.val}</div>
                    <div className="ld-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — carousel */}
            <div className="ld-fade ld-d2" style={{ position: "relative" }}>
              <div className="ld-carousel">
                <div className="carousel-container">
                  <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {carouselImages.map((img, i) => (
                      <div key={i} className="carousel-slide">
                        <img src={img.src} alt={img.title} />
                        <div className="carousel-overlay">
                          <span className="carousel-badge">{img.badge}</span>
                          <h3 className="carousel-title">{img.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="carousel-nav-btn carousel-nav-prev" onClick={prevSlide} aria-label="Previous">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="carousel-nav-btn carousel-nav-next" onClick={nextSlide} aria-label="Next">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="carousel-dots">
                    {carouselImages.map((_, i) => (
                      <div key={i} className={`carousel-dot ${currentSlide === i ? "active" : ""}`} onClick={() => goToSlide(i)} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="ld-float-badge ld-float-badge-top">
                <div className="ld-badge-val">500+</div>
                <div className="ld-badge-label">Products</div>
              </div>
              <div className="ld-float-badge ld-float-badge-bottom">
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 20 20" fill="#d4a843">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="ld-badge-val" style={{ fontSize: 18 }}>4.9</div>
                <div className="ld-badge-label">Avg. Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ BRANDS ══ */}
        <div className="relative overflow-hidden bg-white border-y border-orange-100 py-6">
          <div className="flex items-center whitespace-nowrap animate-scroll">
            <span className="text-orange-500 text-xs tracking-[0.35em] font-medium px-8 border-r border-orange-200 flex-shrink-0">
              EXCLUSIVE PARTNERS
            </span>
            {["La Roche-Posay","CeraVe","NOW","Jamieson","Nivea","Garnier","The Ordinary","Neutrogena","Olay","Eucerin","Aveeno","Vichy","Cetaphil","Bioderma","Clinique","Estée Lauder","L'Oréal Paris","Maybelline","MAC Cosmetics","Fenty Beauty","Charlotte Tilbury","Dior Beauty"].map((b) => (
              <span key={b} className="text-orange-500 text-sm font-medium px-10 flex-shrink-0 border-r border-orange-100 last:border-none hover:text-orange-600 transition-colors duration-300">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ══ FEATURES ══ */}
        <section style={{ padding: "80px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 1, background: "#f0e7db", border: "1px solid #f0e7db" }}>
            {[
              { num: "01", title: "Curated Selection", body: "Every product hand-picked by our wellness experts for potency and purity." },
              { num: "02", title: "Clean Standards", body: "No fillers, no compromise. Full transparency on every ingredient label." },
              { num: "03", title: "Fast Delivery", body: "From our shelf to your door, tracked and insured every step." },
              { num: "04", title: "Expert Guidance", body: "Our team is available to help you find exactly what your body needs." },
            ].map((f, i) => (
              <div key={i} style={{ background: "#faf7f2", padding: "40px 32px", transition: "background .3s", cursor: "default" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#faf7f2")}
              >
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, color: "#d4c4b0", letterSpacing: "0.1em", display: "block", marginBottom: 20 }}>{f.num}</span>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 400, color: "#ff7402", marginBottom: 10 }}>{f.title}</div>
                <p style={{ fontSize: 12, fontWeight: 300, color: "#9a8c7e", lineHeight: 1.8 }}>{f.body}</p>
                <div style={{ width: 0, height: 1, background: "#b89b7b", marginTop: 20, transition: "width .4s cubic-bezier(.22,1,.36,1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.width = "32px")}
                  onMouseLeave={(e) => (e.currentTarget.style.width = "0")}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ══ CLOSING CTA ══ */}
        <section style={{ padding: "60px 0 100px", textAlign: "center", borderTop: "1px solid #f0e7db" }}>
          <span style={{ fontSize: 9, letterSpacing: "0.35em", color: "#b89b7b", fontWeight: 300, display: "block", marginBottom: 20 }}>
            READY TO START?
          </span>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 200, color: "#2c2c2c", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Everything you need,<br />
            <em style={{ fontStyle: "italic", color: "#b89b7b" }}>finally in one place.</em>
          </h2>
          <p style={{ fontSize: 13, fontWeight: 300, color: "#9a8c7e", maxWidth: 380, margin: "0 auto 40px", lineHeight: 1.85 }}>
            Browse 500+ carefully curated products from brands you can trust, all in one effortless experience.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/stocks" className="ld-btn-dark"><span>SHOP THE COLLECTION</span></a>
            <a href="/blogs" className="ld-btn-outline">READ THE JOURNAL</a>
          </div>
        </section>
      </main>
       <Whatsapp/>

      <Footer />

      {/* ✅ CART SIDEBAR - WITH ALL REQUIRED PROPS */}
      {createPortal(
        <div className="cart-above-all">
          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            total={cartTotal}
            onCartCleared={handleCartCleared}        // ✅ ADDED
            onPaymentComplete={handlePaymentComplete}  // ✅ ADDED
          />
        </div>,
        document.body,
      )}
    </div>
  );
}

export default Landing;

// import { useState, useEffect } from "react";
// import Navbar from "../components/navbar";
// import Footer from "../components/footer";
// import CartSidebar from "../components/CartSidebar";
// import Suppliments from "../assets/suppliments.jpg";
// import Gym from "../assets/gym.png";
// import Style from "../assets/glowing.png";
// import Beach from "../assets/Life in the beach.png";
// import Sleep from "../assets/sonp.png";
// import { useCart } from "../hooks/useCart";
// import { useWishlist } from "../hooks/useWishlist";

// function Landing() {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
//   const { wishlist } = useWishlist();

//   // Carousel state
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   const carouselSlides = [
//     {
//       image: Suppliments,
//       title: "Premium Supplements",
//       subtitle: "Elevate Your Wellness Journey",
//       description: "Scientifically formulated for optimal results",
//       cta: "Shop Supplements",
//       link: "/stocks?category=supplements"
//     },
//     {
//       image: Gym,
//       title: "Elevate Your Performance",
//       subtitle: "Train Harder, Recover Faster",
//       description: "Premium sports nutrition for peak performance",
//       cta: "Explore Performance",
//       link: "/stocks?category=performance"
//     },
//     {
//       image: Style,
//       title: "Golden Hour Collection",
//       subtitle: "Luxury Skincare Rituals",
//       description: "Illuminate your natural radiance",
//       cta: "Discover Luxury",
//       link: "/stocks?category=skincare"
//     },
//     {
//       image: Beach,
//       title: "Life in the Beach",
//       subtitle: "Summer Essentials",
//       description: "Protect and nourish your skin all year round",
//       cta: "Shop Summer",
//       link: "/stocks?category=summer"
//     },
//     {
//       image: Sleep,
//       title: "Sleep Better Tonight",
//       subtitle: "Restorative Wellness",
//       description: "Natural solutions for deeper, more restful sleep",
//       cta: "Improve Sleep",
//       link: "/stocks?category=sleep"
//     }
//   ];

//   // Auto-advance carousel
//   useEffect(() => {
//     let interval;
//     if (isAutoPlaying) {
//       interval = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
//       }, 3000);
//     }
//     return () => clearInterval(interval);
//   }, [isAutoPlaying, carouselSlides.length]);

//   // Manual navigation
//   const nextSlide = () => {
//     setIsAutoPlaying(false);
//     setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
//     setTimeout(() => setIsAutoPlaying(true), 10000);
//   };

//   const prevSlide = () => {
//     setIsAutoPlaying(false);
//     setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
//     setTimeout(() => setIsAutoPlaying(true), 10000);
//   };

//   const goToSlide = (index) => {
//     setIsAutoPlaying(false);
//     setCurrentSlide(index);
//     setTimeout(() => setIsAutoPlaying(true), 10000);
//   };

//   return (
//     <div className="min-h-screen" style={{ background: "#faf7f2", fontFamily: "'Jost', sans-serif" }}>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

//         *, *::before, *::after { box-sizing: border-box; }

//         /* ── scroll bar ── */
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: #f0e7db; }
//         ::-webkit-scrollbar-thumb { background: #b89b7b; border-radius: 99px; }

//         /* ── Navbar wrapper - FIXED with higher z-index ── */
//         .ld-navbar-wrapper {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           z-index: 10000 !important;
//           background: rgba(250, 247, 242, 0.98);
//           backdrop-filter: blur(10px);
//           border-bottom: 1px solid rgba(184, 155, 123, 0.15);
//           pointer-events: auto;
//         }

//         /* Ensure navbar internal styles remain unchanged and clickable */
//         .ld-navbar-wrapper .navbar {
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 1rem 2rem;
//           position: relative;
//           z-index: 10001;
//         }

//         /* Ensure all navbar interactive elements are clickable */
//         .ld-navbar-wrapper * {
//           pointer-events: auto;
//         }

//         /* Hamburger menu specific styles - ensure visibility */
//         .ld-navbar-wrapper .menu-toggle,
//         .ld-navbar-wrapper .hamburger,
//         .ld-navbar-wrapper [class*="hamburger"],
//         .ld-navbar-wrapper [class*="menu-toggle"] {
//           position: relative;
//           z-index: 10002;
//           pointer-events: auto;
//           cursor: pointer;
//         }

//         /* Mobile menu overlay should also have high z-index */
//         .ld-navbar-wrapper .mobile-menu,
//         .ld-navbar-wrapper [class*="mobile-menu"] {
//           z-index: 10003 !important;
//         }

//         /* ── decorative line ── */
//         @keyframes ld-line-grow {
//           from { transform: scaleY(0); }
//           to   { transform: scaleY(1); }
//         }
//         .ld-side-line {
//           position: fixed;
//           top: 0; bottom: 0;
//           width: 1px;
//           background: linear-gradient(to bottom, transparent, #f0e7db 20%, #f0e7db 80%, transparent);
//           pointer-events: none;
//           animation: ld-line-grow 1.2s ease both;
//           transform-origin: top;
//           z-index: 2;
//         }

//         /* ── hero ── */
//         @keyframes ld-fade-up {
//           from { opacity: 0; transform: translateY(28px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .ld-fade { animation: ld-fade-up .8s cubic-bezier(.22,1,.36,1) both; }
//         .ld-d1 { animation-delay: .1s; }
//         .ld-d2 { animation-delay: .22s; }
//         .ld-d3 { animation-delay: .36s; }
//         .ld-d4 { animation-delay: .50s; }
//         .ld-d5 { animation-delay: .64s; }
//         .ld-d6 { animation-delay: .78s; }

//         /* ── pill badge ── */
//         .ld-pill {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           border: 1px solid rgba(184,155,123,.28);
//           padding: 8px 18px;
//           border-radius: 999px;
//           background: rgba(255,255,255,.7);
//           backdrop-filter: blur(8px);
//         }
//         .ld-pill-dot {
//           width: 5px; height: 5px;
//           border-radius: 50%;
//           background: #b89b7b;
//           flex-shrink: 0;
//         }

//         /* ── hero title ── */
//         .ld-h1 {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(52px, 7vw, 96px);
//           font-weight: 200;
//           line-height: 1.0;
//           letter-spacing: -0.02em;
//           color: #2c2c2c;
//         }
//         .ld-h1 em {
//           font-style: italic;
//           color: #b89b7b;
//           font-weight: 200;
//         }

//         /* ── CTA buttons ── */
//         .ld-btn-dark {
//           display: inline-flex;
//           align-items: center;
//           gap: 10px;
//           padding: 14px 32px;
//           background: #2c2c2c;
//           color: white;
//           font-size: 10px;
//           letter-spacing: 0.2em;
//           font-weight: 300;
//           text-decoration: none;
//           border: none;
//           cursor: pointer;
//           transition: background .3s ease;
//           position: relative;
//           overflow: hidden;
//         }
//         .ld-btn-dark::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(90deg, #c9a882, #b89b7b);
//           transform: translateX(-100%);
//           transition: transform .35s cubic-bezier(.22,1,.36,1);
//         }
//         .ld-btn-dark:hover::after { transform: translateX(0); }
//         .ld-btn-dark span, .ld-btn-dark svg { position: relative; z-index: 1; }

//         .ld-btn-outline {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 14px 32px;
//           border: 1px solid #e0d5c8;
//           background: transparent;
//           color: #2c2c2c;
//           font-size: 10px;
//           letter-spacing: 0.2em;
//           font-weight: 300;
//           text-decoration: none;
//           cursor: pointer;
//           transition: border-color .3s, color .3s, background .3s;
//         }
//         .ld-btn-outline:hover {
//           border-color: #b89b7b;
//           color: #b89b7b;
//           background: rgba(184,155,123,.04);
//         }

//         /* ── stat ── */
//         .ld-stats { display: flex; gap: 56px; }
//         .ld-stat-val {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 36px;
//           font-weight: 200;
//           color: #2c2c2c;
//           line-height: 1;
//           margin-bottom: 6px;
//         }
//         .ld-stat-label {
//           font-size: 9px;
//           letter-spacing: 0.22em;
//           color: #b89b7b;
//           font-weight: 300;
//           text-transform: uppercase;
//         }

//         /* ── Full Width Carousel Hero Styles with Fixed Image Fit ── */
//         .hero-carousel-container {
//           position: relative;
//           width: 100vw;
//           left: 50%;
//           right: 50%;
//           margin-left: -50vw;
//           margin-right: -50vw;
//           height: 100vh;
//           min-height: 700px;
//           overflow: hidden;
//           background: #0e0c0a;
//           z-index: 1;
//         }

//         .hero-carousel-slides {
//           display: flex;
//           transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
//           height: 100%;
//         }

//         .hero-carousel-slide {
//           flex: 0 0 100%;
//           position: relative;
//           overflow: hidden;
//         }

//         .hero-carousel-image-wrapper {
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: hidden;
//           background: #0e0c0a;
//         }

//         .hero-carousel-image-wrapper img {
//           width: 100%;
//           height: auto;
//           max-height: 100vh;
//           object-fit: contain;
//           object-position: center;
//           transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
//           background-color: #0e0c0a;
//         }

//         .hero-carousel-slide:hover .hero-carousel-image-wrapper img {
//           transform: scale(1.05);
//         }

//         .hero-carousel-overlay {
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(
//             to right,
//             rgba(0,0,0,0.55) 0%,
//             rgba(0,0,0,0.35) 50%,
//             rgba(0,0,0,0.55) 100%
//           );
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//           z-index: 2;
//         }

//         .hero-carousel-content {
//           max-width: 800px;
//           color: white;
//           padding: 0 24px;
//           animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
//         }

//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .hero-carousel-badge {
//           display: inline-block;
//           background: rgba(184,155,123,0.95);
//           backdrop-filter: blur(8px);
//           padding: 8px 20px;
//           border-radius: 40px;
//           font-size: 11px;
//           letter-spacing: 0.25em;
//           margin-bottom: 28px;
//           font-weight: 400;
//           text-transform: uppercase;
//         }

//         .hero-carousel-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(48px, 8vw, 96px);
//           font-weight: 300;
//           line-height: 1.05;
//           margin-bottom: 20px;
//           letter-spacing: -0.02em;
//         }

//         .hero-carousel-subtitle {
//           font-size: clamp(18px, 3vw, 24px);
//           font-weight: 300;
//           margin-bottom: 16px;
//           opacity: 0.95;
//           letter-spacing: 0.02em;
//         }

//         .hero-carousel-description {
//           font-size: 14px;
//           font-weight: 300;
//           margin-bottom: 40px;
//           opacity: 0.85;
//           line-height: 1.7;
//           max-width: 500px;
//           margin-left: auto;
//           margin-right: auto;
//         }

//         .hero-carousel-cta {
//           display: inline-flex;
//           align-items: center;
//           gap: 12px;
//           padding: 14px 36px;
//           background: white;
//           color: #2c2c2c;
//           text-decoration: none;
//           font-size: 11px;
//           letter-spacing: 0.2em;
//           font-weight: 500;
//           transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
//           border-radius: 40px;
//           text-transform: uppercase;
//         }

//         .hero-carousel-cta:hover {
//           background: #b89b7b;
//           color: white;
//           transform: translateY(-2px);
//           box-shadow: 0 8px 24px rgba(0,0,0,0.2);
//         }

//         /* Carousel Navigation */
//         .hero-carousel-nav {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 100%;
//           display: flex;
//           justify-content: space-between;
//           padding: 0 40px;
//           z-index: 10;
//           pointer-events: none;
//         }

//         .hero-carousel-nav-btn {
//           width: 56px;
//           height: 56px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.2);
//           backdrop-filter: blur(12px);
//           border: 1px solid rgba(255,255,255,0.3);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           color: white;
//           pointer-events: auto;
//         }

//         .hero-carousel-nav-btn:hover {
//           background: #b89b7b;
//           border-color: #b89b7b;
//           transform: scale(1.1);
//         }

//         /* Carousel Dots */
//         .hero-carousel-dots {
//           position: absolute;
//           bottom: 40px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 16px;
//           z-index: 10;
//         }

//         .hero-carousel-dot {
//           width: 10px;
//           height: 10px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.5);
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .hero-carousel-dot.active {
//           background: #b89b7b;
//           width: 30px;
//           border-radius: 5px;
//         }

//         /* Scroll Indicator */
//         .hero-scroll-indicator {
//           position: absolute;
//           bottom: 40px;
//           left: 50%;
//           transform: translateX(-50%);
//           z-index: 10;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 12px;
//           cursor: pointer;
//         }

//         .hero-scroll-mouse {
//           width: 26px;
//           height: 40px;
//           border: 2px solid rgba(255,255,255,0.6);
//           border-radius: 20px;
//           position: relative;
//         }

//         .hero-scroll-wheel {
//           width: 3px;
//           height: 8px;
//           background: white;
//           border-radius: 2px;
//           position: absolute;
//           top: 8px;
//           left: 50%;
//           transform: translateX(-50%);
//           animation: scrollWheel 1.8s ease-in-out infinite;
//         }

//         @keyframes scrollWheel {
//           0% { opacity: 1; transform: translateX(-50%) translateY(0); }
//           100% { opacity: 0; transform: translateX(-50%) translateY(16px); }
//         }

//         .hero-scroll-text {
//           font-size: 10px;
//           letter-spacing: 0.2em;
//           color: rgba(255,255,255,0.7);
//           text-transform: uppercase;
//         }

//         /* Main Content Container */
//         .main-content {
//           max-width: 1280px;
//           margin: 0 auto;
//           padding: 80px 40px 0;
//           position: relative;
//           background: #faf7f2;
//           z-index: 2;
//         }

//         /* ── Brands Marquee Carousel ── */
//         .ld-brands {
//           border-top: 1px solid #f0e7db;
//           border-bottom: 1px solid #f0e7db;
//           padding: 32px 0;
//           background: white;
//           position: relative;
//           overflow: hidden;
//           margin-top: 60px;
//         }

//         .ld-brands-marquee {
//           overflow: hidden;
//           width: 100%;
//         }

//         .ld-brands-track {
//           display: flex;
//           gap: 0;
//           animation: marqueeScroll 40s linear infinite;
//           width: max-content;
//         }

//         .ld-brands:hover .ld-brands-track {
//           animation-play-state: paused;
//         }

//         @keyframes marqueeScroll {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }

//         .ld-brand-item {
//           padding: 0 48px;
//           border-right: 1px solid #f0e7db;
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 15px;
//           font-weight: 400;
//           letter-spacing: 0.15em;
//           color: #b89b7b;
//           opacity: 0.7;
//           transition: all 0.3s ease;
//           white-space: nowrap;
//           cursor: default;
//           display: inline-block;
//         }

//         .ld-brand-item:last-child {
//           border-right: none;
//         }

//         .ld-brand-item:hover {
//           opacity: 1;
//           color: #b89b7b;
//           transform: scale(1.05);
//         }

//         /* ── trust strip ── */
//         .ld-trust {
//           display: flex;
//           align-items: center;
//           gap: 32px;
//           flex-wrap: wrap;
//         }
//         .ld-trust-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 11px;
//           font-weight: 300;
//           color: #9a8c7e;
//           letter-spacing: 0.04em;
//         }

//         /* ── responsive ── */
//         @media (max-width: 1024px) {
//           .ld-stats { gap: 32px; }
//           .ld-brand-item { padding: 0 32px; font-size: 13px; }
//           .hero-carousel-nav { padding: 0 20px; }
//           .hero-carousel-nav-btn { width: 44px; height: 44px; }
//           .ld-brands-track { animation-duration: 35s; }
//         }

//         @media (max-width: 768px) {
//           .ld-navbar-wrapper .navbar { padding: 0.75rem 1rem; }
//           .main-content { padding: 60px 20px 0; }
//           .ld-stats { gap: 24px; flex-wrap: wrap; }
//           .ld-brands { margin-top: 40px; padding: 24px 0; }
//           .ld-brand-item { padding: 0 24px; font-size: 12px; letter-spacing: 0.12em; }
//           .ld-trust { gap: 20px; }
//           .hero-carousel-nav-btn { width: 36px; height: 36px; }
//           .hero-carousel-nav { padding: 0 16px; }
//           .hero-carousel-dots { bottom: 20px; gap: 12px; }
//           .hero-carousel-cta { padding: 12px 28px; font-size: 10px; }
//           .hero-scroll-indicator { bottom: 20px; }
//           .ld-brands-track { animation-duration: 28s; }
//         }

//         @media (max-width: 480px) {
//           .hero-carousel-nav-btn { display: none; }
//           .hero-carousel-title { font-size: 36px; }
//           .hero-carousel-subtitle { font-size: 16px; }
//           .hero-carousel-description { font-size: 12px; margin-bottom: 30px; }
//           .hero-carousel-badge { font-size: 9px; padding: 6px 16px; margin-bottom: 20px; }
//           .ld-brand-item { padding: 0 20px; font-size: 10px; letter-spacing: 0.1em; }
//           .ld-brands-track { animation-duration: 22s; }
//         }
//       `}</style>

//       {/* ── Navbar Wrapper with high z-index ── */}
//       <div className="ld-navbar-wrapper">
//         <Navbar
//           cartCount={cartCount}
//           onCartClick={() => setIsCartOpen(true)}
//           wishlistCount={wishlist.length}
//         />
//       </div>

//       {/* ── Decorative side lines ── */}
//       <div className="ld-side-line" style={{ left: 0 }} />
//       <div className="ld-side-line" style={{ right: 0, animationDelay: ".2s" }} />

//       {/* ══════════════════════════════
//           FULL WIDTH HERO CAROUSEL
//       ══════════════════════════════ */}
//       <div className="hero-carousel-container">
//         <div
//           className="hero-carousel-slides"
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {carouselSlides.map((slide, index) => (
//             <div key={index} className="hero-carousel-slide">
//               <div className="hero-carousel-image-wrapper">
//                 <img src={slide.image} alt={slide.title} />
//               </div>
//               <div className="hero-carousel-overlay">
//                 <div className="hero-carousel-content">
//                   <div className="hero-carousel-badge">FEATURED COLLECTION</div>
//                   <h1 className="hero-carousel-title">{slide.title}</h1>
//                   <div className="hero-carousel-subtitle">{slide.subtitle}</div>
//                   <p className="hero-carousel-description">{slide.description}</p>
//                   <a href={slide.link} className="hero-carousel-cta">
//                     {slide.cta}
//                     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Navigation Buttons */}
//         <div className="hero-carousel-nav">
//           <button className="hero-carousel-nav-btn" onClick={prevSlide} aria-label="Previous slide">
//             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
//             </svg>
//           </button>
//           <button className="hero-carousel-nav-btn" onClick={nextSlide} aria-label="Next slide">
//             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
//             </svg>
//           </button>
//         </div>

//         {/* Dots Indicator */}
//         <div className="hero-carousel-dots">
//           {carouselSlides.map((_, index) => (
//             <div
//               key={index}
//               className={`hero-carousel-dot ${currentSlide === index ? 'active' : ''}`}
//               onClick={() => goToSlide(index)}
//             />
//           ))}
//         </div>

//         {/* Scroll Indicator */}
//         <div className="hero-scroll-indicator" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
//           <div className="hero-scroll-mouse">
//             <div className="hero-scroll-wheel" />
//           </div>
//           <span className="hero-scroll-text">Scroll</span>
//         </div>
//       </div>

//       {/* ══════════════════════════════
//           MAIN CONTENT
//       ══════════════════════════════ */}
//       <div className="main-content">

//         {/* Welcome Section */}
//         <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 80px" }}>
//           <div className="ld-pill" style={{ marginBottom: 28, display: "inline-flex" }}>
//             <span className="ld-pill-dot" />
//             <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#b89b7b", fontWeight: 300 }}>
//               WELCOME TO GLOWMART
//             </span>
//             <span className="ld-pill-dot" />
//           </div>

//           <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 300, color: "#2c2c2c", marginBottom: 24 }}>
//             Where Beauty <em style={{ color: "#b89b7b", fontStyle: "italic" }}>Meets</em> Wellness
//           </h2>

//           <div style={{ width: 60, height: 1, background: "#b89b7b", margin: "0 auto 32px" }} />

//           <p style={{ fontSize: 15, fontWeight: 300, color: "#7a6e64", lineHeight: 1.8, maxWidth: 600, margin: "0 auto", letterSpacing: "0.02em" }}>
//             Discover our curated selection of premium supplements and skincare,
//             crafted for those who demand nothing but the finest in their wellness journey.
//           </p>
//         </div>

//         {/* Stats Section */}
//         <div style={{ display: "flex", justifyContent: "center", gap: 80, flexWrap: "wrap", marginBottom: 80, padding: "40px 0", borderTop: "1px solid #f0e7db", borderBottom: "1px solid #f0e7db" }}>
//           {[
//             { val: "50K+", label: "Discerning Clients" },
//             { val: "500+", label: "Premium Products" },
//             { val: "100%", label: "Clean Ingredients" },
//           ].map((s, i) => (
//             <div key={i} style={{ textAlign: "center" }}>
//               <div className="ld-stat-val">{s.val}</div>
//               <div className="ld-stat-label">{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Feature Strip */}
//         <section style={{ padding: "40px 0 80px" }}>
//           <div style={{ textAlign: "center", marginBottom: 60 }}>
//             <span className="ld-section-eyebrow" style={{ fontSize: 9, letterSpacing: "0.35em", color: "#b89b7b", fontWeight: 300, textTransform: "uppercase", display: "block", marginBottom: 18 }}>
//               WHY GLOWMART
//             </span>
//             <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: "#2c2c2c" }}>
//               A standard built on <em style={{ color: "#b89b7b", fontStyle: "italic" }}>obsessive detail</em>
//             </h2>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 1, background: "#f0e7db", border: "1px solid #f0e7db" }}>
//             {[
//               { num: "01", title: "Curated Selection", body: "Every product hand-picked by our wellness experts for potency and purity." },
//               { num: "02", title: "Clean Standards", body: "No fillers, no compromise. Full transparency on every ingredient label." },
//               { num: "03", title: "Fast Delivery", body: "From our shelf to your door, tracked and insured every step." },
//               { num: "04", title: "Expert Guidance", body: "Our team is available to help you find exactly what your body needs." },
//             ].map((f, i) => (
//               <div key={i}
//                 style={{
//                   background: "#faf7f2",
//                   padding: "40px 32px",
//                   transition: "background .3s",
//                   cursor: "default",
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.background = "white"}
//                 onMouseLeave={e => e.currentTarget.style.background = "#faf7f2"}
//               >
//                 <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, color: "#d4c4b0", letterSpacing: "0.1em", display: "block", marginBottom: 20 }}>{f.num}</span>
//                 <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 400, color: "#2c2c2c", marginBottom: 10 }}>{f.title}</div>
//                 <p style={{ fontSize: 12, fontWeight: 300, color: "#9a8c7e", lineHeight: 1.8, letterSpacing: "0.02em" }}>{f.body}</p>
//                 <div style={{ width: 0, height: 1, background: "#b89b7b", marginTop: 20, transition: "width .4s cubic-bezier(.22,1,.36,1)" }}
//                   onMouseEnter={e => e.currentTarget.style.width = "32px"}
//                   onMouseLeave={e => e.currentTarget.style.width = "0"}
//                 />
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ── Brands Marquee Carousel ── */}
//         <div className="ld-brands">
//           <div className="ld-brands-marquee">
//             <div className="ld-brands-track">
//               {/* First set of brands */}
//               <span className="ld-brand-item">Jamieson</span>
//               <span className="ld-brand-item">La Roche-Posay</span>
//               <span className="ld-brand-item">CeraVe</span>
//               <span className="ld-brand-item">Nivea</span>
//               <span className="ld-brand-item">Demelan</span>
//               <span className="ld-brand-item">NOW Foods</span>
//               <span className="ld-brand-item">Kisima Naturals</span>
//               <span className="ld-brand-item">Zuri Skincare</span>
//               <span className="ld-brand-item">Hive Kenya</span>
//               <span className="ld-brand-item">Apotek</span>
//               <span className="ld-brand-item">Sweet Nutrition</span>
//               <span className="ld-brand-item">Vital Greens</span>
//               <span className="ld-brand-item">Solgar</span>
//               <span className="ld-brand-item">Bio-Ken</span>
//               <span className="ld-brand-item">Healthy U</span>

//               {/* Duplicate for seamless loop */}
//               <span className="ld-brand-item">Jamieson</span>
//               <span className="ld-brand-item">La Roche-Posay</span>
//               <span className="ld-brand-item">CeraVe</span>
//               <span className="ld-brand-item">Nivea</span>
//               <span className="ld-brand-item">Demelan</span>
//               <span className="ld-brand-item">NOW Foods</span>
//               <span className="ld-brand-item">Kisima Naturals</span>
//               <span className="ld-brand-item">Zuri Skincare</span>
//               <span className="ld-brand-item">Hive Kenya</span>
//               <span className="ld-brand-item">Apotek</span>
//               <span className="ld-brand-item">Sweet Nutrition</span>
//               <span className="ld-brand-item">Vital Greens</span>
//               <span className="ld-brand-item">Solgar</span>
//               <span className="ld-brand-item">Bio-Ken</span>
//               <span className="ld-brand-item">Healthy U</span>
//             </div>
//           </div>
//         </div>

//         {/* Closing CTA */}
//         <section style={{ padding: "80px 0 60px", textAlign: "center" }}>
//           <span style={{ fontSize: 9, letterSpacing: "0.35em", color: "#b89b7b", fontWeight: 300, display: "block", marginBottom: 20 }}>READY TO START?</span>
//           <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 200, color: "#2c2c2c", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 20 }}>
//             Everything you need,<br />
//             <em style={{ fontStyle: "italic", color: "#b89b7b" }}>finally in one place.</em>
//           </h2>
//           <p style={{ fontSize: 13, fontWeight: 300, color: "#9a8c7e", maxWidth: 380, margin: "0 auto 40px", lineHeight: 1.85 }}>
//             Browse 500+ carefully curated products from brands you can trust, all in one effortless experience.
//           </p>
//           <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
//             <a href="/stocks" className="ld-btn-dark"><span>SHOP THE COLLECTION</span></a>
//             <a href="/blogs" className="ld-btn-outline">READ THE JOURNAL</a>
//           </div>
//         </section>
//       </div>

//       <Footer />

//       {/* ── Cart Sidebar ── */}
//       <CartSidebar
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         cart={cart}
//         onUpdateQuantity={updateQuantity}
//         onRemoveItem={removeFromCart}
//         total={cartTotal}
//       />
//     </div>
//   );
// }

// export default Landing;
