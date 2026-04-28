// pages/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CartSidebar from "../components/CartSidebar";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { getProduct } from "../api";
import ProductModal from "../components/productmodal";

/* ─────────────────────────────────────────────────────────────
   LUXURY QUOTES — rotated per session
───────────────────────────────────────────────────────────── */
const QUOTES = [
  { text: "Style is a way to say who you are without having to speak.", author: "Rachel Zoe" },
  { text: "Fashion is the armor to survive the reality of everyday life.", author: "Bill Cunningham" },
  { text: "Elegance is not about being noticed, it's about being remembered.", author: "Giorgio Armani" },
  { text: "The joy of dressing is an art.", author: "John Galliano" },
  { text: "In order to be irreplaceable, one must always be different.", author: "Coco Chanel" },
  { text: "Luxury is in each detail.", author: "Hubert de Givenchy" },
  { text: "Dress shabbily and they remember the dress. Dress impeccably and they remember the woman.", author: "Coco Chanel" },
];

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES  (unchanged from original)
───────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --gold:        #b89b7b;
    --gold-light:  #c9a882;
    --gold-pale:   #e8d9c8;
    --gold-faint:  #f5efe8;
    --gold-hover:  #a5896a;
    --ink:         #2c2c2c;
    --ink-mid:     #5a5a5a;
    --ink-muted:   #9a9a9a;
    --cream:       #faf7f2;
    --white:       #ffffff;
    --border:      rgba(184,155,123,.16);
    --border-md:   rgba(184,155,123,.34);
    --shadow-sm:   0 2px 14px rgba(44,44,44,.055);
    --shadow-md:   0 8px 32px rgba(44,44,44,.09);
    --shadow-lg:   0 22px 64px rgba(44,44,44,.13);
    --ff-serif:    'Cormorant Garamond', Georgia, serif;
    --ff-sans:     'Jost', sans-serif;
    --ease:        cubic-bezier(.25,.46,.45,.94);
  }

  .wl * { box-sizing: border-box; }
  .wl   { font-family: var(--ff-sans); color: var(--ink); position: relative; }

  /* subtle noise grain */
  .wl-grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 9000; opacity: .02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px;
  }

  /* ── animations ── */
  @keyframes wl-rise {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes wl-fade { from{opacity:0} to{opacity:1} }
  @keyframes wl-float {
    0%,100%{transform:translateY(0)}
    50%{transform:translateY(-10px)}
  }
  @keyframes wl-shimmer {
    0%  {background-position:-600px 0}
    100%{background-position: 600px 0}
  }
  @keyframes wl-spin    { to{transform:rotate(360deg)} }
  @keyframes wl-pulse-gold {
    0%,100%{box-shadow:0 0 0 0 rgba(184,155,123,.4)}
    50%    {box-shadow:0 0 0 8px rgba(184,155,123,0)}
  }

  .wl-rise { animation: wl-rise .65s var(--ease) both; }
  .wl-fade { animation: wl-fade  .5s ease     both; }

  /* ── quote banner ── */
  .wl-quote-banner {
    background: linear-gradient(110deg, var(--ink) 0%, #3d3530 100%);
    border-radius: 22px;
    padding: 36px 44px;
    position: relative;
    overflow: hidden;
    margin-bottom: 3.5rem;
    box-shadow: var(--shadow-md);
  }
  .wl-quote-banner::before {
    content: '\u201C';
    position: absolute; top: -20px; left: 24px;
    font-family: var(--ff-serif); font-size: 160px; font-weight: 300;
    color: rgba(184,155,123,.15); line-height: 1; pointer-events: none;
    user-select: none;
  }
  .wl-quote-banner::after {
    content: '';
    position: absolute; bottom: 0; right: 0;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(184,155,123,.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .wl-quote-text {
    font-family: var(--ff-serif);
    font-size: clamp(18px, 2.6vw, 26px);
    font-weight: 300; font-style: italic;
    color: #f5efe8; line-height: 1.55;
    margin-bottom: 14px; position: relative; z-index: 1;
  }
  .wl-quote-author {
    font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
    color: var(--gold); font-weight: 500; position: relative; z-index: 1;
    display: flex; align-items: center; gap: 10px;
  }
  .wl-quote-author::before {
    content: ''; display: inline-block;
    width: 28px; height: 1px; background: var(--gold); opacity: .6;
  }

  /* ── personalized bar ── */
  .wl-persona {
    background: linear-gradient(90deg, var(--gold-faint) 0%, var(--white) 55%, var(--gold-faint) 100%);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 14px 22px;
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 2.5rem;
    box-shadow: var(--shadow-sm);
  }
  .wl-monogram {
    width: 50px; height: 50px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--ff-serif); font-size: 20px; font-weight: 300;
    color: var(--white); letter-spacing: .06em;
    box-shadow: 0 4px 14px rgba(184,155,123,.36);
    animation: wl-pulse-gold 3.5s ease-in-out infinite;
  }
  .wl-persona-text { font-size: 13px; color: var(--ink-mid); line-height: 1.55; }
  .wl-persona-text strong { color: var(--ink); font-weight: 500; }

  /* ── page title ── */
  .wl-page-title { text-align: center; margin-bottom: 3rem; }
  .wl-eyebrow {
    display: inline-block;
    background: linear-gradient(90deg, transparent, rgba(184,155,123,.13), transparent);
    padding: 5px 22px; border-radius: 30px; margin-bottom: 14px;
    font-size: 10px; letter-spacing: .15em; text-transform: uppercase;
    color: var(--gold); font-weight: 500;
  }
  .wl-h1 {
    font-family: var(--ff-serif);
    font-size: clamp(38px, 6vw, 58px);
    font-weight: 300; color: var(--ink); line-height: 1.05; margin-bottom: 14px;
  }
  .wl-ornament {
    display: flex; align-items: center; gap: 14px; justify-content: center;
  }
  .wl-orn-line { height: 1px; width: 52px; background: linear-gradient(90deg, transparent, var(--gold-pale), transparent); }
  .wl-orn-dot  { width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); opacity: .55; }
  .wl-count-text {
    font-size: 14px; color: var(--ink-muted);
    font-style: italic; font-family: var(--ff-serif);
  }

  /* ── stats ── */
  .wl-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 14px; margin-bottom: 3rem;
  }
  .wl-stat {
    background: var(--white); border: 1px solid var(--border);
    border-radius: 18px; padding: 18px 20px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: var(--shadow-sm);
    transition: transform .3s var(--ease), box-shadow .3s var(--ease);
  }
  .wl-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .wl-stat-icon {
    width: 44px; height: 44px; border-radius: 13px;
    background: var(--gold-faint);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); flex-shrink: 0;
  }
  .wl-stat-label { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 4px; }
  .wl-stat-value { font-family: var(--ff-serif); font-size: 20px; font-weight: 300; color: var(--ink); line-height: 1; }

  /* ── divider ── */
  .wl-divider {
    display: flex; align-items: center; gap: 0;
    max-width: 160px; margin: 0 auto 3rem; justify-content: center;
  }
  .wl-div-line { flex: 1; height: 1px; background: var(--gold-pale); }
  .wl-div-dot  { width: 4px; height: 4px; background: var(--gold); border-radius: 50%; margin: 0 10px; opacity: .55; }

  /* ── grid ── */
  .wl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 26px;
  }

  /* ── card ── */
  .wl-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden; cursor: pointer;
    position: relative;
    box-shadow: var(--shadow-sm);
    transition: transform .4s var(--ease), box-shadow .4s var(--ease), border-color .3s;
  }
  .wl-card:hover {
    transform: translateY(-7px);
    box-shadow: var(--shadow-lg);
    border-color: var(--border-md);
  }

  .wl-card-img {
    position: relative; aspect-ratio: 4/5;
    background: linear-gradient(145deg, var(--gold-faint) 0%, var(--cream) 100%);
    overflow: hidden;
  }
  .wl-card-img > img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .7s var(--ease);
  }
  .wl-card:hover .wl-card-img > img { transform: scale(1.07); }
  .wl-card-emoji {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center; font-size: 68px;
  }

  /* hover veil */
  .wl-veil {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(44,44,44,.52) 0%, transparent 50%);
    opacity: 0; transition: opacity .38s var(--ease);
    display: flex; align-items: flex-end; padding: 16px;
  }
  .wl-card:hover .wl-veil { opacity: 1; }
  .wl-view-pill {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
    background: rgba(255,255,255,.92); backdrop-filter: blur(8px);
    border-radius: 30px; padding: 8px 16px;
    font-size: 11px; font-weight: 500; letter-spacing: .05em; color: var(--ink);
    transform: translateY(10px); opacity: 0;
    transition: transform .38s var(--ease), opacity .38s;
  }
  .wl-card:hover .wl-view-pill { transform: translateY(0); opacity: 1; }

  /* badges */
  .wl-badge {
    position: absolute; top: 12px; left: 12px; z-index: 2;
    font-size: 11px; font-weight: 600; letter-spacing: .02em;
    padding: 5px 11px; border-radius: 20px;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .wl-badge-discount {
    background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
    color: #fff;
    box-shadow: 0 3px 10px rgba(220,38,38,0.35);
  }
  .wl-badge-stock { background: #E08515; color: #fff; }

  /* heart remove */
  .wl-heart {
    position: absolute; top: 12px; right: 12px; z-index: 3;
    width: 34px; height: 34px;
    background: rgba(255,255,255,.9); backdrop-filter: blur(6px);
    border: 1px solid rgba(184,155,123,.26); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: transform .25s var(--ease), background .2s, border-color .2s;
  }
  .wl-heart:hover { transform: scale(1.14); background: #fff0f0; border-color: #e74c3c; }
  .wl-heart svg   { color: #e74c3c; }

  /* OOS */
  .wl-oos {
    position: absolute; inset: 0; z-index: 4;
    background: rgba(250,247,242,.7); backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center;
  }
  .wl-oos-pill {
    background: var(--ink); color: var(--white);
    font-size: 10px; font-weight: 500; letter-spacing: .14em;
    text-transform: uppercase; padding: 8px 20px; border-radius: 30px;
  }

  /* card body */
  .wl-card-body    { padding: 15px 17px 18px; }
  .wl-card-brand   { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); font-weight: 500; margin-bottom: 5px; }
  .wl-card-name    {
    font-family: var(--ff-serif); font-size: 16.5px; font-weight: 400; line-height: 1.35;
    color: var(--ink); margin-bottom: 10px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    transition: color .2s;
  }
  .wl-card:hover .wl-card-name { color: var(--gold); }

  /* stars */
  .wl-stars { display: flex; align-items: center; gap: 2px; margin-bottom: 10px; }
  .wl-star  { width: 11px; height: 11px; }
  .wl-star-f { color: #d4a843; }
  .wl-star-e { color: #e0d6cc; }
  .wl-rating-n { font-size: 11px; color: var(--ink-muted); margin-left: 5px; }

  /* price row */
  .wl-price-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .wl-price     { font-family: var(--ff-serif); font-size: 21px; font-weight: 300; color: var(--ink); }
  .wl-price-discount { font-family: var(--ff-serif); font-size: 21px; font-weight: 500; color: #dc2626; }
  .wl-price-orig{ font-size: 12px; color: var(--ink-muted); text-decoration: line-through; margin-left: 6px; }
  .wl-savings-chip {
    display: inline-flex; align-items: center; gap: 4px;
    background: linear-gradient(135deg, #fef2f2, #fff7ed);
    border: 1px solid rgba(220,38,38,.18);
    border-radius: 999px; padding: 3px 10px;
    font-size: 10px; font-weight: 500; color: #dc2626;
    white-space: nowrap;
  }

  /* add btn */
  .wl-add-btn {
    width: 34px; height: 34px; background: var(--ink);
    border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--white); cursor: pointer; flex-shrink: 0;
    transition: background .22s, transform .22s var(--ease);
  }
  .wl-add-btn:hover   { background: var(--gold); transform: scale(1.1) rotate(90deg); }
  .wl-add-btn:disabled{ background: #ccc; transform: none; cursor: not-allowed; }
  .wl-add-btn.spin svg{ animation: wl-spin .55s linear infinite; }

  /* ── empty ── */
  .wl-empty {
    background: var(--white); border: 1px solid var(--border);
    border-radius: 28px; padding: 5rem 2rem; text-align: center;
    max-width: 680px; margin: 0 auto; box-shadow: var(--shadow-md);
  }
  .wl-empty-orb {
    width: 116px; height: 116px; margin: 0 auto 2rem; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, var(--gold-pale), var(--gold-faint));
    display: flex; align-items: center; justify-content: center; font-size: 50px;
    box-shadow: 0 8px 32px rgba(184,155,123,.22);
    animation: wl-float 5s ease-in-out infinite;
  }
  .wl-empty h3 { font-family: var(--ff-serif); font-size: 34px; font-weight: 300; color: var(--ink); margin-bottom: .6rem; }
  .wl-empty p  { font-size: 15px; color: var(--ink-muted); max-width: 370px; margin: 0 auto 2.5rem; line-height: 1.7; }
  .wl-empty-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 2.5rem; }
  .wl-btn-dark {
    padding: 12px 28px; background: var(--ink); color: var(--white); border-radius: 12px;
    font-size: 12px; font-weight: 500; letter-spacing: .06em; text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    transition: background .22s, transform .2s;
  }
  .wl-btn-dark:hover { background: var(--gold); transform: translateY(-2px); }
  .wl-btn-outline {
    padding: 12px 28px; border: 1.5px solid var(--gold-pale); color: var(--gold); border-radius: 12px;
    font-size: 12px; font-weight: 500; letter-spacing: .06em; text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    transition: border-color .22s, background .22s, transform .2s;
  }
  .wl-btn-outline:hover { border-color: var(--gold); background: var(--gold-faint); transform: translateY(-2px); }
  .wl-tags { display: flex; flex-wrap: wrap; gap: 9px; justify-content: center; }
  .wl-tag {
    padding: 8px 18px; background: var(--gold-faint); color: var(--ink-mid);
    border-radius: 30px; font-size: 12px; text-decoration: none; letter-spacing: .04em;
    transition: background .2s, color .2s, transform .2s;
  }
  .wl-tag:hover { background: var(--gold); color: var(--white); transform: translateY(-1px); }

  /* ── skeleton ── */
  .wl-skel-wrap { background: var(--white); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
  .wl-skel {
    background: linear-gradient(90deg, #f2ede8 0%, #e8e0d8 50%, #f2ede8 100%);
    background-size: 600px 100%;
    animation: wl-shimmer 1.6s ease infinite; border-radius: 8px;
  }
`;

function useStyles() {
  useEffect(() => {
    const id = 'wl-luxury-v3';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id; el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.getElementById(id)?.remove();
  }, []);
}

/* ─── tiny icons ─── */
const IPlus   = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ISpin   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" opacity=".25"/><path d="M12 2a10 10 0 018 4" strokeLinecap="round"/></svg>;
const ISearch = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IStar   = ({ f }) => (
  <svg className={`wl-star ${f ? 'wl-star-f' : 'wl-star-e'}`} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
  </svg>
);

/* ─── wishlist card with discount support ─── */
function WishlistCard({ product, index, onPreview, onAdd, onRemove }) {
  const [err, setErr]       = useState(false);
  const [adding, setAdding] = useState(false);
  
  /* ── Discount calculation matching Products page ── */
  const getDiscount = () => {
    const isActive = product.is_discount_active === true || 
                     (product.discount_percent && product.discount_percent > 0 && product.is_discount_active !== false);
    
    if (isActive) {
      if (product.discount_percent && product.discount_percent > 0) {
        return product.discount_percent;
      }
      if (product.current_price && product.price && product.current_price < product.price) {
        return Math.round(((product.price - product.current_price) / product.price) * 100);
      }
    }
    
    if (product.current_price && product.price && product.current_price < product.price) {
      return Math.round(((product.price - product.current_price) / product.price) * 100);
    }
    
    return 0;
  };
  
  const getDisplayPrice = () => {
    if (product.current_price !== undefined && product.current_price !== null) {
      return Number(product.current_price);
    }
    return Number(product.price);
  };
  
  const getOriginalPrice = () => {
    return Number(product.price);
  };
  
  const discount = getDiscount();
  const displayPrice = getDisplayPrice();
  const originalPrice = getOriginalPrice();
  const savedAmount = discount > 0 ? originalPrice - displayPrice : 0;
  
  const hasImg = !err && (product.image_url || product.image);

  const handleAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await new Promise(r => setTimeout(r, 440));
    onAdd(product);
    setAdding(false);
  };

  return (
    <div
      className="wl-card wl-rise"
      style={{ animationDelay: `${index * 65}ms` }}
      onClick={() => onPreview(product)}
    >
      <div className="wl-card-img">
        {hasImg
          ? <img src={product.image_url || product.image} alt={product.name} onError={() => setErr(true)} />
          : <div className="wl-card-emoji"><span>{product.emoji || '📦'}</span></div>}

        {/* Discount badge with fire emoji */}
        {discount > 0 && product.stock > 0 && (
          <div className="wl-badge wl-badge-discount">🔥 {discount}% OFF</div>
        )}
        {product.stock > 0 && product.stock < 10 && <div className="wl-badge wl-badge-stock">⚡ {product.stock} left</div>}
        {product.stock === 0 && <div className="wl-oos"><span className="wl-oos-pill">Sold Out</span></div>}

        <div className="wl-veil">
          <div className="wl-view-pill">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            View Details
          </div>
        </div>

        <button
          className="wl-heart"
          onClick={(e) => { e.stopPropagation(); onRemove(product.id); }}
          aria-label="Remove from wishlist"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>

      <div className="wl-card-body">
        <div className="wl-card-brand">{product.brand || product.supplier_name || 'Premium Collection'}</div>
        <div className="wl-card-name">{product.name}</div>

        {product.rating && (
          <div className="wl-stars">
            {[1,2,3,4,5].map(i => <IStar key={i} f={i <= Math.floor(product.rating)} />)}
            <span className="wl-rating-n">({product.rating})</span>
          </div>
        )}

        <div className="wl-price-row">
          <div>
            {discount > 0 ? (
              <>
                <span className="wl-price-discount">
                  KES {displayPrice.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                </span>
                <span className="wl-price-orig">
                  KES {originalPrice.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                </span>
              </>
            ) : (
              <span className="wl-price">
                KES {displayPrice.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          {product.stock > 0 && (
            <button
              className={`wl-add-btn${adding ? ' spin' : ''}`}
              onClick={handleAdd}
              disabled={adding}
              aria-label="Add to cart"
            >
              {adding ? <ISpin /> : <IPlus />}
            </button>
          )}
        </div>
        
        {/* Savings chip for discounted items */}
        {discount > 0 && (
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
            <span className="wl-savings-chip">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              Save KES {savedAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── empty state ─── */
function EmptyWishlist() {
  return (
    <div className="wl-empty wl-rise">
      <div className="wl-empty-orb">🤍</div>
      <h3>Your collection awaits</h3>
      <p>Discover pieces that resonate with you and save them here — your personal edit, curated just for you.</p>
      <div className="wl-empty-btns">
        <a href="/stocks" className="wl-btn-dark"><ISearch /> Explore Collections</a>
      </div>
    </div>
  );
}

/* ─── skeleton ─── */
function Skeleton() {
  return (
    <div className="wl-grid">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="wl-skel-wrap">
          <div className="wl-skel" style={{ aspectRatio: '4/5' }} />
          <div style={{ padding: '15px 17px 18px' }}>
            <div className="wl-skel" style={{ height: 10, width: '40%', marginBottom: 8 }} />
            <div className="wl-skel" style={{ height: 15, width: '80%', marginBottom: 5 }} />
            <div className="wl-skel" style={{ height: 15, width: '60%', marginBottom: 14 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="wl-skel" style={{ height: 21, width: '38%' }} />
              <div className="wl-skel" style={{ width: 34, height: 34, borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const Wishlist = () => {
  useStyles();

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [selectedProduct, setSelectedProduct]   = useState(null);
  const [isModalOpen, setIsModalOpen]           = useState(false);

  // ── Cart sidebar open/close state (lives here, passed to Navbar + CartSidebar) ──
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Pick a quote once per mount
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  // ── Single useCart instance — shared via CartProvider context ──
  const {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  /* fetch wishlist products */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const ids = wishlist
          .map(id => (typeof id === 'object' && id ? id.id : id))
          .filter(Boolean);
        if (!ids.length) { setWishlistProducts([]); return; }
        const results = await Promise.all(
          ids.map(async id => { try { return (await getProduct(id)).data; } catch { return null; } })
        );
        setWishlistProducts(results.filter(Boolean));
      } catch {
        toast.error('Failed to load wishlist items');
      } finally {
        setLoading(false);
      }
    })();
  }, [wishlist]);

  /* stats - use display price for discounted items */
  const totalVal = wishlistProducts.reduce((s, p) => {
    const price = p.current_price !== undefined && p.current_price !== null ? Number(p.current_price) : Number(p.price);
    return s + price;
  }, 0);
  const avgPrice = wishlistProducts.length ? totalVal / wishlistProducts.length : 0;
  const inStock  = wishlistProducts.filter(p => p.stock > 0).length;
  const fmt      = (n) => Number(n).toLocaleString('en-KE', { minimumFractionDigits: 2 });

  /* ── handlers ── */
  const handleAdd = (product, quantity = 1) => {
    addToCart({ ...product, quantity });
    toast.success(`Added to cart`, {
      icon: '✦', duration: 2000,
      style: {
        background: '#2c2c2c', color: '#f5efe8',
        borderRadius: '12px', fontSize: '13px',
        fontFamily: "'Jost', sans-serif",
      },
    });
  };

  const handleRemove = (productId) => {
    toggleWishlist(productId);
    toast('Removed from wishlist', {
      icon: '💔', duration: 2000,
      style: {
        background: '#2c2c2c', color: '#f5efe8',
        borderRadius: '12px', fontSize: '13px',
        fontFamily: "'Jost', sans-serif",
      },
    });
  };

  const handleCheckout = (orderData) => {
    // Hand off to your orders API here
    console.log('Order placed:', orderData);
    clearCart();
    setIsCartOpen(false);
    toast.success('Order placed successfully! 🎉', { duration: 4000 });
  };

  return (
    <>
      <Toaster position="top-right" />

      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        total={cartTotal}
      />

      {/* grain overlay */}
      <div className="wl-grain" aria-hidden="true" />

      <div
        className="wl"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #faf7f2 0%, #ffffff 50%, #f5efe8 100%)',
          paddingTop: '4rem',
          paddingBottom: '5.5rem',
        }}
      >
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 1.5rem' }}>

          {/* ── Page title ── */}
          <div className="wl-page-title wl-rise">
            <div className="wl-eyebrow">✦ Your Personal Collection</div>
            <h1 className="wl-h1">My Wishlist</h1>
            <div className="wl-ornament">
              <div className="wl-orn-line" />
              <div className="wl-orn-dot" />
              <span className="wl-count-text">
                {wishlist.length} treasured {wishlist.length === 1 ? 'item' : 'items'}
              </span>
              <div className="wl-orn-dot" />
              <div className="wl-orn-line" />
            </div>
          </div>

          {/* ── Quote banner ── */}
          <div className="wl-quote-banner wl-rise" style={{ animationDelay: '120ms' }}>
            <p className="wl-quote-text">"{quote.text}"</p>
            <div className="wl-quote-author">{quote.author}</div>
          </div>

          {/* ── Personalized bar (only when items exist) ── */}
          {!loading && wishlistProducts.length > 0 && (
            <div className="wl-persona wl-fade">
              <div className="wl-monogram">Y</div>
              <p className="wl-persona-text">
                <strong>Your curated edit</strong> — {wishlistProducts.length} piece{wishlistProducts.length !== 1 ? 's' : ''} saved with intention.
                {inStock < wishlistProducts.length &&
                  ` ${wishlistProducts.length - inStock} item${wishlistProducts.length - inStock > 1 ? 's are' : ' is'} in high demand.`}
                {inStock === wishlistProducts.length && wishlistProducts.length > 0 &&
                  ' All pieces are currently available.'}
              </p>
            </div>
          )}

          {/* ── Content ── */}
          {loading ? <Skeleton /> : wishlistProducts.length === 0 ? <EmptyWishlist /> : (
            <>
              {/* stats */}
              <div className="wl-stats">
                {[
                  {
                    label: 'Collection Value',
                    value: `KES ${fmt(totalVal)}`,
                    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
                  },
                  {
                    label: 'Average Price',
                    value: `KES ${fmt(avgPrice)}`,
                    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
                  },
                  {
                    label: 'Available Now',
                    value: `${inStock} of ${wishlistProducts.length} pieces`,
                    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
                  },
                ].map((s, i) => (
                  <div key={i} className="wl-stat wl-rise" style={{ animationDelay: `${200 + i * 80}ms` }}>
                    <div className="wl-stat-icon">{s.icon}</div>
                    <div>
                      <div className="wl-stat-label">{s.label}</div>
                      <div className="wl-stat-value">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* divider */}
              <div className="wl-divider">
                <div className="wl-div-line" /><div className="wl-div-dot" /><div className="wl-div-line" />
              </div>

              {/* product grid */}
              <div className="wl-grid">
                {wishlistProducts.map((product, i) => (
                  <WishlistCard
                    key={product.id}
                    product={product}
                    index={i}
                    onPreview={(p) => { setSelectedProduct(p); setIsModalOpen(true); }}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

            <ProductModal
        isOpen={isModalOpen}  // ← Use isModalOpen, not isOpen
        onClose={() => { 
          setIsModalOpen(false); 
          setSelectedProduct(null); 
        }}
        product={selectedProduct}
        onAddToCart={handleAdd}
        onToggleWishlist={toggleWishlist}
        wishlist={wishlist}  // Pass the IDs array from useWishlist
      />
    </>
  );
};

export default Wishlist;