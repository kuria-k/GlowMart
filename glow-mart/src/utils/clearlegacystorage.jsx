// utils/clearLegacyStorage.js
//
// IMPORT THIS ONCE at the very top of your main.jsx / index.jsx:
//
//   import './utils/clearLegacyStorage';
//
// Purpose: wipe any cart / wishlist data that was previously saved to
// localStorage (from the old hooks). Runs synchronously before React
// mounts so no component ever sees stale persisted data.
//
// The flag 'gm_ls_purged' is written to localStorage itself so this
// only runs once per browser (not once per session — we don't want it
// re-running every single tab open, just cleaning up the one-time
// migration).

const PURGE_FLAG = 'gm_ls_purged';

try {
  if (!localStorage.getItem(PURGE_FLAG)) {
    const STALE_KEYS = [
      // Common cart keys used by various hook implementations
      'cart',
      'gm_cart',
      'cartItems',
      'shopping_cart',

      // Common wishlist keys
      'wishlist',
      'gm_wishlist',
      'wishlistItems',
      'saved_items',

      // Other session-style data that should not persist
      'recentlyViewed',
      'recently_viewed',
      'newsletterShown',
      'newsletter_shown',
      'products_search',
      'products_category',
      'products_categoryId',
      'products_concern',
      'products_sort',
      'products_view',
      'products_priceRange',
      'products_page',
    ];

    STALE_KEYS.forEach(key => {
      try { localStorage.removeItem(key); } catch { /* noop */ }
    });

    localStorage.setItem(PURGE_FLAG, '1');
    console.info('[GlowMart] Legacy localStorage data cleared. All sessions now start fresh.');
  }
} catch {
  // localStorage may be blocked (private browsing in some browsers) — ignore
}