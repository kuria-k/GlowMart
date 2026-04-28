// context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { checkStock } from "../api"; // Import stock check API

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Try to get from localStorage first, then sessionStorage
    const localSaved = localStorage.getItem("cart");
    const sessionSaved = sessionStorage.getItem("cart");
    const saved = localSaved || sessionSaved;
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [stockErrors, setStockErrors] = useState({});

  // Persist cart to both storages
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ---------------- STOCK CHECK ----------------
// context/CartContext.jsx - Updated stock check function
const checkProductStock = async (productId, requestedQuantity) => {
  try {
    // Try the correct endpoint based on your Django URLs
    const response = await checkStock(productId, requestedQuantity);
    return {
      available: response.data.available,
      availableStock: response.data.available_stock,
      message: response.data.message
    };
  } catch (error) {
    console.error(`Stock check failed for product ${productId}:`, error);
    
    // If endpoint doesn't exist, assume stock is available
    // This is a temporary fix - you should create the endpoint
    if (error.response?.status === 404) {
      console.warn(`Stock check endpoint not found. Assuming stock is available for product ${productId}`);
      return {
        available: true,
        availableStock: 999, // Assume large stock
        message: "Stock check endpoint not configured"
      };
    }
    
    return {
      available: false,
      availableStock: 0,
      message: "Unable to check stock"
    };
  }
};

  // ---------------- CART ACTIONS ----------------

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = async (product, quantity = 1) => {
    // Check stock before adding
    const stockInfo = await checkProductStock(product.id, quantity);
    
    if (!stockInfo.available) {
      toast.error(stockInfo.message || `Only ${stockInfo.availableStock} left in stock`);
      return false;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);

      if (existing) {
        const newQuantity = existing.quantity + quantity;
        
        // Check if new quantity exceeds available stock
        if (newQuantity > stockInfo.availableStock) {
          toast.error(`Cannot add ${quantity} more. Only ${stockInfo.availableStock - existing.quantity} available.`);
          return prev;
        }
        
        toast.success(`Updated ${product.name} quantity`);
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: newQuantity }
            : i
        );
      }

      toast.success(`${product.name} added to cart`);
      return [...prev, { 
        ...product, 
        quantity,
        price: product.current_price || product.price,
        name: product.name,
        id: product.id,
        image: product.image || product.image_url,
        sku: product.sku || product.product_sku
      }];
    });
    
    return true;
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
    toast.success("Item removed from cart");
  };

  const updateQuantity = async (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }

    const item = cart.find(i => i.id === id);
    if (!item) return;

    // Check stock for new quantity
    const stockInfo = await checkProductStock(id, qty);
    
    if (!stockInfo.available) {
      toast.error(stockInfo.message || `Only ${stockInfo.availableStock} left in stock`);
      return;
    }

    setCart(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
    );
    toast.success("Quantity updated");
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    sessionStorage.removeItem("cart");
    toast.success("Cart cleared");
  };

  // ---------------- COMPUTED ----------------

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + (i.price * i.quantity), 0),
    [cart]
  );

  // Get cart items formatted for order creation
  const getCartItemsForOrder = useCallback(() => {
    return cart.map(item => ({
      product_name: item.name,
      product_sku: item.sku || '',
      quantity: item.quantity,
      price: item.price,
      image_url: item.image || '',
      product_id: item.id,
      subtotal: item.price * item.quantity
    }));
  }, [cart]);

  // Verify all items in cart are still in stock before checkout
  const verifyCartStock = useCallback(async () => {
    const stockIssues = [];
    
    for (const item of cart) {
      const stockInfo = await checkProductStock(item.id, item.quantity);
      if (!stockInfo.available) {
        stockIssues.push({
          product: item.name,
          requested: item.quantity,
          available: stockInfo.availableStock
        });
      }
    }
    
    if (stockIssues.length > 0) {
      const errorMessage = stockIssues.map(
        issue => `${issue.product}: requested ${issue.requested}, only ${issue.available} available`
      ).join('\n');
      
      toast.error(`Stock issues:\n${errorMessage}`);
      return false;
    }
    
    return true;
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        itemCount: cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        removeItem: removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        getCartItemsForOrder,
        verifyCartStock,
        stockErrors,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};