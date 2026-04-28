// pages/Blogs.jsx
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Whatsapp from "../components/whatsapp";
import CartSidebar from "../components/CartSidebar";
import { useCart } from "../hooks/usecart";
import { useWishlist } from "../hooks/useWishlist";

// ── Free Makeup API — no key required ──────────────────────────────
// Returns real beauty product data: name, brand, description, image, link
const MAKEUP_API = "https://makeup-api.herokuapp.com/api/v1/products.json?product_type=";

// Product types we'll pull and present as journal "topics"
const TOPICS = [
  { key: "lipstick",   label: "Lip",       icon: "💄" },
  { key: "foundation", label: "Foundation", icon: "✨" },
  { key: "mascara",    label: "Lashes",     icon: "👁" },
  { key: "eyeshadow",  label: "Eyes",       icon: "🎨" },
  { key: "blush",      label: "Cheeks",     icon: "🌸" },
  { key: "skincare",   label: "Skincare",   icon: "🌿" },
];

// Curated Unsplash fallback images per category
const FALLBACKS = {
  lipstick:   "https://images.unsplash.com/photo-1586495777744-4e6232bf8e84?w=800&q=80",
  foundation: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80",
  mascara:    "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=800&q=80",
  eyeshadow:  "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&q=80",
  blush:      "https://images.unsplash.com/photo-1631730486784-74757e194a52?w=800&q=80",
  skincare:   "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
  default:    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
};

// Curated editorial intros shown in the hero area — rotates per session
const EDITORIAL_HEADLINES = [
  { title: "The New Minimalism",       sub: "Why less is more in your 2025 routine." },
  { title: "Ingredient Intelligence",  sub: "How to read a label like a beauty scientist." },
  { title: "The Wellness Edit",        sub: "Products that bridge beauty and self-care." },
  { title: "Clean Beauty, Defined",    sub: "What it actually means — and what it doesn't." },
];

function mapProduct(p, type) {
  return {
    id:          p.id,
    name:        p.name,
    brand:       p.brand || "Independent Brand",
    category:    p.product_type || type,
    description: p.description
      ? p.description.replace(/<[^>]*>/g, "").slice(0, 200)
      : `A premium ${type} crafted for your daily beauty ritual.`,
    image:       p.image_link || FALLBACKS[type] || FALLBACKS.default,
    price:       p.price ? `$${parseFloat(p.price).toFixed(2)}` : null,
    rating:      p.rating ? parseFloat(p.rating).toFixed(1) : null,
    link:        p.product_link || p.website_link || "#",
    tag:         type,
  };
}

export default function Blogs() {
  const [isCartOpen, setIsCartOpen]   = useState(false);
  const [activeTab, setActiveTab]     = useState("lipstick");
  const [allData, setAllData]         = useState({});   // { type: [products] }
  const [loadingTab, setLoadingTab]   = useState(true);
  const [error, setError]             = useState(false);
  const [featured, setFeatured]       = useState(null);
  const [search, setSearch]           = useState("");

  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { wishlist } = useWishlist();

  // Pick a random editorial headline once per session
  const headline = EDITORIAL_HEADLINES[
    Math.floor(Math.random() * EDITORIAL_HEADLINES.length)
  ];

  // Fetch a tab's data (cached in allData)
  useEffect(() => {
    if (allData[activeTab]) {
      setLoadingTab(false);
      return;
    }

    let cancelled = false;
    setLoadingTab(true);
    setError(false);

    fetch(`${MAKEUP_API}${activeTab}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const items = (Array.isArray(data) ? data : [])
          .filter(p => p.name && p.name.trim())
          .map(p => mapProduct(p, activeTab))
          .slice(0, 24);

        if (!items.length) { setError(true); setLoadingTab(false); return; }

        setAllData(prev => ({ ...prev, [activeTab]: items }));
        // Set global featured = first item with an image from first batch
        setFeatured(prev => prev || items.find(i => i.image) || items[0]);
        setLoadingTab(false);
      })
      .catch(() => { if (!cancelled) { setError(true); setLoadingTab(false); } });

    return () => { cancelled = true; };
  }, [activeTab]);

  const products = allData[activeTab] || [];
  const filtered = search.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const grid    = filtered.slice(1);
  const hero    = filtered[0] || null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .bl-root { background: #faf8f4; font-family: 'Jost', sans-serif; color: #2c2c2c; min-height: 100vh; }

        /* header */
        .bl-header { padding: 100px 0 60px; border-bottom: 1px solid #f0e7db; }
        .bl-eyebrow {
          font-size: 10px; letter-spacing: .35em; color: #b89b7b; font-weight: 300;
          margin-bottom: 20px; display: flex; align-items: center; gap: 14px;
        }
        .bl-eyebrow::before, .bl-eyebrow::after {
          content: ''; display: block; width: 32px; height: 1px;
          background: #b89b7b; opacity: .5;
        }
        .bl-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(44px, 6vw, 80px);
          font-weight: 200; line-height: 1; letter-spacing: -.02em; color: #2c2c2c;
          margin-bottom: 20px;
        }
        .bl-h1 em { font-style: italic; color: #b89b7b; }
        .bl-header-sub { font-size: 13px; font-weight: 300; color: #9a8c7e; line-height: 1.8; max-width: 420px; }

        /* search */
        .bl-search-wrap { position: relative; max-width: 380px; }
        .bl-search {
          width: 100%; padding: 11px 40px 11px 16px;
          border: 1px solid #e8d9c8; background: white;
          font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 300;
          color: #2c2c2c; outline: none;
          transition: border-color .25s;
        }
        .bl-search::placeholder { color: #bbb; }
        .bl-search:focus { border-color: #b89b7b; }
        .bl-search-icon { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); color: #c4b09a; pointer-events: none; }

        /* tabs */
        .bl-tabs { display: flex; gap: 0; border-bottom: 1px solid #f0e7db; overflow-x: auto; scrollbar-width: none; }
        .bl-tabs::-webkit-scrollbar { display: none; }
        .bl-tab {
          padding: 14px 22px; font-size: 10px; letter-spacing: .18em; font-weight: 300;
          color: #aaa; background: none; border: none; cursor: pointer;
          transition: color .2s; white-space: nowrap; border-bottom: 2px solid transparent;
          display: flex; align-items: center; gap: 6px;
        }
        .bl-tab:hover { color: #2c2c2c; }
        .bl-tab.active { color: #2c2c2c; border-bottom-color: #b89b7b; }

        /* featured */
        .bl-featured {
          display: grid; grid-template-columns: 1fr 1fr;
          background: white; border: 1px solid #f0e7db;
          text-decoration: none; margin-bottom: 56px;
          transition: box-shadow .3s;
        }
        .bl-featured:hover { box-shadow: 0 16px 48px rgba(44,44,44,.08); }
        .bl-featured-img { height: 440px; overflow: hidden; position: relative; }
        .bl-featured-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.22,1,.36,1); }
        .bl-featured:hover .bl-featured-img img { transform: scale(1.04); }
        .bl-featured-badge {
          position: absolute; top: 20px; left: 20px;
          background: rgba(250,247,242,.94); backdrop-filter: blur(8px);
          border: 1px solid rgba(184,155,123,.2);
          font-size: 9px; letter-spacing: .2em; color: #b89b7b;
          padding: 6px 14px;
        }
        .bl-featured-body { padding: 60px 52px; display: flex; flex-direction: column; justify-content: center; }
        .bl-featured-cat { font-size: 9px; letter-spacing: .28em; color: #b89b7b; margin-bottom: 16px; text-transform: uppercase; }
        .bl-featured-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px; font-weight: 300; color: #2c2c2c; line-height: 1.2; margin-bottom: 18px;
        }
        .bl-featured-desc { font-size: 13px; font-weight: 300; color: #888; line-height: 1.85; margin-bottom: 28px; }
        .bl-featured-meta { display: flex; align-items: center; gap: 18px; }
        .bl-featured-brand { font-size: 11px; font-weight: 400; color: #2c2c2c; letter-spacing: .06em; }
        .bl-featured-price { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; color: #b89b7b; }
        .bl-read-more {
          margin-top: 28px; display: inline-flex; align-items: center; gap: 8px;
          font-size: 9px; letter-spacing: .2em; color: #2c2c2c;
          border-bottom: 1px solid #2c2c2c; padding-bottom: 2px;
          align-self: flex-start; transition: color .2s, border-color .2s;
        }
        .bl-featured:hover .bl-read-more { color: #b89b7b; border-color: #b89b7b; }

        /* grid */
        .bl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1px; background: #f0e7db; border: 1px solid #f0e7db;
        }
        .bl-card {
          background: white; text-decoration: none;
          transition: background .3s;
          display: flex; flex-direction: column;
        }
        .bl-card:hover { background: #faf8f4; }
        .bl-card-img { height: 210px; overflow: hidden; position: relative; }
        .bl-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.22,1,.36,1); }
        .bl-card:hover .bl-card-img img { transform: scale(1.05); }
        .bl-card-tag {
          position: absolute; bottom: 12px; left: 12px;
          background: rgba(250,247,242,.92); backdrop-filter: blur(6px);
          font-size: 9px; letter-spacing: .16em; color: #b89b7b; padding: 4px 10px;
          border: 1px solid rgba(184,155,123,.18);
        }
        .bl-card-body { padding: 24px; flex: 1; display: flex; flex-direction: column; }
        .bl-card-brand { font-size: 9px; letter-spacing: .18em; color: #b89b7b; margin-bottom: 8px; text-transform: uppercase; }
        .bl-card-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; color: #2c2c2c; line-height: 1.25; margin-bottom: 10px; }
        .bl-card-desc { font-size: 11px; font-weight: 300; color: #999; line-height: 1.75; flex: 1; margin-bottom: 16px; }
        .bl-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .bl-card-price { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 300; color: #2c2c2c; }
        .bl-card-rating { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #b89b7b; }
        .bl-card-arrow { font-size: 9px; letter-spacing: .15em; color: #c4b09a; transition: color .2s; }
        .bl-card:hover .bl-card-arrow { color: #b89b7b; }

        /* loading / empty */
        .bl-center { text-align: center; padding: 80px 0; }
        .bl-spinner {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid #f0e7db; border-top-color: #b89b7b;
          animation: bl-spin .8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes bl-spin { to { transform: rotate(360deg); } }

        /* results count */
        .bl-results { font-size: 11px; color: #aaa; letter-spacing: .06em; margin-bottom: 28px; }
        .bl-results span { color: #b89b7b; }

        /* ── responsive ── */
        @media (max-width: 900px) {
          .bl-featured { grid-template-columns: 1fr; }
          .bl-featured-img { height: 280px; }
          .bl-featured-body { padding: 36px 32px; }
          .bl-header { padding: 80px 0 48px; }
        }
        @media (max-width: 600px) {
          .bl-featured-body { padding: 28px 22px; }
          .bl-featured-title { font-size: 26px; }
          .bl-grid { grid-template-columns: 1fr 1fr; }
          .bl-header { padding: 60px 0 36px; }
        }
        @media (max-width: 400px) {
          .bl-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Navbar wired to session ── */}
       <Navbar
          cartCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
          wishlistCount={wishlist.length}
          onMenuToggle={() => setIsMenuOpen(true)}
        />

      <div className="bl-root">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>

          {/* ══ HEADER ══ */}
          <header className="bl-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
              <div>
                <div className="bl-eyebrow">THE BEAUTY JOURNAL</div>
                <h1 className="bl-h1">
                  {headline.title.split(" ").map((w, i) =>
                    i === 1
                      ? <em key={i}> {w} </em>
                      : w + " "
                  )}
                </h1>
                <p className="bl-header-sub">{headline.sub}</p>
              </div>

              {/* Search */}
              <div className="bl-search-wrap">
                <input
                  className="bl-search"
                  type="text"
                  placeholder="Search products, brands…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <span className="bl-search-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                </span>
              </div>
            </div>
          </header>

          {/* ══ TOPIC TABS ══ */}
          <div className="bl-tabs" style={{ margin: "0 -40px", padding: "0 40px" }}>
            {TOPICS.map(t => (
              <button
                key={t.key}
                className={`bl-tab${activeTab === t.key ? " active" : ""}`}
                onClick={() => { setActiveTab(t.key); setSearch(""); }}
              >
                <span>{t.icon}</span>
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* ══ CONTENT ══ */}
          <div style={{ paddingTop: 48, paddingBottom: 100 }}>

            {/* Loading */}
            {loadingTab && (
              <div className="bl-center">
                <div className="bl-spinner" />
                <p style={{ fontSize: 12, color: "#b89b7b", letterSpacing: ".2em" }}>LOADING PRODUCTS…</p>
              </div>
            )}

            {/* Error */}
            {!loadingTab && error && (
              <div className="bl-center">
                <p style={{ fontSize: 13, color: "#b89b7b", letterSpacing: ".1em" }}>
                  Unable to load products right now. Please try again.
                </p>
              </div>
            )}

            {/* Results */}
            {!loadingTab && !error && filtered.length > 0 && (
              <>
                {/* Count */}
                <p className="bl-results">
                  Showing <span>{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
                  {search && <> for "<span>{search}</span>"</>}
                </p>

                {/* Featured card */}
                {hero && (
                  <a
                    href={hero.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bl-featured"
                  >
                    <div className="bl-featured-img">
                      <img
                        src={hero.image}
                        alt={hero.name}
                        onError={e => { e.target.onerror = null; e.target.src = FALLBACKS.default; }}
                      />
                      <div className="bl-featured-badge">FEATURED PICK</div>
                    </div>
                    <div className="bl-featured-body">
                      <p className="bl-featured-cat">{hero.category.replace(/_/g, " ")}</p>
                      <h2 className="bl-featured-title">{hero.name}</h2>
                      <p className="bl-featured-desc">{hero.description}</p>
                      <div className="bl-featured-meta">
                        <span className="bl-featured-brand">{hero.brand}</span>
                        {hero.price && <span className="bl-featured-price">{hero.price}</span>}
                        {hero.rating && (
                          <span className="bl-card-rating">
                            ★ {hero.rating}
                          </span>
                        )}
                      </div>
                      <span className="bl-read-more">
                        DISCOVER PRODUCT
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                      </span>
                    </div>
                  </a>
                )}

                {/* Grid */}
                {grid.length > 0 && (
                  <div className="bl-grid">
                    {grid.map(product => (
                      <a
                        key={product.id}
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bl-card"
                      >
                        <div className="bl-card-img">
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={e => { e.target.onerror = null; e.target.src = FALLBACKS[product.tag] || FALLBACKS.default; }}
                          />
                          <div className="bl-card-tag">{product.category.replace(/_/g, " ").toUpperCase()}</div>
                        </div>
                        <div className="bl-card-body">
                          <div className="bl-card-brand">{product.brand}</div>
                          <div className="bl-card-title">{product.name}</div>
                          <p className="bl-card-desc">{product.description.slice(0, 100)}…</p>
                          <div className="bl-card-footer">
                            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                              {product.price && <span className="bl-card-price">{product.price}</span>}
                              {product.rating && (
                                <span className="bl-card-rating">★ {product.rating}</span>
                              )}
                            </div>
                            <span className="bl-card-arrow">VIEW →</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* No results */}
            {!loadingTab && !error && filtered.length === 0 && (
              <div className="bl-center">
                <p style={{ fontSize: 13, color: "#b89b7b" }}>No products found for "{search}".</p>
                <button
                  onClick={() => setSearch("")}
                  style={{ marginTop: 12, fontSize: 10, letterSpacing: ".2em", color: "#2c2c2c", background: "none", border: "1px solid #e0d5c8", padding: "10px 20px", cursor: "pointer" }}
                >
                  CLEAR SEARCH
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
           <Whatsapp/>
      <Footer />

      {/* Cart sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        total={cartTotal}
      />
    </>
  );
}