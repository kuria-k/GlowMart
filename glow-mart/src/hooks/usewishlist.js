// hooks/useWishlist.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = sessionStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toggle wishlist - accepts product object or ID
  const toggleWishlist = useCallback((productOrId) => {
    const productId = typeof productOrId === 'object' ? productOrId.id : productOrId;
    
    setWishlist(prev => {
      const isCurrentlyInWishlist = prev.includes(productId);
      
      if (isCurrentlyInWishlist) {
        toast.success('Removed from wishlist', {
          icon: '💔',
          duration: 2000
        });
        return prev.filter(id => id !== productId);
      } else {
        toast.success('Added to wishlist!', {
          icon: '❤️',
          duration: 2000
        });
        return [...prev, productId];
      }
    });
  }, []);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([]);
    toast.success('Wishlist cleared');
  }, []);

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist
  };
};