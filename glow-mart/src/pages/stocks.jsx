// // pages/Products.jsx
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { toast, Toaster } from 'react-hot-toast';
// import Navbar from "../components/navbar";
// import Footer from "../components/footer";
// import ProductModal from "../components/productmodal";
// import CartSidebar from "../components/cartsidebar";
// import QuickViewModal from "../components/quickviewmodal";
// import NewsletterPopup from "../components/newsletterpopup";
// import RecentlyViewed from "../components/recentlyviewed";
// import { getProducts, getCategories, createOrder, checkStock } from "../api";
// import { useCart } from "../hooks/useCart";
// import { useWishlist } from "../hooks/useWishlist";

// /* ─────────────────────────────────────────────
//    THEME STYLES (unchanged UI)
// ───────────────────────────────────────────── */
// const ThemeStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@200;300;400;500&display=swap');

//     *, *::before, *::after { box-sizing: border-box; }

//     :root {
//       --bg-primary: #faf7f2;
//       --bg-secondary: #f5efe8;
//       --accent-primary: #b89b7b;
//       --accent-secondary: #c9a882;
//       --accent-dark: #9b7f62;
//       --text-primary: #2c2c2c;
//       --text-secondary: #6b6b6b;
//       --text-light: #888888;
//       --border-light: #f0e7db;
//       --border-medium: #e2d5c5;
//       --white-soft: #ffffff;
//       --shadow-sm: 0 4px 12px rgba(184, 155, 123, 0.08);
//       --shadow-md: 0 8px 24px rgba(184, 155, 123, 0.12);
//       --shadow-lg: 0 20px 40px rgba(184, 155, 123, 0.15);
//     }

//     body { 
//       font-family: 'Jost', sans-serif;
//       background-color: var(--bg-primary);
//       color: var(--text-primary);
//     }

//     .page-bg {
//       min-height: 100vh;
//       background: linear-gradient(135deg, #faf7f2 0%, #f5efe8 100%);
//       background-attachment: fixed;
//     }

//     .elegant-card {
//       background: var(--white-soft);
//       border: 1px solid var(--border-light);
//       box-shadow: var(--shadow-sm);
//       transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//     }
//     .elegant-card:hover {
//       border-color: var(--accent-primary);
//       box-shadow: var(--shadow-md);
//       transform: translateY(-4px);
//     }

//     .warm-glass {
//       background: rgba(255, 255, 255, 0.75);
//       backdrop-filter: blur(10px);
//       -webkit-backdrop-filter: blur(10px);
//       border: 1px solid rgba(184, 155, 123, 0.15);
//       box-shadow: 0 8px 32px rgba(184, 155, 123, 0.08);
//     }
//     .warm-glass-strong {
//       background: rgba(255, 255, 255, 0.9);
//       backdrop-filter: blur(16px);
//       -webkit-backdrop-filter: blur(16px);
//       border: 1px solid rgba(184, 155, 123, 0.2);
//       box-shadow: var(--shadow-md);
//     }

//     .elegant-input {
//       background: var(--white-soft);
//       border: 1px solid var(--border-light);
//       color: var(--text-primary);
//       transition: all 0.3s;
//       font-family: 'Jost', sans-serif;
//     }
//     .elegant-input::placeholder { color: var(--text-light); font-weight: 300; }
//     .elegant-input:focus {
//       outline: none;
//       border-color: var(--accent-primary);
//       box-shadow: 0 0 0 3px rgba(184, 155, 123, 0.1);
//     }

//     .btn-primary {
//       background: var(--accent-primary);
//       border: none;
//       color: white;
//       font-family: 'Jost', sans-serif;
//       font-weight: 400;
//       letter-spacing: 0.05em;
//       transition: all 0.25s;
//       box-shadow: 0 4px 12px rgba(184, 155, 123, 0.3);
//     }
//     .btn-primary:hover:not(:disabled) {
//       background: var(--accent-secondary);
//       box-shadow: 0 8px 20px rgba(184, 155, 123, 0.4);
//       transform: translateY(-2px);
//     }
//     .btn-primary:active:not(:disabled) { transform: scale(0.98); }
//     .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

//     .btn-dark {
//       background: var(--text-primary);
//       border: none;
//       color: white;
//       font-family: 'Jost', sans-serif;
//       font-weight: 400;
//       letter-spacing: 0.05em;
//       transition: all 0.25s;
//     }
//     .btn-dark:hover:not(:disabled) {
//       background: var(--accent-primary);
//       transform: translateY(-2px);
//       box-shadow: var(--shadow-md);
//     }

//     .btn-outline {
//       background: transparent;
//       border: 1px solid var(--border-medium);
//       color: var(--text-secondary);
//       font-family: 'Jost', sans-serif;
//       transition: all 0.25s;
//     }
//     .btn-outline:hover {
//       background: var(--white-soft);
//       border-color: var(--accent-primary);
//       color: var(--accent-primary);
//     }

//     .pill {
//       background: var(--white-soft);
//       border: 1px solid var(--border-light);
//       color: var(--text-secondary);
//       transition: all 0.25s;
//       font-family: 'Jost', sans-serif;
//       font-weight: 300;
//     }
//     .pill:hover { border-color: var(--accent-primary); color: var(--accent-primary); background: white; }
//     .pill-active {
//       background: var(--accent-primary);
//       border-color: var(--accent-primary);
//       color: white;
//       font-weight: 400;
//       box-shadow: 0 4px 12px rgba(184, 155, 123, 0.3);
//     }

//     .product-img-wrap { overflow: hidden; }
//     .product-img-wrap img { transition: transform 0.7s cubic-bezier(.4,0,.2,1); }
//     .elegant-card:hover .product-img-wrap img { transform: scale(1.08); }

//     .badge-new { background: var(--text-primary); color: white; border: 1px solid rgba(255,255,255,0.1); }
//     .badge-bestseller { background: var(--accent-primary); color: white; }
//     .badge-sale { background: #dc2626; color: white; }
//     .badge-low { background: #ea580c; color: white; }
//     .badge-oos { background: #6b7280; color: white; }

//     .tooltip {
//       position: absolute;
//       bottom: calc(100% + 10px);
//       right: 0;
//       white-space: nowrap;
//       background: var(--text-primary);
//       color: white;
//       font-size: 12px;
//       padding: 6px 12px;
//       border-radius: 6px;
//       opacity: 0;
//       pointer-events: none;
//       transform: translateY(4px);
//       transition: all 0.2s;
//       box-shadow: var(--shadow-sm);
//     }
//     .tooltip::after {
//       content: '';
//       position: absolute;
//       top: 100%; right: 16px;
//       border: 5px solid transparent;
//       border-top-color: var(--text-primary);
//     }
//     .cart-btn-wrap:hover .tooltip { opacity: 1; transform: translateY(0); }

//     @keyframes cartPop {
//       0%   { box-shadow: 0 0 0 0 rgba(184,155,123,0.8); }
//       70%  { box-shadow: 0 0 0 10px rgba(184,155,123,0); }
//       100% { box-shadow: 0 0 0 0 rgba(184,155,123,0); }
//     }
//     .cart-pop { animation: cartPop 0.5s ease-out; }

//     @keyframes wishPulse {
//       0%,100% { transform: scale(1); }
//       50%      { transform: scale(1.22); }
//     }
//     .wish-active { animation: wishPulse 0.35s ease; color: #dc2626; fill: #dc2626; }

//     @keyframes shimmer {
//       0%   { background-position: -600px 0; }
//       100% { background-position: 600px 0; }
//     }
//     .skeleton {
//       background: linear-gradient(90deg, #f0e7db 25%, #f5efe8 37%, #f0e7db 63%);
//       background-size: 600px 100%;
//       animation: shimmer 1.4s infinite;
//       border-radius: 8px;
//     }

//     ::-webkit-scrollbar { width: 6px; }
//     ::-webkit-scrollbar-track { background: var(--border-light); }
//     ::-webkit-scrollbar-thumb { background: var(--accent-primary); border-radius: 99px; }

//     @keyframes float {
//       0%,100% { transform: translateY(0); }
//       50% { transform: translateY(-10px); }
//     }
//     .float { animation: float 6s ease-in-out infinite; }

//     .elegant-select {
//       background: var(--white-soft);
//       border: 1px solid var(--border-light);
//       color: var(--text-primary);
//       font-family: 'Jost', sans-serif;
//       border-radius: 999px;
//       appearance: none;
//       cursor: pointer;
//       transition: all 0.25s;
//     }
//     .elegant-select:focus {
//       outline: none;
//       border-color: var(--accent-primary);
//       box-shadow: 0 0 0 3px rgba(184, 155, 123, 0.1);
//     }
//     .elegant-select option { background: white; color: var(--text-primary); }

//     .star-filled { color: #fbbf24; fill: #fbbf24; }
//     .star-empty { color: var(--border-medium); }

//     @keyframes fadeUp {
//       from { opacity: 0; transform: translateY(20px); }
//       to   { opacity: 1; transform: translateY(0); }
//     }
//     .fade-up { animation: fadeUp 0.6s ease both; }
//     .fade-up-d1 { animation-delay: 0.1s; }
//     .fade-up-d2 { animation-delay: 0.2s; }

//     .quick-view-btn {
//       opacity: 0;
//       transform: translateX(12px);
//       transition: all 0.25s cubic-bezier(.4,0,.2,1);
//     }
//     .elegant-card:hover .quick-view-btn { opacity: 1; transform: translateX(0); }

//     .view-toggle { background: white; border: 1px solid var(--border-light); border-radius: 999px; overflow: hidden; }
//     .view-btn-active { background: var(--accent-primary); color: white; }
//     .view-btn-inactive { background: transparent; color: var(--text-secondary); }
//     .view-btn-inactive:hover { background: var(--bg-secondary); color: var(--text-primary); }

//     .results-panel {
//       background: rgba(255,255,255,0.7);
//       backdrop-filter: blur(4px);
//       border: 1px solid var(--border-light);
//       border-radius: 999px;
//       padding: 8px 18px;
//     }

//     .page-btn {
//       width: 40px; height: 40px;
//       border-radius: 8px;
//       background: white;
//       border: 1px solid var(--border-light);
//       color: var(--text-secondary);
//       transition: all 0.2s;
//       display: flex; align-items: center; justify-content: center;
//       font-family: 'Jost', sans-serif;
//       cursor: pointer;
//     }
//     .page-btn:hover:not(:disabled) { border-color: var(--accent-primary); color: var(--accent-primary); }
//     .page-btn-active { background: var(--accent-primary); border-color: var(--accent-primary); color: white; }
//     .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

//     @keyframes bounce {
//       0%,100% { transform: translateY(0); }
//       50% { transform: translateY(-10px); }
//     }
//     .bounce { animation: bounce 2s ease-in-out infinite; }

//     .display-font { font-family: 'Cormorant Garamond', serif; }

//     .filter-dot {
//       width: 7px; height: 7px;
//       background: var(--accent-primary);
//       border-radius: 50%;
//       display: inline-block;
//       margin-left: 5px;
//       vertical-align: middle;
//     }

//     .clear-btn {
//       padding: 7px 14px;
//       border-radius: 999px;
//       font-size: 12px;
//       background: transparent;
//       border: 1px solid #dc2626;
//       color: #dc2626;
//       cursor: pointer;
//       font-family: 'Jost', sans-serif;
//       display: flex;
//       align-items: center;
//       gap: 4px;
//       transition: all 0.2s;
//     }
//     .clear-btn:hover { background: #fef2f2; }
//   `}</style>
// );

// /* ═══════════════════════════════════════════
//    FILTER UTILITY FUNCTIONS
// ═══════════════════════════════════════════ */

// /** Maps UI sort key → Django ordering string sent to API */
// const toApiOrdering = (sortBy) => ({
//   popular:    '-sales_count',
//   rating:     '-rating',
//   'price-low':  'price',
//   'price-high': '-price',
//   newest:     '-created_at',
//   name:       'name',
// }[sortBy] || '-sales_count');

// /**
//  * Client-side sort — runs after API fetch.
//  * Guarantees correct order even if API ignores `ordering` param.
//  */
// const applySort = (arr, sortBy) => {
//   const list = [...arr];
//   switch (sortBy) {
//     case 'price-low':
//       return list.sort((a, b) => Number(a.price) - Number(b.price));
//     case 'price-high':
//       return list.sort((a, b) => Number(b.price) - Number(a.price));
//     case 'rating':
//       return list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
//     case 'newest':
//       return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
//     case 'name':
//       return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'en', { sensitivity: 'base' }));
//     case 'popular':
//     default:
//       return list.sort((a, b) => Number(b.sales_count || 0) - Number(a.sales_count || 0));
//   }
// };

// /**
//  * Client-side price filter — double-checks API range filtering.
//  * min / max are strings from inputs; treated as "no limit" when empty.
//  */
// const applyPriceFilter = (arr, min, max) => {
//   const lo = min !== '' && min !== null ? Number(min) : null;
//   const hi = max !== '' && max !== null ? Number(max) : null;
//   return arr.filter(p => {
//     const price = Number(p.price);
//     if (lo !== null && price < lo) return false;
//     if (hi !== null && price > hi) return false;
//     return true;
//   });
// };

// /**
//  * Client-side search — secondary guard after API search.
//  * Searches name, brand, description, tags.
//  */
// const applySearch = (arr, term) => {
//   if (!term || !term.trim()) return arr;
//   const q = term.trim().toLowerCase();
//   return arr.filter(p =>
//     (p.name        || '').toLowerCase().includes(q) ||
//     (p.brand       || '').toLowerCase().includes(q) ||
//     (p.supplier_name || '').toLowerCase().includes(q) ||
//     (p.description || '').toLowerCase().includes(q) ||
//     (p.tags        || '').toLowerCase().includes(q)
//   );
// };

// /**
//  * CLIENT-SIDE CATEGORY FILTER — handles every shape Django REST can return.
//  *
//  * Django can represent a product's category as:
//  *   { category: 3 }                              → plain integer FK
//  *   { category: "3" }                            → string FK
//  *   { category: { id: 3, name: "Supplements" } } → nested object
//  *   { category_id: 3 }                           → flat _id suffix field
//  *   { category_name: "Supplements" }             → flat _name suffix field
//  *   { categories: [3, 7] }                       → array of IDs (M2M)
//  *
//  * We check ALL of these so it works regardless of your serializer.
//  */
// const applyCategory = (arr, selectedCategoryId, categories) => {
//   if (!selectedCategoryId || selectedCategoryId === 'all') return arr;

//   const selId  = String(selectedCategoryId);          // "3"
//   const selIdN = Number(selectedCategoryId);           // 3

//   // Find the human name of the selected category (for name-based fallback)
//   const catObj  = (categories || []).find(c => String(c.id) === selId);
//   const selName = catObj ? catObj.name.toLowerCase().trim() : null;

//   return arr.filter(p => {
//     // ── 1. p.category is a primitive (number or string id) ──────────
//     const cat = p.category;
//     if (cat !== null && cat !== undefined && typeof cat !== 'object' && !Array.isArray(cat)) {
//       if (String(cat) === selId) return true;
//     }

//     // ── 2. p.category is a nested object { id, name } ───────────────
//     if (cat && typeof cat === 'object' && !Array.isArray(cat)) {
//       if (String(cat.id) === selId) return true;
//       if (selName && (cat.name || '').toLowerCase().trim() === selName) return true;
//     }

//     // ── 3. p.category_id flat field ─────────────────────────────────
//     if (p.category_id !== undefined && p.category_id !== null) {
//       if (String(p.category_id) === selId) return true;
//     }

//     // ── 4. p.category_name flat field ───────────────────────────────
//     if (selName && p.category_name) {
//       if (p.category_name.toLowerCase().trim() === selName) return true;
//     }

//     // ── 5. p.category or p.categories is an array (M2M) ────────────
//     const arrField = Array.isArray(cat) ? cat : (Array.isArray(p.categories) ? p.categories : null);
//     if (arrField) {
//       return arrField.some(c => {
//         if (c === null || c === undefined) return false;
//         if (typeof c !== 'object') return String(c) === selId;
//         if (String(c.id) === selId) return true;
//         if (selName && (c.name || '').toLowerCase().trim() === selName) return true;
//         return false;
//       });
//     }

//     return false;
//   });
// };

// /**
//  * Client-side concern / tag filter.
//  * Maps concern id → keywords to look for in product metadata.
//  */
// const applyConc = (arr, concern) => {
//   if (!concern || concern === 'all') return arr;
//   const kwMap = {
//     brightening:     ['brighten', 'glow', 'vitamin c', 'niacinamide', 'radiant'],
//     'anti-aging':    ['anti-ag', 'retinol', 'wrinkle', 'collagen', 'firming', 'peptide'],
//     hydration:       ['hydrat', 'moistur', 'hyaluronic', 'aloe', 'aqua', 'water'],
//     'hair-skin-nails': ['hair', 'nail', 'biotin', 'keratin', 'scalp'],
//     immunity:        ['immun', 'vitamin d', 'zinc', 'elderberry', 'probiotic'],
//     sleep:           ['sleep', 'melatonin', 'calm', 'rest', 'night'],
//     relaxation:      ['relax', 'stress', 'lavender', 'magnesium', 'calm', 'anxiety'],
//   };
//   const keywords = kwMap[concern] || [concern.replace(/-/g, ' ')];
//   return arr.filter(p => {
//     const hay = [p.name, p.brand, p.description, p.tags, p.category_name, p.concern]
//       .filter(Boolean).join(' ').toLowerCase();
//     return keywords.some(kw => hay.includes(kw));
//   });
// };

// /* ═══════════════════════════════════════════
//    MAIN PAGE
// ═══════════════════════════════════════════ */
// const Products = () => {
//   /* Raw API data */
//   const [allProducts, setAllProducts] = useState([]);
//   const [categories, setCategories]   = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [error, setError]             = useState(null);

//   /* Filter / sort state */
//   const [searchTerm, setSearchTerm]                 = useState('');
//   const [selectedCategory, setSelectedCategory]     = useState('all');
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [selectedConcern, setSelectedConcern]       = useState('all');
//   const [sortBy, setSortBy]                         = useState('popular');
//   const [viewMode, setViewMode]                     = useState('grid');
//   const [priceRange, setPriceRange]                 = useState({ min: '', max: '' });
//   const [currentPage, setCurrentPage]               = useState(1);
//   const [itemsPerPage]                              = useState(12);
//   const [showNewsletter, setShowNewsletter]         = useState(false);

//   /* Derived display state */
//   const [displayProducts, setDisplayProducts] = useState([]);
//   const [totalDisplay, setTotalDisplay]       = useState(0);

//   /* Debounce ref */
//   const searchTimer = useRef(null);

//   const { cart, addToCart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
//   const { wishlist, toggleWishlist } = useWishlist();

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen]         = useState(false);
//   const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen]           = useState(false);

//   /* ─── STEP 1: API FETCH ───────────────────────────────────
//      Triggered when category, search, sort, or price changes.
//      We fetch a large page (500) so client-side filters have
//      the full dataset to work with — no second network request.
//   ─────────────────────────────────────────────────────────── */
//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       /* Categories (fetched once regardless) */
//       const catRes = await getCategories();
//       const cats = Array.isArray(catRes.data)
//         ? catRes.data
//         : (catRes.data?.results || []);
//       setCategories(cats);

//       /* Build API params */
//       const params = {
//         page:      1,
//         page_size: 500,
//         ordering:  toApiOrdering(sortBy),
//       };
//       if (selectedCategoryId)                      params.category  = selectedCategoryId;
//       if (searchTerm.trim())                       params.search    = searchTerm.trim();
//       if (priceRange.min !== '')                   params.min_price = Number(priceRange.min);
//       if (priceRange.max !== '')                   params.max_price = Number(priceRange.max);

//       const res = await getProducts(params);
//       const raw = Array.isArray(res.data)
//         ? res.data
//         : (res.data?.results || []);

//       setAllProducts(raw);

//       // ── DEBUG: log the first product's category fields so you can
//       //    confirm the shape your API returns. Remove after testing.
//       if (raw.length > 0) {
//         const sample = raw[0];
//         console.log('[Category debug] First product:', {
//           id:            sample.id,
//           name:          sample.name,
//           category:      sample.category,
//           category_id:   sample.category_id,
//           category_name: sample.category_name,
//           categories:    sample.categories,
//         });
//       }

//       /* Newsletter timer */
//       const t = setTimeout(() => {
//         if (!localStorage.getItem('newsletterShown')) setShowNewsletter(true);
//       }, 30000);
//       return () => clearTimeout(t);

//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Failed to load products. Please refresh.');
//       toast.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedCategoryId, searchTerm, sortBy, priceRange.min, priceRange.max]);

//   useEffect(() => { fetchProducts(); }, [fetchProducts]);

//   /* ─── STEP 2: CLIENT-SIDE PIPELINE ───────────────────────
//      Runs synchronously whenever raw data or any filter changes.
//      No network call — instant feedback.
//      Order: search → price → concern → sort → paginate
//   ─────────────────────────────────────────────────────────── */
//   useEffect(() => {
//     let result = [...allProducts];

//     // 1. Category — client-side guarantee (handles all Django serializer shapes)
//     result = applyCategory(result, selectedCategoryId, categories);

//     // 2. Search
//     result = applySearch(result, searchTerm);

//     // 3. Price range
//     result = applyPriceFilter(result, priceRange.min, priceRange.max);

//     // 4. Concern / tag
//     result = applyConc(result, selectedConcern);

//     // 5. Sort
//     result = applySort(result, sortBy);

//     setTotalDisplay(result.length);
//     const start = (currentPage - 1) * itemsPerPage;
//     setDisplayProducts(result.slice(start, start + itemsPerPage));
//   }, [allProducts, selectedCategoryId, categories, searchTerm, priceRange, selectedConcern, sortBy, currentPage, itemsPerPage]);

//   /* ─── FILTER HANDLERS ──────────────────────────────────── */
//   const handleCategoryChange = (id) => {
//     setSelectedCategory(id);
//     setSelectedCategoryId(id === 'all' ? null : id);
//     setCurrentPage(1);                  // reset page on category change
//   };

//   const handleSearchChange = (value) => {
//     setSearchTerm(value);
//     clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => setCurrentPage(1), 350); // debounced page reset
//   };

//   const handlePriceChange = (field, value) => {
//     // Allow empty string (cleared) or positive numbers only
//     if (value !== '' && Number(value) < 0) return;
//     setPriceRange(prev => ({ ...prev, [field]: value }));
//     setCurrentPage(1);
//   };

//   const handleSortChange = (value) => { setSortBy(value);    setCurrentPage(1); };
//   const handleConcern    = (value) => { setSelectedConcern(value); setCurrentPage(1); };

//   const handleClearFilters = () => {
//     setSearchTerm('');
//     setSelectedCategory('all');
//     setSelectedCategoryId(null);
//     setSelectedConcern('all');
//     setSortBy('popular');
//     setPriceRange({ min: '', max: '' });
//     setCurrentPage(1);
//   };

//   /* ─── CART / PRODUCT HANDLERS ──────────────────────────── */
//   const handleAddToCart = async (product, quantity = 1) => {
//     try {
//       const stockCheck = await checkStock(product.id, quantity);
//       if (stockCheck.data.available) {
//         addToCart({ ...product, image: product.image || product.image_url }, quantity);
//         toast.success(`${product.name} added to cart!`, { icon: '🛍️', duration: 2500 });
//       } else {
//         toast.error(`Only ${stockCheck.data.available_stock} left in stock`);
//       }
//     } catch {
//       addToCart({ ...product, image: product.image || product.image_url }, quantity);
//       toast.success(`${product.name} added to cart!`, { icon: '🛍️', duration: 2500 });
//     }
//   };

//   const handleQuickView    = (p) => { setSelectedProduct(p); setIsQuickViewOpen(true); };
//   const handleProductClick = (p) => {
//     setSelectedProduct(p);
//     setIsModalOpen(true);
//     const rv = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
//     localStorage.setItem('recentlyViewed',
//       JSON.stringify([p, ...rv.filter(x => x.id !== p.id)].slice(0, 10)));
//   };

//   const handleCheckout = async (customerDetails) => {
//     try {
//       const orderData = {
//         items: cart.map(item => ({
//           product_id: item.id, quantity: item.quantity,
//           price: item.price, name: item.name,
//           sku: item.sku || `SKU-${item.id}`
//         })),
//         subtotal: cartTotal,
//         shipping: cartTotal > 10000 ? 0 : 300,
//         tax: cartTotal * 0.08,
//         total: cartTotal + (cartTotal > 10000 ? 0 : 300) + (cartTotal * 0.08),
//         customer: {
//           name: customerDetails.name, email: customerDetails.email,
//           phone: customerDetails.phone, address: customerDetails.address,
//           city: customerDetails.city, state: customerDetails.state,
//           zip_code: customerDetails.zipCode, country: customerDetails.country || 'KE'
//         },
//         payment_method: customerDetails.paymentMethod,
//         shipping_method: customerDetails.shippingMethod,
//         notes: customerDetails.notes,
//         order_date: new Date().toISOString(),
//         status: 'pending'
//       };
//       const response = await createOrder(orderData);
//       if (response.data) {
//         toast.success('Order placed! Check your email for confirmation.', { duration: 5000, icon: '✨' });
//         cart.forEach(item => removeFromCart(item.id));
//         setIsCartOpen(false);
//         if (window.gtag) window.gtag('event', 'purchase', {
//           transaction_id: response.data.order_number || response.data.id,
//           value: orderData.total, currency: 'KES'
//         });
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
//     }
//   };

//   const hasActiveFilters = !!(
//     searchTerm ||
//     selectedCategoryId ||
//     selectedConcern !== 'all' ||
//     sortBy !== 'popular' ||
//     priceRange.min !== '' ||
//     priceRange.max !== ''
//   );

//   if (error) return (
//     <div className="page-bg min-h-screen flex items-center justify-center">
//       <ThemeStyles />
//       <div className="elegant-card rounded-3xl p-12 text-center max-w-md mx-4">
//         <div className="text-7xl mb-6 float">✨</div>
//         <h2 className="display-font text-3xl font-light text-[#2c2c2c] mb-3">Something went wrong</h2>
//         <p className="text-[#6b6b6b] mb-8 font-light">{error}</p>
//         <button onClick={() => fetchProducts()} className="btn-dark px-8 py-3 rounded-xl">Try Again</button>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <ThemeStyles />
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: 'white', border: '1px solid var(--border-light)',
//             color: 'var(--text-primary)', fontFamily: "'Jost', sans-serif",
//             borderRadius: '12px', boxShadow: 'var(--shadow-md)',
//           },
//         }}
//       />

//       <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} wishlistCount={wishlist.length} />

//       <main className="page-bg py-12">
//         <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>

//           <HeroSection />

//           <SearchAndFilters
//             searchTerm={searchTerm}
//             onSearchChange={handleSearchChange}
//             selectedCategory={selectedCategory}
//             onCategoryChange={handleCategoryChange}
//             categories={categories}
//             selectedConcern={selectedConcern}
//             onConcernChange={handleConcern}
//             sortBy={sortBy}
//             onSortChange={handleSortChange}
//             viewMode={viewMode}
//             onViewModeChange={setViewMode}
//             priceRange={priceRange}
//             onPriceChange={handlePriceChange}
//             hasActiveFilters={hasActiveFilters}
//             onClearFilters={handleClearFilters}
//           />

//           <ResultsStats
//             total={totalDisplay}
//             start={displayProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
//             end={Math.min(currentPage * itemsPerPage, totalDisplay)}
//             loading={loading}
//             hasActiveFilters={hasActiveFilters}
//           />

//           {loading ? <LoadingSkeleton /> : (
//             <>
//               {displayProducts.length === 0 ? (
//                 <EmptyState onClear={handleClearFilters} hasFilters={hasActiveFilters} />
//               ) : (
//                 <>
//                   {viewMode === 'grid' ? (
//                     <ProductGrid
//                       products={displayProducts}
//                       onProductClick={handleProductClick}
//                       onQuickView={handleQuickView}
//                       onAddToCart={handleAddToCart}
//                       wishlist={wishlist}
//                       onToggleWishlist={toggleWishlist}
//                     />
//                   ) : (
//                     <ProductList
//                       products={displayProducts}
//                       onProductClick={handleProductClick}
//                       onQuickView={handleQuickView}
//                       onAddToCart={handleAddToCart}
//                       wishlist={wishlist}
//                       onToggleWishlist={toggleWishlist}
//                     />
//                   )}
//                   {Math.ceil(totalDisplay / itemsPerPage) > 1 && (
//                     <Pagination
//                       currentPage={currentPage}
//                       pageCount={Math.ceil(totalDisplay / itemsPerPage)}
//                       onPageChange={setCurrentPage}
//                     />
//                   )}
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </main>

//       <RecentlyViewed onProductClick={handleProductClick} />

//       <ProductModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         product={selectedProduct}
//         onAddToCart={handleAddToCart}
//         onToggleWishlist={toggleWishlist}
//         isInWishlist={wishlist.includes(selectedProduct?.id)}
//       />

//       <QuickViewModal
//         isOpen={isQuickViewOpen}
//         onClose={() => setIsQuickViewOpen(false)}
//         product={selectedProduct}
//         onAddToCart={handleAddToCart}
//         onViewDetails={() => { setIsQuickViewOpen(false); setIsModalOpen(true); }}
//       />

//       <CartSidebar
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         cart={cart}
//         onUpdateQuantity={updateQuantity}
//         onRemoveItem={removeFromCart}
//         onCheckout={handleCheckout}
//         total={cartTotal}
//       />

//       <NewsletterPopup
//         isOpen={showNewsletter}
//         onClose={() => { setShowNewsletter(false); localStorage.setItem('newsletterShown', 'true'); }}
//       />

//       <Footer />
//     </>
//   );
// };

// /* ═══════════════════════════════════════════
//    HERO (unchanged)
// ═══════════════════════════════════════════ */
// const HeroSection = () => (
//   <div className="fade-up mb-20 text-center relative" style={{ padding: '48px 32px 64px' }}>
//     <div className="float" style={{ position: 'absolute', top: 20, left: '5%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,155,123,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
//     <div className="float" style={{ position: 'absolute', bottom: 20, right: '8%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,155,123,0.08) 0%, transparent 70%)', animationDelay: '2s', pointerEvents: 'none' }} />

//     <div className="warm-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 28px', borderRadius: 999, marginBottom: 32 }}>
//       <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b89b7b' }} />
//       <span style={{ fontSize: 11, letterSpacing: '0.2em', color: '#6b6b6b', fontWeight: 300 }}>BEAUTY & WELLNESS COLLECTION</span>
//       <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b89b7b' }} />
//     </div>

//     <h1 className="display-font" style={{ fontSize: 'clamp(48px, 8vw, 86px)', fontWeight: 300, color: '#2c2c2c', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
//       Curated for Your<br />
//       <span style={{ color: '#b89b7b', fontStyle: 'italic' }}>Natural Beauty</span>
//     </h1>

//     <p style={{ fontSize: 18, color: '#6b6b6b', fontWeight: 300, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
//       Discover clean, effective products thoughtfully selected for your self-care journey.
//     </p>

//     <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
//       {['100% Authentic', 'Free Shipping KES 10k+', 'Secure Checkout', 'Easy Returns'].map(s => (
//         <div key={s} className="warm-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 999 }}>
//           <span style={{ color: '#b89b7b', fontSize: 14 }}>✓</span>
//           <span style={{ fontSize: 13, color: '#6b6b6b', fontWeight: 300 }}>{s}</span>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// /* ═══════════════════════════════════════════
//    SEARCH & FILTERS
// ═══════════════════════════════════════════ */
// const SearchAndFilters = ({
//   searchTerm, onSearchChange, selectedCategory, onCategoryChange, categories,
//   selectedConcern, onConcernChange, sortBy, onSortChange, viewMode, onViewModeChange,
//   priceRange, onPriceChange, hasActiveFilters, onClearFilters
// }) => {
//   const concerns = [
//     { id: 'all',           name: 'All Concerns' },
//     { id: 'brightening',   name: 'Brightening' },
//     { id: 'anti-aging',    name: 'Anti-Aging' },
//     { id: 'hydration',     name: 'Hydration' },
//     { id: 'hair-skin-nails', name: 'Hair, Skin & Nails' },
//     { id: 'immunity',      name: 'Immunity' },
//     { id: 'sleep',         name: 'Sleep' },
//     { id: 'relaxation',    name: 'Relaxation' },
//   ];

//   return (
//     <div className="fade-up fade-up-d1" style={{ marginBottom: 48 }}>
//       {/* Search bar */}
//       <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto 32px' }}>
//         <input
//           type="text"
//           placeholder="Search products, brands, ingredients..."
//           value={searchTerm}
//           onChange={e => onSearchChange(e.target.value)}
//           className="elegant-input"
//           style={{ width: '100%', padding: '16px 56px', borderRadius: 999, fontSize: 15 }}
//         />
//         <SearchIcon style={{ position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)', color: '#b89b7b', width: 20, height: 20 }} />
//         {searchTerm && (
//           <button
//             onClick={() => onSearchChange('')}
//             style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'white', border: '1px solid #f0e7db', borderRadius: 999, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b6b6b', fontSize: 14 }}
//           >✕</button>
//         )}
//       </div>

//       {/* Category pills */}
//       <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
//         <CategoryPills categories={categories} selected={selectedCategory} onChange={onCategoryChange} />
//       </div>

//       {/* Advanced filters bar */}
//       <div className="warm-glass-strong" style={{ borderRadius: 999, padding: '12px 24px' }}>
//         <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

//           {/* Left: concern + price + clear */}
//           <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>

//             {/* Concern */}
//             <div style={{ position: 'relative' }}>
//               <select
//                 value={selectedConcern}
//                 onChange={e => onConcernChange(e.target.value)}
//                 className="elegant-select"
//                 style={{ padding: '8px 32px 8px 16px', fontSize: 13 }}
//               >
//                 {concerns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//               <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#b89b7b', fontSize: 11 }}>▼</span>
//             </div>

//             {/* Price range */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <input
//                 type="number"
//                 placeholder="Min KES"
//                 value={priceRange.min}
//                 onChange={e => onPriceChange('min', e.target.value)}
//                 className="elegant-input"
//                 style={{ width: 95, padding: '8px 12px', borderRadius: 999, fontSize: 13 }}
//                 min="0"
//               />
//               <span style={{ color: '#b89b7b', fontSize: 14, flexShrink: 0 }}>—</span>
//               <input
//                 type="number"
//                 placeholder="Max KES"
//                 value={priceRange.max}
//                 onChange={e => onPriceChange('max', e.target.value)}
//                 className="elegant-input"
//                 style={{ width: 95, padding: '8px 12px', borderRadius: 999, fontSize: 13 }}
//                 min="0"
//               />
//             </div>

//             {/* Clear — only visible when filters are active */}
//             {hasActiveFilters && (
//               <button className="clear-btn" onClick={onClearFilters}>
//                 ✕ Clear filters
//               </button>
//             )}
//           </div>

//           {/* Right: sort + view toggle */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <div style={{ position: 'relative' }}>
//               <select
//                 value={sortBy}
//                 onChange={e => onSortChange(e.target.value)}
//                 className="elegant-select"
//                 style={{ padding: '8px 32px 8px 16px', fontSize: 13 }}
//               >
//                 <option value="popular">🔥 Most Popular</option>
//                 <option value="rating">⭐ Highest Rated</option>
//                 <option value="price-low">↑ Price: Low to High</option>
//                 <option value="price-high">↓ Price: High to Low</option>
//                 <option value="newest">✨ Newest First</option>
//                 <option value="name">A–Z Name</option>
//               </select>
//               <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#b89b7b', fontSize: 11 }}>▼</span>
//             </div>
//             <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── Category Pills ─── */
// const CategoryPills = ({ categories, selected, onChange }) => {
//   const all  = [{ id: 'all', name: 'All Products', icon: '🛍️' }];
//   const cats = (Array.isArray(categories) ? categories : []).map(c => ({ id: c.id, name: c.name, icon: c.icon || '📦' }));
//   return (
//     <>
//       {[...all, ...cats].map(cat => (
//         <button
//           key={cat.id}
//           onClick={() => onChange(cat.id)}
//           className={`pill ${selected === cat.id ? 'pill-active' : ''}`}
//           style={{ padding: '8px 22px', borderRadius: 999, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
//         >
//           <span style={{ fontSize: 14 }}>{cat.icon}</span>
//           {cat.name}
//         </button>
//       ))}
//     </>
//   );
// };

// /* ─── View Toggle ─── */
// const ViewToggle = ({ viewMode, onViewModeChange }) => (
//   <div className="view-toggle" style={{ display: 'flex' }}>
//     {['grid', 'list'].map(m => (
//       <button
//         key={m}
//         onClick={() => onViewModeChange(m)}
//         className={viewMode === m ? 'view-btn-active' : 'view-btn-inactive'}
//         style={{ padding: '8px 14px', cursor: 'pointer', border: 'none', transition: 'all 0.2s', fontSize: 13 }}
//       >
//         {m === 'grid' ? <GridIcon /> : <ListIcon />}
//       </button>
//     ))}
//   </div>
// );

// /* ─── Results Stats ─── */
// const ResultsStats = ({ total, start, end, loading, hasActiveFilters }) => (
//   <div className="fade-up fade-up-d2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
//     <div className="results-panel">
//       {loading
//         ? <span style={{ fontSize: 13, color: '#888' }}>Loading products…</span>
//         : <span style={{ fontSize: 13, color: '#6b6b6b' }}>
//             Showing <strong style={{ color: '#2c2c2c' }}>{total > 0 ? start : 0}–{end}</strong> of{' '}
//             <strong style={{ color: '#2c2c2c' }}>{total}</strong> products
//             {hasActiveFilters && <span className="filter-dot" title="Filters active" />}
//           </span>
//       }
//     </div>
//     <div className="results-panel">
//       <span style={{ fontSize: 13, color: '#888' }}>
//         Updated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//       </span>
//     </div>
//   </div>
// );

// /* ═══════════════════════════════════════════
//    PRODUCT GRID + CARD (unchanged UI)
// ═══════════════════════════════════════════ */
// const ProductGrid = ({ products, onProductClick, onQuickView, onAddToCart, wishlist, onToggleWishlist }) => (
//   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
//     {products.map((product, i) => (
//       <ProductCard
//         key={product.id}
//         product={product}
//         onProductClick={() => onProductClick(product)}
//         onQuickView={() => onQuickView(product)}
//         onAddToCart={onAddToCart}
//         isInWishlist={wishlist.includes(product.id)}
//         onToggleWishlist={() => onToggleWishlist(product.id)}
//         animDelay={i * 40}
//       />
//     ))}
//   </div>
// );

// const ProductCard = ({ product, onProductClick, onQuickView, onAddToCart, isInWishlist, onToggleWishlist, animDelay }) => {
//   const [isHovered, setIsHovered]   = useState(false);
//   const [imgErr, setImgErr]         = useState(false);
//   const [cartPopped, setCartPopped] = useState(false);
//   const [wishActive, setWishActive] = useState(false);

//   const discount  = product.original_price && product.price
//     ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
//   const imageUrl  = product.image || product.image_url || product.primary_image;
//   const inStock   = Number(product.stock) > 0;

//   const handleCart = (e) => {
//     e.stopPropagation();
//     if (!inStock) return;
//     onAddToCart(product);
//     setCartPopped(true);
//     setTimeout(() => setCartPopped(false), 600);
//   };
//   const handleWish = (e) => {
//     e.stopPropagation();
//     onToggleWishlist();
//     setWishActive(true);
//     setTimeout(() => setWishActive(false), 400);
//   };

//   return (
//     <div
//       className="elegant-card fade-up"
//       style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative', animationDelay: `${animDelay}ms` }}
//       onClick={onProductClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Badges */}
//       <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
//         {product.is_new       && <span className="badge-new"        style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999 }}>✦ NEW</span>}
//         {product.is_bestseller && <span className="badge-bestseller" style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999 }}>🔥 BESTSELLER</span>}
//         {discount > 0          && <span className="badge-sale"       style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999 }}>-{discount}%</span>}
//         {inStock && Number(product.stock) < 5 && <span className="badge-low" style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999 }}>⚡ {product.stock} left</span>}
//         {!inStock              && <span className="badge-oos"        style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999 }}>Out of Stock</span>}
//       </div>

//       {/* Action buttons */}
//       <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
//         <button onClick={handleWish} style={{ width: 36, height: 36, background: 'white', border: `1px solid ${isInWishlist ? '#dc2626' : '#f0e7db'}`, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.25s', boxShadow: 'var(--shadow-sm)' }}>
//           <svg className={wishActive ? 'wish-active' : ''} width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist ? '#dc2626' : 'none'} stroke={isInWishlist ? '#dc2626' : '#6b6b6b'} strokeWidth="1.8">
//             <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//           </svg>
//         </button>
//         <button onClick={e => { e.stopPropagation(); onQuickView(); }} className="quick-view-btn" style={{ width: 36, height: 36, background: 'white', border: '1px solid var(--border-light)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
//           <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.8">
//             <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//           </svg>
//         </button>
//       </div>

//       {/* Image */}
//       <div className="product-img-wrap" style={{ height: 260, background: '#faf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
//         {!imgErr && imageUrl
//           ? <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
//           : <span style={{ fontSize: 64, color: '#b89b7b', opacity: 0.5 }}>{product.emoji || '✦'}</span>
//         }
//       </div>

//       {/* Info */}
//       <div style={{ padding: '16px 16px 18px' }}>
//         <span style={{ fontSize: 10, color: '#b89b7b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
//           {product.brand || product.supplier_name || 'Collection'}
//         </span>
//         <h3 style={{ fontSize: 15, fontWeight: 400, color: '#2c2c2c', lineHeight: 1.4, marginTop: 4, marginBottom: 10 }}>{product.name}</h3>

//         {product.rating && (
//           <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
//             <div style={{ display: 'flex', gap: 2 }}>
//               {[...Array(5)].map((_, i) => (
//                 <svg key={i} width="12" height="12" viewBox="0 0 20 20" className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}>
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
//                 </svg>
//               ))}
//             </div>
//             <span style={{ fontSize: 11, color: '#888' }}>{product.rating} ({product.review_count || product.reviews || 0})</span>
//           </div>
//         )}

//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
//           <div>
//             <span style={{ fontSize: 22, fontWeight: 300, color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif" }}>
//               KES {Number(product.price).toFixed(2)}
//             </span>
//             {product.original_price && (
//               <span style={{ marginLeft: 8, fontSize: 13, color: '#aaa', textDecoration: 'line-through' }}>
//                 KES {Number(product.original_price).toFixed(2)}
//               </span>
//             )}
//           </div>

//           <div className="cart-btn-wrap" style={{ position: 'relative' }}>
//             <div className="tooltip">{inStock ? 'Add to cart' : 'Out of stock'}</div>
//             <button
//               onClick={handleCart}
//               disabled={!inStock}
//               className={`btn-primary ${cartPopped ? 'cart-pop' : ''}`}
//               style={{ padding: '8px 14px', borderRadius: 999, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
//             >
//               {inStock
//                 ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Add</>
//                 : 'Sold Out'
//               }
//             </button>
//           </div>
//         </div>

//         {Number(product.price) >= 10000 && (
//           <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b89b7b" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
//             <span style={{ fontSize: 11, color: '#b89b7b' }}>Free shipping</span>
//           </div>
//         )}
//       </div>

//       <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#b89b7b', opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }} />
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════
//    PRODUCT LIST (unchanged)
// ═══════════════════════════════════════════ */
// const ProductList = ({ products, onProductClick, onQuickView, onAddToCart }) => (
//   <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//     {products.map(product => (
//       <div key={product.id} className="elegant-card" style={{ borderRadius: 16, padding: 16, cursor: 'pointer' }} onClick={() => onProductClick(product)}>
//         <div style={{ display: 'flex', gap: 20 }}>
//           <div style={{ width: 100, height: 100, borderRadius: 12, overflow: 'hidden', background: '#faf7f2', flexShrink: 0 }}>
//             <img src={product.image || product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
//           </div>
//           <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
//             <div style={{ flex: 1 }}>
//               <span style={{ fontSize: 10, color: '#b89b7b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{product.brand || product.supplier_name}</span>
//               <h3 style={{ fontSize: 16, fontWeight: 400, color: '#2c2c2c', marginBottom: 4 }}>{product.name}</h3>
//               <p style={{ fontSize: 13, color: '#6b6b6b', lineHeight: 1.6 }}>{(product.description || '').substring(0, 100)}{(product.description || '').length > 100 ? '…' : ''}</p>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, minWidth: 160 }}>
//               <span style={{ fontSize: 22, fontWeight: 300, color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif" }}>KES {Number(product.price).toFixed(2)}</span>
//               <div style={{ display: 'flex', gap: 8 }}>
//                 <button onClick={e => { e.stopPropagation(); onAddToCart(product); }} disabled={!product.stock} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 999, fontSize: 12 }}>Add to Cart</button>
//                 <button onClick={e => { e.stopPropagation(); onQuickView(product); }} className="btn-outline" style={{ padding: '8px 14px', borderRadius: 999, fontSize: 12 }}>Quick View</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// /* ═══════════════════════════════════════════
//    SKELETONS / EMPTY / PAGINATION (unchanged)
// ═══════════════════════════════════════════ */
// const LoadingSkeleton = () => (
//   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
//     {[...Array(8)].map((_, i) => (
//       <div key={i} className="elegant-card" style={{ borderRadius: 16, overflow: 'hidden' }}>
//         <div className="skeleton" style={{ height: 260 }} />
//         <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
//           <div className="skeleton" style={{ height: 10, width: '35%' }} />
//           <div className="skeleton" style={{ height: 14, width: '80%' }} />
//           <div className="skeleton" style={{ height: 14, width: '60%' }} />
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
//             <div className="skeleton" style={{ height: 24, width: 70 }} />
//             <div className="skeleton" style={{ height: 32, width: 70, borderRadius: 999 }} />
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// const EmptyState = ({ onClear, hasFilters }) => (
//   <div className="elegant-card" style={{ textAlign: 'center', padding: '64px 32px', borderRadius: 24 }}>
//     <div className="bounce" style={{ fontSize: 64, marginBottom: 24, color: '#b89b7b' }}>🔍</div>
//     <h3 className="display-font" style={{ fontSize: 32, fontWeight: 300, color: '#2c2c2c', marginBottom: 12 }}>No products found</h3>
//     <p style={{ color: '#6b6b6b', maxWidth: 380, margin: '0 auto 32px', lineHeight: 1.7 }}>
//       {hasFilters
//         ? 'No products match your current filters. Try a different category, price range, or keyword.'
//         : 'No products are available right now. Please check back soon.'}
//     </p>
//     {hasFilters && (
//       <button onClick={onClear} className="btn-dark" style={{ padding: '12px 32px', borderRadius: 999, fontSize: 14 }}>
//         Clear All Filters
//       </button>
//     )}
//   </div>
// );

// const Pagination = ({ currentPage, pageCount, onPageChange }) => (
//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 48 }}>
//     <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="page-btn">←</button>
//     {[...Array(pageCount)].map((_, i) => {
//       const page = i + 1;
//       const show = page === 1 || page === pageCount || (page >= currentPage - 1 && page <= currentPage + 1);
//       const dots  = page === currentPage - 2 || page === currentPage + 2;
//       if (show) return <button key={page} onClick={() => onPageChange(page)} className={`page-btn ${currentPage === page ? 'page-btn-active' : ''}`}>{page}</button>;
//       if (dots) return <span key={page} style={{ color: '#aaa' }}>...</span>;
//       return null;
//     })}
//     <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount} className="page-btn">→</button>
//   </div>
// );

// /* ─── Icons ─── */
// const SearchIcon = ({ style }) => (
//   <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//   </svg>
// );
// const GridIcon = () => (
//   <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//   </svg>
// );
// const ListIcon = () => (
//   <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 6h16M4 12h16M4 18h16" />
//   </svg>
// );

// export default Products;


// pages/Products.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Whatsapp from "../components/whatsapp";
import ProductModal from "../components/productmodal";
// import CartSidebar from "../components/cartsidebar";
import CartSidebar from '../components/CartSidebar';
import QuickViewModal from "../components/quickviewmodal";
// import NewsletterPopup from "../components/newsletterpopup";
import RecentlyViewed from "../components/recentlyviewed";
import { getProducts, getCategories, createOrder, checkStock } from "../api";
import { useCart } from "../hooks/usecart";
import { useWishlist } from "../hooks/useWishlist";

/* ─────────────────────────────────────────────
   THEME STYLES (unchanged)
───────────────────────────────────────────── */
const ThemeStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@200;300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    :root {
      --bg-primary: #faf7f2;
      --bg-secondary: #f5efe8;
      --accent-primary: #b89b7b;
      --accent-secondary: #c9a882;
      --accent-dark: #9b7f62;
      --text-primary: #2c2c2c;
      --text-secondary: #6b6b6b;
      --text-light: #888888;
      --border-light: #f0e7db;
      --border-medium: #e2d5c5;
      --white-soft: #ffffff;
      --shadow-sm: 0 4px 12px rgba(184, 155, 123, 0.08);
      --shadow-md: 0 8px 24px rgba(184, 155, 123, 0.12);
      --shadow-lg: 0 20px 40px rgba(184, 155, 123, 0.15);
    }

    body { 
      font-family: 'Jost', sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }

    .page-bg {
      min-height: 100vh;
      background: linear-gradient(135deg, #faf7f2 0%, #f5efe8 100%);
      background-attachment: fixed;
    }

    .elegant-card {
      background: var(--white-soft);
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .elegant-card:hover {
      border-color: var(--accent-primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-4px);
    }

    .warm-glass {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(184, 155, 123, 0.15);
      box-shadow: 0 8px 32px rgba(184, 155, 123, 0.08);
    }
    .warm-glass-strong {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(184, 155, 123, 0.2);
      box-shadow: var(--shadow-md);
    }

    .elegant-input {
      background: var(--white-soft);
      border: 1px solid var(--border-light);
      color: var(--text-primary);
      transition: all 0.3s;
      font-family: 'Jost', sans-serif;
    }
    .elegant-input::placeholder { color: var(--text-light); font-weight: 300; }
    .elegant-input:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(184, 155, 123, 0.1);
    }

    .btn-primary {
      background: var(--accent-primary);
      border: none;
      color: white;
      font-family: 'Jost', sans-serif;
      font-weight: 400;
      letter-spacing: 0.05em;
      transition: all 0.25s;
      box-shadow: 0 4px 12px rgba(184, 155, 123, 0.3);
    }
    .btn-primary:hover:not(:disabled) {
      background: var(--accent-secondary);
      box-shadow: 0 8px 20px rgba(184, 155, 123, 0.4);
      transform: translateY(-2px);
    }
    .btn-primary:active:not(:disabled) { transform: scale(0.98); }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-dark {
      background: var(--text-primary);
      border: none;
      color: white;
      font-family: 'Jost', sans-serif;
      font-weight: 400;
      letter-spacing: 0.05em;
      transition: all 0.25s;
    }
    .btn-dark:hover:not(:disabled) {
      background: var(--accent-primary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border-medium);
      color: var(--text-secondary);
      font-family: 'Jost', sans-serif;
      transition: all 0.25s;
    }
    .btn-outline:hover {
      background: var(--white-soft);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }

    .pill {
      background: var(--white-soft);
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
      transition: all 0.25s;
      font-family: 'Jost', sans-serif;
      font-weight: 300;
    }
    .pill:hover { border-color: var(--accent-primary); color: var(--accent-primary); background: white; }
    .pill-active {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
      font-weight: 400;
      box-shadow: 0 4px 12px rgba(184, 155, 123, 0.3);
    }

    .product-img-wrap { overflow: hidden; }
    .product-img-wrap img { transition: transform 0.7s cubic-bezier(.4,0,.2,1); }
    .elegant-card:hover .product-img-wrap img { transform: scale(1.08); }

    .badge-new { background: var(--text-primary); color: white; border: 1px solid rgba(255,255,255,0.1); }
    .badge-bestseller { background: var(--accent-primary); color: white; }
    .badge-sale { background: #dc2626; color: white; }
    .badge-low { background: #ea580c; color: white; }
    .badge-oos { background: #6b7280; color: white; }

    /* ── DISCOUNT BADGE — top-left fire pill ── */
    .badge-discount {
      background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
      color: white;
      font-weight: 600;
      letter-spacing: 0.02em;
      box-shadow: 0 3px 10px rgba(220,38,38,0.35);
    }

    /* ── SAVINGS CHIP — bottom-right of card body ── */
    .savings-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(135deg, #fef2f2, #fff7ed);
      border: 1px solid rgba(220,38,38,0.18);
      border-radius: 999px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 500;
      color: #dc2626;
      font-family: 'Jost', sans-serif;
      white-space: nowrap;
    }

    .tooltip {
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      white-space: nowrap;
      background: var(--text-primary);
      color: white;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 6px;
      opacity: 0;
      pointer-events: none;
      transform: translateY(4px);
      transition: all 0.2s;
      box-shadow: var(--shadow-sm);
    }
    .tooltip::after {
      content: '';
      position: absolute;
      top: 100%; right: 16px;
      border: 5px solid transparent;
      border-top-color: var(--text-primary);
    }
    .cart-btn-wrap:hover .tooltip { opacity: 1; transform: translateY(0); }

    @keyframes cartPop {
      0%   { box-shadow: 0 0 0 0 rgba(184,155,123,0.8); }
      70%  { box-shadow: 0 0 0 10px rgba(184,155,123,0); }
      100% { box-shadow: 0 0 0 0 rgba(184,155,123,0); }
    }
    .cart-pop { animation: cartPop 0.5s ease-out; }

    @keyframes wishPulse {
      0%,100% { transform: scale(1); }
      50%      { transform: scale(1.22); }
    }
    .wish-active { animation: wishPulse 0.35s ease; color: #dc2626; fill: #dc2626; }

    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }
    .skeleton {
      background: linear-gradient(90deg, #f0e7db 25%, #f5efe8 37%, #f0e7db 63%);
      background-size: 600px 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 8px;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--border-light); }
    ::-webkit-scrollbar-thumb { background: var(--accent-primary); border-radius: 99px; }

    @keyframes float {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .float { animation: float 6s ease-in-out infinite; }

    .elegant-select {
      background: var(--white-soft);
      border: 1px solid var(--border-light);
      color: var(--text-primary);
      font-family: 'Jost', sans-serif;
      border-radius: 999px;
      appearance: none;
      cursor: pointer;
      transition: all 0.25s;
    }
    .elegant-select:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(184, 155, 123, 0.1);
    }
    .elegant-select option { background: white; color: var(--text-primary); }

    .star-filled { color: #fbbf24; fill: #fbbf24; }
    .star-empty { color: var(--border-medium); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.6s ease both; }
    .fade-up-d1 { animation-delay: 0.1s; }
    .fade-up-d2 { animation-delay: 0.2s; }

    .quick-view-btn {
      opacity: 0;
      transform: translateX(12px);
      transition: all 0.25s cubic-bezier(.4,0,.2,1);
    }
    .elegant-card:hover .quick-view-btn { opacity: 1; transform: translateX(0); }

    .view-toggle { background: white; border: 1px solid var(--border-light); border-radius: 999px; overflow: hidden; }
    .view-btn-active { background: var(--accent-primary); color: white; }
    .view-btn-inactive { background: transparent; color: var(--text-secondary); }
    .view-btn-inactive:hover { background: var(--bg-secondary); color: var(--text-primary); }

    .results-panel {
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(4px);
      border: 1px solid var(--border-light);
      border-radius: 999px;
      padding: 8px 18px;
    }

    .page-btn {
      width: 40px; height: 40px;
      border-radius: 8px;
      background: white;
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
      transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Jost', sans-serif;
      cursor: pointer;
    }
    .page-btn:hover:not(:disabled) { border-color: var(--accent-primary); color: var(--accent-primary); }
    .page-btn-active { background: var(--accent-primary); border-color: var(--accent-primary); color: white; }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    @keyframes bounce {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .bounce { animation: bounce 2s ease-in-out infinite; }

    .display-font { font-family: 'Cormorant Garamond', serif; }

    .filter-dot {
      width: 7px; height: 7px;
      background: var(--accent-primary);
      border-radius: 50%;
      display: inline-block;
      margin-left: 5px;
      vertical-align: middle;
    }

    .clear-btn {
      padding: 7px 14px;
      border-radius: 999px;
      font-size: 12px;
      background: transparent;
      border: 1px solid #dc2626;
      color: #dc2626;
      cursor: pointer;
      font-family: 'Jost', sans-serif;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }
    .clear-btn:hover { background: #fef2f2; }

    /* ════════════════════════════════════════
       RESPONSIVE LAYOUT SYSTEM
    ════════════════════════════════════════ */

    .products-responsive-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }
    .skeleton-responsive-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .filter-bar-inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .filter-bar-left  { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .filter-bar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

    .results-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .list-item-inner   { display: flex; gap: 20px; align-items: flex-start; }
    .list-item-content { flex: 1; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .list-item-actions { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; gap: 12px; min-width: 160px; }

    .hero-section  { padding: 48px 32px 64px; text-align: center; position: relative; margin-bottom: 80px; }
    .hero-badges   { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }

    .pagination-wrap { display: flex; flex-direction: column; align-items: center; gap: 24px; margin-top: 64px; margin-bottom: 32px; }
    .pagination-btns {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center;
      background: rgba(255,255,255,0.7); backdrop-filter: blur(10px);
      padding: 8px 16px; border-radius: 999px;
      border: 1px solid var(--border-light); box-shadow: var(--shadow-md);
    }

    @media (max-width: 1024px) {
      .products-responsive-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
      .skeleton-responsive-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
    }

    @media (max-width: 768px) {
      .products-responsive-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
      .skeleton-responsive-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }

      .hero-section  { padding: 32px 16px 40px; margin-bottom: 40px; }
      .hero-badges   { gap: 10px; }

      .filter-bar-inner  { flex-direction: column; align-items: stretch; }
      .filter-bar-left   { justify-content: center; }
      .filter-bar-right  { justify-content: center; }
      .warm-glass-strong { border-radius: 20px !important; padding: 16px !important; }

      .results-bar { flex-direction: column; align-items: flex-start; gap: 8px; }

      .list-item-content { flex-direction: column; }
      .list-item-actions { flex-direction: row; min-width: unset; width: 100%; justify-content: space-between; align-items: center; }

      .pagination-btns { gap: 4px; padding: 8px 10px; }
      .page-btn        { width: 34px !important; height: 34px !important; }
    }

    @media (max-width: 480px) {
      .products-responsive-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .skeleton-responsive-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }

      .hero-section { padding: 24px 12px 32px; }

      .list-item-inner   { flex-direction: column; }
      .list-item-thumb   { width: 100% !important; height: 160px !important; border-radius: 12px !important; }
      .list-item-actions { flex-direction: row; flex-wrap: wrap; }

      .results-panel     { border-radius: 12px !important; }
      .pagination-btns   { border-radius: 16px !important; }
      .results-date-panel { display: none; }
    }

    @media (max-width: 360px) {
      .products-responsive-grid { grid-template-columns: 1fr; gap: 12px; }
      .skeleton-responsive-grid { grid-template-columns: 1fr; gap: 12px; }
    }

    @media (hover: none) {
      .quick-view-btn { opacity: 1 !important; transform: translateX(0) !important; }
    }

    @media (min-width: 640px) {
      .page-bg > div { padding-left: 24px !important; padding-right: 24px !important; }
    }

    @media (max-width: 768px) {
      .product-card-img { height: 200px !important; }
    }
    @media (max-width: 480px) {
      .product-card-img { height: 160px !important; }
    }

    @media (max-width: 768px) {
      .warm-glass-strong { border-radius: 20px !important; }
    }

    @media (max-width: 480px) {
      .price-input-wrap { width: 100% !important; }
      .price-input-wrap input { flex: 1 !important; width: auto !important; min-width: 0 !important; }
      .elegant-select   { width: 100% !important; }
    }

    .page-bg { overflow-x: hidden; }
  `}</style>
);

/* ═══════════════════════════════════════════
   FILTER UTILITY FUNCTIONS (unchanged)
═══════════════════════════════════════════ */

const toApiOrdering = (sortBy) => ({
  popular:    '-sales_count',
  rating:     '-rating',
  'price-low':  'price',
  'price-high': '-price',
  newest:     '-created_at',
  name:       'name',
}[sortBy] || '-sales_count');

const applySort = (arr, sortBy) => {
  const list = [...arr];
  switch (sortBy) {
    case 'price-low':  return list.sort((a, b) => Number(a.price) - Number(b.price));
    case 'price-high': return list.sort((a, b) => Number(b.price) - Number(a.price));
    case 'rating':     return list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    case 'newest':     return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    case 'name':       return list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'en', { sensitivity: 'base' }));
    case 'popular':
    default:           return list.sort((a, b) => Number(b.sales_count || 0) - Number(a.sales_count || 0));
  }
};

const applyPriceFilter = (arr, min, max) => {
  const lo = min !== '' && min !== null ? Number(min) : null;
  const hi = max !== '' && max !== null ? Number(max) : null;
  return arr.filter(p => {
    const price = Number(p.price);
    if (lo !== null && price < lo) return false;
    if (hi !== null && price > hi) return false;
    return true;
  });
};

const applySearch = (arr, term) => {
  if (!term || !term.trim()) return arr;
  const q = term.trim().toLowerCase();
  return arr.filter(p =>
    (p.name        || '').toLowerCase().includes(q) ||
    (p.brand       || '').toLowerCase().includes(q) ||
    (p.supplier_name || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q) ||
    (p.tags        || '').toLowerCase().includes(q)
  );
};

const applyCategory = (arr, selectedCategoryId, categories) => {
  if (!selectedCategoryId || selectedCategoryId === 'all') return arr;
  const selId  = String(selectedCategoryId);
  const catObj  = (categories || []).find(c => String(c.id) === selId);
  const selName = catObj ? catObj.name.toLowerCase().trim() : null;

  return arr.filter(p => {
    const cat = p.category;
    if (cat !== null && cat !== undefined && typeof cat !== 'object' && !Array.isArray(cat)) {
      if (String(cat) === selId) return true;
    }
    if (cat && typeof cat === 'object' && !Array.isArray(cat)) {
      if (String(cat.id) === selId) return true;
      if (selName && (cat.name || '').toLowerCase().trim() === selName) return true;
    }
    if (p.category_id !== undefined && p.category_id !== null) {
      if (String(p.category_id) === selId) return true;
    }
    if (selName && p.category_name) {
      if (p.category_name.toLowerCase().trim() === selName) return true;
    }
    const arrField = Array.isArray(cat) ? cat : (Array.isArray(p.categories) ? p.categories : null);
    if (arrField) {
      return arrField.some(c => {
        if (c === null || c === undefined) return false;
        if (typeof c !== 'object') return String(c) === selId;
        if (String(c.id) === selId) return true;
        if (selName && (c.name || '').toLowerCase().trim() === selName) return true;
        return false;
      });
    }
    return false;
  });
};

const applyConc = (arr, concern) => {
  if (!concern || concern === 'all') return arr;
  const kwMap = {
    brightening:     ['brighten', 'glow', 'vitamin c', 'niacinamide', 'radiant'],
    'anti-aging':    ['anti-ag', 'retinol', 'wrinkle', 'collagen', 'firming', 'peptide'],
    hydration:       ['hydrat', 'moistur', 'hyaluronic', 'aloe', 'aqua', 'water'],
    'hair-skin-nails': ['hair', 'nail', 'biotin', 'keratin', 'scalp'],
    immunity:        ['immun', 'vitamin d', 'zinc', 'elderberry', 'probiotic'],
    sleep:           ['sleep', 'melatonin', 'calm', 'rest', 'night'],
    relaxation:      ['relax', 'stress', 'lavender', 'magnesium', 'calm', 'anxiety'],
  };
  const keywords = kwMap[concern] || [concern.replace(/-/g, ' ')];
  return arr.filter(p => {
    const hay = [p.name, p.brand, p.description, p.tags, p.category_name, p.concern]
      .filter(Boolean).join(' ').toLowerCase();
    return keywords.some(kw => hay.includes(kw));
  });
};

/* ═══════════════════════════════════════════
   MAIN PAGE (unchanged)
═══════════════════════════════════════════ */
const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const [searchTerm, setSearchTerm]                 = useState(() => sessionStorage.getItem('products_search') || '');
  const [selectedCategory, setSelectedCategory]     = useState(() => sessionStorage.getItem('products_category') || 'all');
  const [selectedCategoryId, setSelectedCategoryId] = useState(() => { const id = sessionStorage.getItem('products_categoryId'); return id ? id : null; });
  const [selectedConcern, setSelectedConcern]       = useState(() => sessionStorage.getItem('products_concern') || 'all');
  const [sortBy, setSortBy]                         = useState(() => sessionStorage.getItem('products_sort') || 'popular');
  const [viewMode, setViewMode]                     = useState(() => sessionStorage.getItem('products_view') || 'grid');
  const [priceRange, setPriceRange]                 = useState(() => { const saved = sessionStorage.getItem('products_priceRange'); return saved ? JSON.parse(saved) : { min: '', max: '' }; });
  const [currentPage, setCurrentPage]               = useState(() => { const page = sessionStorage.getItem('products_page'); return page ? parseInt(page) : 1; });
  const [itemsPerPage]                              = useState(16);
  const [showNewsletter, setShowNewsletter]         = useState(false);

  const [displayProducts, setDisplayProducts] = useState([]);
  const [totalDisplay, setTotalDisplay]       = useState(0);

  const searchTimer = useRef(null);

  const { cart, addToCart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen]           = useState(false);

  useEffect(() => {
    sessionStorage.setItem('products_search', searchTerm);
    sessionStorage.setItem('products_category', selectedCategory);
    sessionStorage.setItem('products_categoryId', selectedCategoryId || '');
    sessionStorage.setItem('products_concern', selectedConcern);
    sessionStorage.setItem('products_sort', sortBy);
    sessionStorage.setItem('products_view', viewMode);
    sessionStorage.setItem('products_priceRange', JSON.stringify(priceRange));
    sessionStorage.setItem('products_page', currentPage.toString());
  }, [searchTerm, selectedCategory, selectedCategoryId, selectedConcern, sortBy, viewMode, priceRange, currentPage]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const catRes = await getCategories();
      const cats = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.results || []);
      setCategories(cats);

      const params = { page: 1, page_size: 500, ordering: toApiOrdering(sortBy) };
      if (selectedCategoryId)  params.category  = selectedCategoryId;
      if (searchTerm.trim())   params.search    = searchTerm.trim();
      if (priceRange.min !== '') params.min_price = Number(priceRange.min);
      if (priceRange.max !== '') params.max_price = Number(priceRange.max);

      const res = await getProducts(params);
      const raw = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setAllProducts(raw);

      const t = setTimeout(() => {
        if (!sessionStorage.getItem('newsletterShown')) setShowNewsletter(true);
      }, 30000);
      return () => clearTimeout(t);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load products. Please refresh.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, searchTerm, sortBy, priceRange.min, priceRange.max]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    let result = [...allProducts];
    result = applyCategory(result, selectedCategoryId, categories);
    result = applySearch(result, searchTerm);
    result = applyPriceFilter(result, priceRange.min, priceRange.max);
    result = applyConc(result, selectedConcern);
    result = applySort(result, sortBy);
    setTotalDisplay(result.length);
    const start = (currentPage - 1) * itemsPerPage;
    setDisplayProducts(result.slice(start, start + itemsPerPage));
    const totalPages = Math.ceil(result.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
  }, [allProducts, selectedCategoryId, categories, searchTerm, priceRange, selectedConcern, sortBy, currentPage, itemsPerPage]);

  const handleCategoryChange = (id) => { setSelectedCategory(id); setSelectedCategoryId(id === 'all' ? null : id); setCurrentPage(1); };
  const handleSearchChange   = (value) => { setSearchTerm(value); clearTimeout(searchTimer.current); searchTimer.current = setTimeout(() => setCurrentPage(1), 350); };
  const handlePriceChange    = (field, value) => { if (value !== '' && Number(value) < 0) return; setPriceRange(prev => ({ ...prev, [field]: value })); setCurrentPage(1); };
  const handleSortChange     = (value) => { setSortBy(value); setCurrentPage(1); };
  const handleConcern        = (value) => { setSelectedConcern(value); setCurrentPage(1); };

  const handleClearFilters = () => {
    setSearchTerm(''); setSelectedCategory('all'); setSelectedCategoryId(null);
    setSelectedConcern('all'); setSortBy('popular'); setPriceRange({ min: '', max: '' }); setCurrentPage(1);
    sessionStorage.removeItem('products_search'); sessionStorage.removeItem('products_category');
    sessionStorage.removeItem('products_categoryId'); sessionStorage.removeItem('products_concern');
    sessionStorage.removeItem('products_priceRange'); sessionStorage.removeItem('products_page');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: document.querySelector('.products-grid')?.offsetTop - 100 || 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      const stockCheck = await checkStock(product.id, quantity);
      if (stockCheck.data.available) {
        addToCart({ ...product, image: product.image || product.image_url }, quantity);
        toast.success(`${product.name} added to cart!`, { icon: '🛍️', duration: 2500 });
      } else {
        toast.error(`Only ${stockCheck.data.available_stock} left in stock`);
      }
    } catch {
      addToCart({ ...product, image: product.image || product.image_url }, quantity);
      toast.success(`${product.name} added to cart!`, { icon: '🛍️', duration: 2500 });
    }
  };

  const handleQuickView    = (p) => { setSelectedProduct(p); setIsQuickViewOpen(true); };
  const handleProductClick = (p) => {
    setSelectedProduct(p);
    setIsModalOpen(true);
    const rv = JSON.parse(sessionStorage.getItem('recentlyViewed') || '[]');
    sessionStorage.setItem('recentlyViewed', JSON.stringify([p, ...rv.filter(x => x.id !== p.id)].slice(0, 10)));
  };

  const handleCheckout = async (customerDetails) => {
    try {
      const orderData = {
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price, name: item.name, sku: item.sku || `SKU-${item.id}` })),
        subtotal: cartTotal,
        shipping: cartTotal > 10000 ? 0 : 300,
        tax: cartTotal * 0.08,
        total: cartTotal + (cartTotal > 10000 ? 0 : 300) + (cartTotal * 0.08),
        customer: { name: customerDetails.name, email: customerDetails.email, phone: customerDetails.phone, address: customerDetails.address, city: customerDetails.city, state: customerDetails.state, zip_code: customerDetails.zipCode, country: customerDetails.country || 'KE' },
        payment_method: customerDetails.paymentMethod,
        shipping_method: customerDetails.shippingMethod,
        notes: customerDetails.notes,
        order_date: new Date().toISOString(),
        status: 'pending'
      };
      const response = await createOrder(orderData);
      if (response.data) {
        toast.success('Order placed! Check your email for confirmation.', { duration: 5000, icon: '✨' });
        cart.forEach(item => removeFromCart(item.id));
        setIsCartOpen(false);
        if (window.gtag) window.gtag('event', 'purchase', { transaction_id: response.data.order_number || response.data.id, value: orderData.total, currency: 'KES' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  const hasActiveFilters = !!(searchTerm || selectedCategoryId || selectedConcern !== 'all' || sortBy !== 'popular' || priceRange.min !== '' || priceRange.max !== '');

  if (error) return (
    <div className="page-bg min-h-screen flex items-center justify-center">
      <ThemeStyles />
      <div className="elegant-card rounded-3xl p-12 text-center max-w-md mx-4">
        <div className="text-7xl mb-6 float">✨</div>
        <h2 className="display-font text-3xl font-light text-[#2c2c2c] mb-3">Something went wrong</h2>
        <p className="text-[#6b6b6b] mb-8 font-light">{error}</p>
        <button onClick={() => fetchProducts()} className="btn-dark px-8 py-3 rounded-xl">Try Again</button>
      </div>
    </div>
  );

  return (
    <>
      <ThemeStyles />
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: 'white', border: '1px solid var(--border-light)', color: 'var(--text-primary)', fontFamily: "'Jost', sans-serif", borderRadius: '12px', boxShadow: 'var(--shadow-md)' } }} />

      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} wishlistCount={wishlist.length} />

      <main className="page-bg py-12">
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px' }}>
          <HeroSection />
          <SearchAndFilters
            searchTerm={searchTerm} onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange}
            categories={categories} selectedConcern={selectedConcern} onConcernChange={handleConcern}
            sortBy={sortBy} onSortChange={handleSortChange} viewMode={viewMode} onViewModeChange={setViewMode}
            priceRange={priceRange} onPriceChange={handlePriceChange}
            hasActiveFilters={hasActiveFilters} onClearFilters={handleClearFilters}
          />
          <ResultsStats
            total={totalDisplay} start={displayProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            end={Math.min(currentPage * itemsPerPage, totalDisplay)} loading={loading}
            hasActiveFilters={hasActiveFilters} currentPage={currentPage} totalPages={Math.ceil(totalDisplay / itemsPerPage)}
          />
          {loading ? <LoadingSkeleton /> : (
            <>
              {displayProducts.length === 0 ? (
                <EmptyState onClear={handleClearFilters} hasFilters={hasActiveFilters} />
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className="products-grid">
                      <ProductGrid products={displayProducts} onProductClick={handleProductClick} onQuickView={handleQuickView} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                    </div>
                  ) : (
                    <ProductList products={displayProducts} onProductClick={handleProductClick} onQuickView={handleQuickView} onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
                  )}
                  {Math.ceil(totalDisplay / itemsPerPage) > 1 && (
                    <Pagination currentPage={currentPage} pageCount={Math.ceil(totalDisplay / itemsPerPage)} onPageChange={handlePageChange} />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <RecentlyViewed onProductClick={handleProductClick} />

    <ProductModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  product={selectedProduct} 
  onAddToCart={handleAddToCart} 
  onToggleWishlist={toggleWishlist}  // ← Add this
  wishlist={wishlist}  // ← Add this
/>
      <QuickViewModal isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} product={selectedProduct} onAddToCart={handleAddToCart} onViewDetails={() => { setIsQuickViewOpen(false); setIsModalOpen(true); }} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} onCheckout={handleCheckout} total={cartTotal} />
         <Whatsapp/>
      <Footer />
    </>
  );
};

/* ═══════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════ */
const HeroSection = () => (
  <div className="fade-up hero-section">
    <div className="float" style={{ position: 'absolute', top: 20, left: '5%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,155,123,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
    <div className="float" style={{ position: 'absolute', bottom: 20, right: '8%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,155,123,0.08) 0%, transparent 70%)', animationDelay: '2s', pointerEvents: 'none' }} />
    <div className="warm-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 28px', borderRadius: 999, marginBottom: 32 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b89b7b' }} />
      <span style={{ fontSize: 11, letterSpacing: '0.2em', color: '#6b6b6b', fontWeight: 300 }}>BEAUTY & WELLNESS COLLECTION</span>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b89b7b' }} />
    </div>
    <h1 className="display-font" style={{ fontSize: 'clamp(48px, 8vw, 86px)', fontWeight: 300, color: '#2c2c2c', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
      Curated for Your<br /><span style={{ color: '#b89b7b', fontStyle: 'italic' }}>Natural Beauty</span>
    </h1>
    <p style={{ fontSize: 18, color: '#6b6b6b', fontWeight: 300, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
      Discover clean, effective products thoughtfully selected for your self-care journey.
    </p>
    <div className="hero-badges">
      {['100% Authentic', 'Free Shipping KES 10k+', 'Secure Checkout', 'Easy Returns'].map(s => (
        <div key={s} className="warm-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 999 }}>
          <span style={{ color: '#b89b7b', fontSize: 14 }}>✓</span>
          <span style={{ fontSize: 13, color: '#6b6b6b', fontWeight: 300 }}>{s}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   SEARCH & FILTERS (unchanged)
═══════════════════════════════════════════ */
const SearchAndFilters = ({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, categories, selectedConcern, onConcernChange, sortBy, onSortChange, viewMode, onViewModeChange, priceRange, onPriceChange, hasActiveFilters, onClearFilters }) => {
  const concerns = [
    { id: 'all', name: 'All Concerns' }, { id: 'brightening', name: 'Brightening' },
    { id: 'anti-aging', name: 'Anti-Aging' }, { id: 'hydration', name: 'Hydration' },
    { id: 'hair-skin-nails', name: 'Hair, Skin & Nails' }, { id: 'immunity', name: 'Immunity' },
    { id: 'sleep', name: 'Sleep' }, { id: 'relaxation', name: 'Relaxation' },
  ];
  return (
    <div className="fade-up fade-up-d1" style={{ marginBottom: 48 }}>
      <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto 32px' }}>
        <input type="text" placeholder="Search products, brands, ingredients..." value={searchTerm} onChange={e => onSearchChange(e.target.value)} className="elegant-input" style={{ width: '100%', padding: '16px 56px', borderRadius: 999, fontSize: 15 }} />
        <SearchIcon style={{ position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)', color: '#b89b7b', width: 20, height: 20 }} />
        {searchTerm && (
          <button onClick={() => onSearchChange('')} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'white', border: '1px solid #f0e7db', borderRadius: 999, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b6b6b', fontSize: 14 }}>✕</button>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        <CategoryPills categories={categories} selected={selectedCategory} onChange={onCategoryChange} />
      </div>
      <div className="warm-glass-strong" style={{ padding: '12px 24px' }}>
        <div className="filter-bar-inner">
          <div className="filter-bar-left">
            <div style={{ position: 'relative' }}>
              <select value={selectedConcern} onChange={e => onConcernChange(e.target.value)} className="elegant-select" style={{ padding: '8px 32px 8px 16px', fontSize: 13 }}>
                {concerns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#b89b7b', fontSize: 11 }}>▼</span>
            </div>
            <div className="price-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="number" placeholder="Min KES" value={priceRange.min} onChange={e => onPriceChange('min', e.target.value)} className="elegant-input" style={{ width: 95, padding: '8px 12px', borderRadius: 999, fontSize: 13 }} min="0" />
              <span style={{ color: '#b89b7b', fontSize: 14, flexShrink: 0 }}>—</span>
              <input type="number" placeholder="Max KES" value={priceRange.max} onChange={e => onPriceChange('max', e.target.value)} className="elegant-input" style={{ width: 95, padding: '8px 12px', borderRadius: 999, fontSize: 13 }} min="0" />
            </div>
            {hasActiveFilters && <button className="clear-btn" onClick={onClearFilters}>✕ Clear filters</button>}
          </div>
          <div className="filter-bar-right">
            <div style={{ position: 'relative' }}>
              <select value={sortBy} onChange={e => onSortChange(e.target.value)} className="elegant-select" style={{ padding: '8px 32px 8px 16px', fontSize: 13 }}>
                <option value="popular">🔥 Most Popular</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="price-low">↑ Price: Low to High</option>
                <option value="price-high">↓ Price: High to Low</option>
                <option value="newest">✨ Newest First</option>
                <option value="name">A–Z Name</option>
              </select>
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#b89b7b', fontSize: 11 }}>▼</span>
            </div>
            <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryPills = ({ categories, selected, onChange }) => {
  const all  = [{ id: 'all', name: 'All Products', icon: '🛍️' }];
  const cats = (Array.isArray(categories) ? categories : []).map(c => ({ id: c.id, name: c.name, icon: c.icon || '📦' }));
  return (
    <>
      {[...all, ...cats].map(cat => (
        <button key={cat.id} onClick={() => onChange(cat.id)} className={`pill ${selected === cat.id ? 'pill-active' : ''}`} style={{ padding: '8px 22px', borderRadius: 999, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>{cat.icon}</span>{cat.name}
        </button>
      ))}
    </>
  );
};

const ViewToggle = ({ viewMode, onViewModeChange }) => (
  <div className="view-toggle" style={{ display: 'flex' }}>
    {['grid', 'list'].map(m => (
      <button key={m} onClick={() => onViewModeChange(m)} className={viewMode === m ? 'view-btn-active' : 'view-btn-inactive'} style={{ padding: '8px 14px', cursor: 'pointer', border: 'none', transition: 'all 0.2s', fontSize: 13 }}>
        {m === 'grid' ? <GridIcon /> : <ListIcon />}
      </button>
    ))}
  </div>
);

const ResultsStats = ({ total, start, end, loading, hasActiveFilters, currentPage, totalPages }) => (
  <div className="fade-up fade-up-d2 results-bar">
    <div className="results-panel" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {loading ? <span style={{ fontSize: 13, color: '#888' }}>Loading products…</span> : (
        <>
          <span style={{ fontSize: 13, color: '#6b6b6b' }}>
            Showing <strong style={{ color: '#2c2c2c' }}>{total > 0 ? start : 0}–{end}</strong> of{' '}
            <strong style={{ color: '#2c2c2c' }}>{total}</strong> products
            {hasActiveFilters && <span className="filter-dot" title="Filters active" />}
          </span>
          <span style={{ marginLeft: 12, paddingLeft: 12, borderLeft: '1px solid var(--border-light)', fontSize: 13, color: '#888' }}>
            Page <strong style={{ color: '#b89b7b' }}>{currentPage}</strong> of {totalPages}
          </span>
        </>
      )}
    </div>
    <div className="results-panel results-date-panel">
      <span style={{ fontSize: 13, color: '#888' }}>Updated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   PRODUCT GRID (unchanged)
═══════════════════════════════════════════ */
const ProductGrid = ({ products, onProductClick, onQuickView, onAddToCart, wishlist, onToggleWishlist }) => (
  <div className="products-responsive-grid">
    {products.map((product, i) => (
      <ProductCard key={product.id} product={product} onProductClick={() => onProductClick(product)} onQuickView={() => onQuickView(product)} onAddToCart={onAddToCart} isInWishlist={wishlist.includes(product.id)} onToggleWishlist={() => onToggleWishlist(product.id)} animDelay={i * 40} />
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   PRODUCT CARD
   ── Only the discount-related sections are new ──
   Everything else (layout, image, buttons, wishlist,
   quick-view, hover line, rating, free-shipping note)
   is byte-for-byte identical to the original.
═══════════════════════════════════════════ */
// pages/Products.jsx - Update the ProductCard component (around line 640)

const ProductCard = ({ product, onProductClick, onQuickView, onAddToCart, isInWishlist, onToggleWishlist, animDelay }) => {
  const [isHovered, setIsHovered]   = useState(false);
  const [imgErr, setImgErr]         = useState(false);
  const [cartPopped, setCartPopped] = useState(false);
  const [wishActive, setWishActive] = useState(false);

  /* ── Discount calculation - FIXED to work with your serializer ──
     Your backend sends: current_price, discount_percent, is_discount_active
  ──────────────────────────────────────────────────────────────── */
  const getDiscount = () => {
    // Check if discount is active via is_discount_active flag or discount_percent
    const isActive = product.is_discount_active === true || 
                     (product.discount_percent && product.discount_percent > 0 && product.is_discount_active !== false);
    
    if (isActive) {
      // Use discount_percent if available
      if (product.discount_percent && product.discount_percent > 0) {
        return product.discount_percent;
      }
      // Calculate from current_price and price
      if (product.current_price && product.price && product.current_price < product.price) {
        return Math.round(((product.price - product.current_price) / product.price) * 100);
      }
    }
    
    // Fallback: check if current_price is less than price
    if (product.current_price && product.price && product.current_price < product.price) {
      return Math.round(((product.price - product.current_price) / product.price) * 100);
    }
    
    return 0;
  };
  
  const getCurrentDisplayPrice = () => {
    // Use current_price if available (discounted price)
    if (product.current_price !== undefined && product.current_price !== null) {
      return Number(product.current_price);
    }
    return Number(product.price);
  };
  
  const getOriginalPrice = () => {
    // Original price is the regular price
    return Number(product.price);
  };
  
  const discount = getDiscount();
  const displayPrice = getCurrentDisplayPrice();
  const originalPrice = getOriginalPrice();
  const savedAmount = discount > 0 ? originalPrice - displayPrice : 0;

  const imageUrl = product.image || product.image_url || product.primary_image;
  const inStock  = Number(product.stock) > 0;

  const handleCart = (e) => {
    e.stopPropagation();
    if (!inStock) return;
    onAddToCart(product);
    setCartPopped(true);
    setTimeout(() => setCartPopped(false), 600);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    onToggleWishlist();
    setWishActive(true);
    setTimeout(() => setWishActive(false), 400);
  };

  return (
    <div
      className="elegant-card fade-up"
      style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative', animationDelay: `${animDelay}ms` }}
      onClick={onProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── TOP-LEFT BADGES ──────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* 🔥 DISCOUNT — only rendered when discount > 0 */}
        {discount > 0 && (
          <span
            className="badge-discount"
            style={{ fontSize: 11, padding: '5px 11px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            🔥 {discount}% OFF
          </span>
        )}
        {/* Original badges — unchanged */}
        {product.is_new        && <span className="badge-new"        style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999 }}>✦ NEW</span>}
        {product.is_bestseller && <span className="badge-bestseller" style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999 }}>🔥 BESTSELLER</span>}
        {inStock && Number(product.stock) < 5 && <span className="badge-low" style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999 }}>⚡ {product.stock} left</span>}
        {!inStock              && <span className="badge-oos"        style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999 }}>Out of Stock</span>}
      </div>

      {/* Top-right actions — UNCHANGED */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={handleWish} style={{ width: 36, height: 36, background: 'white', border: `1px solid ${isInWishlist ? '#dc2626' : '#f0e7db'}`, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.25s', boxShadow: 'var(--shadow-sm)' }}>
          <svg className={wishActive ? 'wish-active' : ''} width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist ? '#dc2626' : 'none'} stroke={isInWishlist ? '#dc2626' : '#6b6b6b'} strokeWidth="1.8">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button onClick={e => { e.stopPropagation(); onQuickView(); }} className="quick-view-btn" style={{ width: 36, height: 36, background: 'white', border: '1px solid var(--border-light)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.8">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* Image — UNCHANGED */}
      <div className="product-img-wrap product-card-img" style={{ height: 350, background: '#faf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {!imgErr && imageUrl
          ? <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
          : <span style={{ fontSize: 64, color: '#b89b7b', opacity: 0.5 }}>{product.emoji || '✦'}</span>
        }
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 16px 18px' }}>
        {/* Brand — UNCHANGED */}
        <span style={{ fontSize: 10, color: '#b89b7b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {product.brand || product.supplier_name || 'Collection'}
        </span>

        {/* Name — UNCHANGED */}
        <h3 style={{ fontSize: 15, fontWeight: 400, color: '#2c2c2c', lineHeight: 1.4, marginTop: 4, marginBottom: 10 }}>{product.name}</h3>

        {/* Rating — UNCHANGED */}
        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 20 20" className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span style={{ fontSize: 11, color: '#888' }}>{product.rating} ({product.review_count || product.reviews || 0})</span>
          </div>
        )}

        {/* ── PRICE ROW ── */}
        {discount > 0 ? (
          /* ── DISCOUNTED layout ── */
          <div>
            {/* Price row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              {/* Left: current + original prices */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 22, fontWeight: 300, color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif" }}>
                  KES {displayPrice.toFixed(2)}
                </span>
                <span style={{ fontSize: 13, color: '#aaa', textDecoration: 'line-through', fontFamily: "'Jost', sans-serif" }}>
                  KES {originalPrice.toFixed(2)}
                </span>
              </div>
              {/* Right: cart button */}
              <div className="cart-btn-wrap" style={{ position: 'relative', flexShrink: 0 }}>
                <div className="tooltip">{inStock ? 'Add to cart' : 'Out of stock'}</div>
                <button onClick={handleCart} disabled={!inStock} className={`btn-primary ${cartPopped ? 'cart-pop' : ''}`} style={{ padding: '8px 14px', borderRadius: 999, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {inStock
                    ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Add</>
                    : 'Sold Out'
                  }
                </button>
              </div>
            </div>

            {/* Savings chip — bottom-right, only when discounted */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <span className="savings-chip">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                You save KES {savedAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ) : (
          /* ── NO DISCOUNT layout — identical to original ── */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <span style={{ fontSize: 22, fontWeight: 300, color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif" }}>
                KES {displayPrice.toFixed(2)}
              </span>
            </div>
            <div className="cart-btn-wrap" style={{ position: 'relative' }}>
              <div className="tooltip">{inStock ? 'Add to cart' : 'Out of stock'}</div>
              <button onClick={handleCart} disabled={!inStock} className={`btn-primary ${cartPopped ? 'cart-pop' : ''}`} style={{ padding: '8px 14px', borderRadius: 999, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                {inStock
                  ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Add</>
                  : 'Sold Out'
                }
              </button>
            </div>
          </div>
        )}

        {/* Free shipping note — UNCHANGED */}
        {Number(displayPrice) >= 10000 && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b89b7b" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            <span style={{ fontSize: 11, color: '#b89b7b' }}>Free shipping</span>
          </div>
        )}
      </div>

      {/* Bottom hover line — UNCHANGED */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: discount > 0 ? '#dc2626' : '#b89b7b', opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }} />
    </div>
  );
};
/* ═══════════════════════════════════════════
   PRODUCT LIST (unchanged)
═══════════════════════════════════════════ */
const ProductList = ({ products, onProductClick, onQuickView, onAddToCart, wishlist, onToggleWishlist }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
    {products.map(product => (
      <div key={product.id} className="elegant-card" style={{ borderRadius: 16, padding: 16, cursor: 'pointer' }} onClick={() => onProductClick(product)}>
        <div className="list-item-inner">
          <div className="list-item-thumb" style={{ width: 100, height: 200, borderRadius: 12, overflow: 'hidden', background: '#faf7f2', flexShrink: 0 }}>
            <img src={product.image || product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          </div>
          <div className="list-item-content">
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 10, color: '#b89b7b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{product.brand || product.supplier_name}</span>
              <h3 style={{ fontSize: 16, fontWeight: 400, color: '#2c2c2c', marginBottom: 4 }}>{product.name}</h3>
              <p style={{ fontSize: 13, color: '#6b6b6b', lineHeight: 1.6 }}>{(product.description || '').substring(0, 100)}{(product.description || '').length > 100 ? '…' : ''}</p>
            </div>
            <div className="list-item-actions">
              <span style={{ fontSize: 22, fontWeight: 300, color: '#2c2c2c', fontFamily: "'Cormorant Garamond', serif" }}>KES {Number(product.price).toFixed(2)}</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={e => { e.stopPropagation(); onAddToCart(product); }} disabled={!product.stock} className="btn-primary" style={{ padding: '8px 16px', borderRadius: 999, fontSize: 12 }}>Add to Cart</button>
                <button onClick={e => { e.stopPropagation(); onQuickView(product); }} className="btn-outline" style={{ padding: '8px 14px', borderRadius: 999, fontSize: 12 }}>Quick View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   SKELETON / EMPTY / PAGINATION (unchanged)
═══════════════════════════════════════════ */
const LoadingSkeleton = () => (
  <div className="skeleton-responsive-grid">
    {[...Array(16)].map((_, i) => (
      <div key={i} className="elegant-card" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div className="skeleton" style={{ height: 400 }} />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skeleton" style={{ height: 10, width: '35%' }} />
          <div className="skeleton" style={{ height: 14, width: '80%' }} />
          <div className="skeleton" style={{ height: 14, width: '60%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <div className="skeleton" style={{ height: 24, width: 70 }} />
            <div className="skeleton" style={{ height: 32, width: 70, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ onClear, hasFilters }) => (
  <div className="elegant-card" style={{ textAlign: 'center', padding: '64px 32px', borderRadius: 24 }}>
    <div className="bounce" style={{ fontSize: 64, marginBottom: 24, color: '#b89b7b' }}>🔍</div>
    <h3 className="display-font" style={{ fontSize: 32, fontWeight: 300, color: '#2c2c2c', marginBottom: 12 }}>No products found</h3>
    <p style={{ color: '#6b6b6b', maxWidth: 380, margin: '0 auto 32px', lineHeight: 1.7 }}>
      {hasFilters ? 'No products match your current filters. Try a different category, price range, or keyword.' : 'No products are available right now. Please check back soon.'}
    </p>
    {hasFilters && <button onClick={onClear} className="btn-dark" style={{ padding: '12px 32px', borderRadius: 999, fontSize: 14 }}>Clear All Filters</button>}
  </div>
);

const Pagination = ({ currentPage, pageCount, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 2; const range = []; const rangeWithDots = []; let l;
    for (let i = 1; i <= pageCount; i++) {
      if (i === 1 || i === pageCount || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
    }
    range.forEach((i) => {
      if (l) { if (i - l === 2) rangeWithDots.push(l + 1); else if (i - l !== 1) rangeWithDots.push('...'); }
      rangeWithDots.push(i); l = i;
    });
    return rangeWithDots;
  };
  const pageNumbers = getPageNumbers();
  return (
    <div className="pagination-wrap">
      <div className="pagination-btns">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="page-btn" style={{ width: 40, height: 40, borderRadius: '50%', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }} title="First page">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="page-btn" style={{ width: 40, height: 40, borderRadius: '50%', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }} title="Previous page">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '0 8px' }}>
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} style={{ width: 32, textAlign: 'center', color: '#888', fontSize: 14, letterSpacing: '2px' }}>•••</span>
            ) : (
              <button key={page} onClick={() => onPageChange(page)} className={`page-btn ${currentPage === page ? 'page-btn-active' : ''}`} style={{ width: 40, height: 40, borderRadius: '50%', fontSize: 14, fontWeight: currentPage === page ? '500' : '400', transform: currentPage === page ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                {page}
              </button>
            )
          ))}
        </div>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount} className="page-btn" style={{ width: 40, height: 40, borderRadius: '50%', opacity: currentPage === pageCount ? 0.4 : 1, cursor: currentPage === pageCount ? 'not-allowed' : 'pointer' }} title="Next page">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
        </button>
        <button onClick={() => onPageChange(pageCount)} disabled={currentPage === pageCount} className="page-btn" style={{ width: 40, height: 40, borderRadius: '50%', opacity: currentPage === pageCount ? 0.4 : 1, cursor: currentPage === pageCount ? 'not-allowed' : 'pointer' }} title="Last page">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 5l7 7-7 7M6 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#888' }}>
        <span>16 items per page</span>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#b89b7b' }} />
        <span>{pageCount} pages total</span>
      </div>
      <div style={{ width: '200px', height: '2px', background: 'var(--border-light)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(currentPage / pageCount) * 100}%`, background: 'linear-gradient(90deg, #b89b7b, #c9a882)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
};

/* ─── Icons (unchanged) ─── */
const SearchIcon = ({ style }) => (
  <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const GridIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default Products;