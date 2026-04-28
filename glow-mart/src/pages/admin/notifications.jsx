// src/pages/admin/notifications.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import AdminNavbar from "../../components/adminnav";
import { getProducts, getOrders, getProduct, updateOrder } from "../../api";
import axios from "axios";
import { 
  Bell, Package, AlertTriangle, CheckCircle, XCircle, Clock, 
  RefreshCw, ShoppingBag, Archive, TrendingUp, Percent, 
  Truck, CreditCard, Users, Filter, Calendar, DollarSign,
  Eye, Check, Trash2, Printer, Download, Mail, Settings,
  ChevronRight, ChevronDown, Star, Zap, Gift, Shield,
  AlertOctagon, Box, Layers, ShoppingCart, UserCheck, UserX,
  Flame, Timer, Gift as GiftIcon, Sparkles
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

// Helper to extract data from paginated response
const extractDataFromResponse = (response) => {
  if (!response || !response.data) return [];
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data.results && Array.isArray(data.results)) return data.results;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.products && Array.isArray(data.products)) return data.products;
  console.warn('Unexpected response format:', data);
  return [];
};

// API calls with proper error handling
const api = {
  getProducts: () => axios.get(`${API_BASE}/inventory/products/`),
  getOrders: () => axios.get(`${API_BASE}/orders/`),
  getProduct: (id) => axios.get(`${API_BASE}/inventory/products/${id}/`),
  updateOrder: (id, data) => axios.patch(`${API_BASE}/orders/${id}/`, data),
  updateProduct: (id, data) => axios.patch(`${API_BASE}/inventory/products/${id}/`, data),
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("time");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    activeDiscounts: 0,
    discountsExpiringSoon: 0,
    lowStock: 0,
    outOfStock: 0,
    expiringSoon: 0,
  });

  // Helper to check if discount is active
  const isDiscountActive = (product) => {
    const discountPercent = Number(product.discount_percent) || 0;
    const discountExpiry = product.discount_expiry;
    
    if (discountPercent <= 0) return false;
    if (!discountExpiry) return false;
    
    const expiryDate = new Date(discountExpiry);
    return expiryDate > new Date();
  };

  // Helper to get current price
  const getCurrentPrice = (product) => {
    const price = Number(product.price) || 0;
    const discountPercent = Number(product.discount_percent) || 0;
    
    if (isDiscountActive(product)) {
      return price * (1 - discountPercent / 100);
    }
    return price;
  };

  // Check active discounts and discounts expiring soon
  const checkDiscounts = useCallback(async (products) => {
    const discountNotifications = [];
    const today = new Date();
    
    products.forEach(product => {
      const discountPercent = Number(product.discount_percent) || 0;
      const discountExpiry = product.discount_expiry;
      
      if (discountPercent > 0 && discountExpiry) {
        const expiryDate = new Date(discountExpiry);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        const isActive = expiryDate > today;
        
        if (isActive) {
          // Active discount notification
          const currentPrice = getCurrentPrice(product);
          const originalPrice = Number(product.price);
          const savings = originalPrice - currentPrice;
          
          discountNotifications.push({
            id: `discount-active-${product.id}`,
            type: "active-discount",
            title: "🔥 Product on Sale",
            message: `${product.name} is on sale at ${discountPercent}% OFF! Original: KES ${originalPrice.toLocaleString()} → Now: KES ${currentPrice.toLocaleString()}`,
            time: new Date().toISOString(),
            read: false,
            priority: daysUntilExpiry <= 3 ? "high" : "medium",
            icon: "fire",
            productId: product.id,
            productName: product.name,
            discountPercent: discountPercent,
            originalPrice: originalPrice,
            currentPrice: currentPrice,
            savings: savings,
            expiryDate: discountExpiry,
            daysUntilExpiry: daysUntilExpiry,
            action: "view-product"
          });
          
          // Discount expiring soon notification (within 7 days)
          if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
            discountNotifications.push({
              id: `discount-expiring-${product.id}`,
              type: "discount-expiring",
              title: "⏰ Discount Ending Soon",
              message: `${product.name}'s ${discountPercent}% discount expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}! Hurry!`,
              time: new Date().toISOString(),
              read: false,
              priority: daysUntilExpiry <= 2 ? "critical" : "high",
              icon: "timer",
              productId: product.id,
              productName: product.name,
              discountPercent: discountPercent,
              daysUntilExpiry: daysUntilExpiry,
              expiryDate: discountExpiry,
              action: "view-product"
            });
          }
        }
      }
    });
    
    return discountNotifications;
  }, []);

  // Check low stock and out of stock
  const checkStockLevels = useCallback(async (products) => {
    const stockNotifications = [];
    
    products.forEach(product => {
      const stock = Number(product.stock) || 0;
      const threshold = 10; // Default low stock threshold
      
      if (stock === 0) {
        stockNotifications.push({
          id: `outofstock-${product.id}`,
          type: "out-of-stock",
          title: "🚫 Out of Stock Alert",
          message: `${product.name} is completely out of stock! Immediate restock needed.`,
          time: new Date().toISOString(),
          read: false,
          priority: "critical",
          icon: "alert-octagon",
          productId: product.id,
          productName: product.name,
          stock: 0,
          threshold: threshold,
          action: "restock"
        });
      } else if (stock <= threshold) {
        const priority = stock <= 5 ? "high" : "medium";
        stockNotifications.push({
          id: `lowstock-${product.id}`,
          type: "low-stock",
          title: "⚠️ Low Stock Alert",
          message: `${product.name} has only ${stock} units remaining (threshold: ${threshold}). Order more soon!`,
          time: new Date().toISOString(),
          read: false,
          priority: priority,
          icon: "alert-triangle",
          productId: product.id,
          productName: product.name,
          stock: stock,
          threshold: threshold,
          action: "restock"
        });
      }
    });
    
    return stockNotifications;
  }, []);

  // Check product expiry dates
  const checkExpiryDates = useCallback(async (products) => {
    const today = new Date();
    const expiryNotifications = [];
    
    products.forEach(product => {
      if (product.expiry_date) {
        const expiryDate = new Date(product.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 0) {
          expiryNotifications.push({
            id: `expired-${product.id}`,
            type: "expired",
            title: "❌ Product Expired",
            message: `${product.name} has expired on ${new Date(product.expiry_date).toLocaleDateString()}. Remove from inventory immediately.`,
            time: new Date().toISOString(),
            read: false,
            priority: "critical",
            icon: "alert-octagon",
            productId: product.id,
            productName: product.name,
            expiryDate: product.expiry_date,
            daysUntilExpiry: daysUntilExpiry,
            action: "dispose"
          });
        } else if (daysUntilExpiry <= 30) {
          const priority = daysUntilExpiry <= 7 ? "high" : "medium";
          expiryNotifications.push({
            id: `expiring-${product.id}`,
            type: "expiring-soon",
            title: "📅 Product Expiring Soon",
            message: `${product.name} will expire in ${daysUntilExpiry} days (${new Date(product.expiry_date).toLocaleDateString()}). Consider running a promotion or marking down.`,
            time: new Date().toISOString(),
            read: false,
            priority: priority,
            icon: "calendar",
            productId: product.id,
            productName: product.name,
            daysUntilExpiry: daysUntilExpiry,
            expiryDate: product.expiry_date,
            action: "view-product"
          });
        }
      }
    });
    
    return expiryNotifications;
  }, []);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch products - handle paginated response
      const productsRes = await api.getProducts();
      let products = extractDataFromResponse(productsRes);
      
      // If products is empty, try alternative extraction
      if (!products || products.length === 0) {
        if (productsRes.data && typeof productsRes.data === 'object') {
          products = Object.values(productsRes.data).find(val => Array.isArray(val)) || [];
        }
      }
      
      console.log("Products loaded:", products.length);
      
      // Generate all notification types
      const [discountAlerts, stockAlerts, expiryAlerts] = await Promise.all([
        checkDiscounts(products),
        checkStockLevels(products),
        checkExpiryDates(products)
      ]);
      
      // Combine all notifications
      const allNotifications = [
        ...discountAlerts,
        ...stockAlerts,
        ...expiryAlerts
      ];
      
      // Sort by time (newest first)
      allNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
      
      // Add unique IDs and remove duplicates
      const uniqueNotifications = allNotifications.filter((notif, index, self) => 
        index === self.findIndex(n => n.id === notif.id)
      );
      
      setNotifications(uniqueNotifications);
      
      // Update comprehensive stats
      setStats({
        total: uniqueNotifications.length,
        critical: uniqueNotifications.filter(n => n.priority === "critical").length,
        high: uniqueNotifications.filter(n => n.priority === "high").length,
        medium: uniqueNotifications.filter(n => n.priority === "medium").length,
        low: uniqueNotifications.filter(n => n.priority === "low").length,
        activeDiscounts: uniqueNotifications.filter(n => n.type === "active-discount").length,
        discountsExpiringSoon: uniqueNotifications.filter(n => n.type === "discount-expiring").length,
        lowStock: uniqueNotifications.filter(n => n.type === "low-stock").length,
        outOfStock: uniqueNotifications.filter(n => n.type === "out-of-stock").length,
        expiringSoon: uniqueNotifications.filter(n => n.type === "expiring-soon").length,
        expired: uniqueNotifications.filter(n => n.type === "expired").length
      });
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Don't throw error, just set empty array
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [checkDiscounts, checkStockLevels, checkExpiryDates]);

  // Auto-refresh every 60 seconds (reduced frequency to avoid rate limiting)
  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setSelectedNotifications(new Set());
  };

  // Toggle notification selection for bulk actions
  const toggleSelect = (notificationId) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  // Handle bulk actions
  const handleBulkMarkRead = () => {
    setNotifications(prev => 
      prev.map(notif => 
        selectedNotifications.has(notif.id) ? { ...notif, read: true } : notif
      )
    );
    setSelectedNotifications(new Set());
    setShowBulkActions(false);
  };

  const handleBulkDelete = () => {
    setNotifications(prev => prev.filter(notif => !selectedNotifications.has(notif.id)));
    setSelectedNotifications(new Set());
    setShowBulkActions(false);
  };

  // Handle action buttons
  const handleAction = async (notification, action) => {
    switch(action) {
      case "restock":
      case "view-product":
      case "dispose":
        // Navigate to inventory page with product filter
        window.location.href = `/admin/inventory?product=${notification.productId}`;
        break;
      default:
        break;
    }
  };

  // Get filtered notifications
  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    // Filter by type
    if (filter === "discounts") {
      filtered = filtered.filter(n => ["active-discount", "discount-expiring"].includes(n.type));
    } else if (filter === "inventory") {
      filtered = filtered.filter(n => ["low-stock", "out-of-stock"].includes(n.type));
    } else if (filter === "expiry") {
      filtered = filtered.filter(n => ["expiring-soon", "expired"].includes(n.type));
    } else if (filter !== "all") {
      filtered = filtered.filter(n => n.type === filter);
    }
    
    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(n => n.priority === priorityFilter);
    }
    
    // Sort
    if (sortBy === "priority") {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === "time-asc") {
      filtered.sort((a, b) => new Date(a.time) - new Date(b.time));
    } else {
      filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    }
    
    return filtered;
  };

  // Get icon component
  const getIcon = (iconType, priority) => {
    const iconClass = "w-5 h-5";
    const priorityColors = {
      critical: "text-red-600",
      high: "text-orange-600",
      medium: "text-yellow-600",
      low: "text-blue-600"
    };
    const colorClass = priorityColors[priority] || "text-gray-600";
    
    const icons = {
      "alert-triangle": <AlertTriangle className={`${iconClass} ${colorClass}`} />,
      "alert-octagon": <AlertOctagon className={`${iconClass} ${colorClass}`} />,
      "fire": <Flame className={`${iconClass} ${colorClass}`} />,
      "timer": <Timer className={`${iconClass} ${colorClass}`} />,
      "package": <Package className={`${iconClass} ${colorClass}`} />,
      "check-circle": <CheckCircle className={`${iconClass} ${colorClass}`} />,
      "calendar": <Calendar className={`${iconClass} ${colorClass}`} />,
      "percent": <Percent className={`${iconClass} ${colorClass}`} />,
      "box": <Box className={`${iconClass} ${colorClass}`} />,
      "gift": <GiftIcon className={`${iconClass} ${colorClass}`} />
    };
    
    return icons[iconType] || <Bell className={`${iconClass} ${colorClass}`} />;
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Get notification type badge
  const getTypeBadge = (type) => {
    const badges = {
      "active-discount": { label: "🔥 Active Discount", color: "bg-green-100 text-green-800" },
      "discount-expiring": { label: "⏰ Discount Expiring", color: "bg-orange-100 text-orange-800" },
      "low-stock": { label: "⚠️ Low Stock", color: "bg-yellow-100 text-yellow-800" },
      "out-of-stock": { label: "🚫 Out of Stock", color: "bg-red-100 text-red-800" },
      "expiring-soon": { label: "📅 Expiring Soon", color: "bg-amber-100 text-amber-800" },
      "expired": { label: "❌ Expired", color: "bg-red-100 text-red-800" }
    };
    return badges[type] || { label: "Alert", color: "bg-gray-100 text-gray-800" };
  };

  // Format time
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 via-transparent to-stone-800/5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-stone-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <AdminNavbar />

      <main className="flex-1 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2c2c2c] flex items-center gap-3">
                <Bell className="w-8 h-8 text-[#c9a87b]" />
                Notifications Center
                {unreadCount > 0 && (
                  <span className="bg-[#c9a87b] text-white text-sm px-2.5 py-0.5 rounded-full animate-pulse">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p className="text-[#9b7a5a] mt-1">Monitor discounts, stock levels, and product expirations</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => { setRefreshing(true); fetchNotifications(); }}
                disabled={refreshing}
                className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#e8dccc] rounded-lg text-[#2c2c2c] hover:bg-white/80 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-[#c9a87b] text-white rounded-lg hover:bg-[#b8926a] transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark all as read
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#e8dccc] hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9b7a5a] text-sm">Active Discounts</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeDiscounts}</p>
                </div>
                <Flame className="w-8 h-8 text-green-500/60" />
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="text-orange-600">⏰ {stats.discountsExpiringSoon} expiring soon</span>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#e8dccc] hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9b7a5a] text-sm">Stock Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.lowStock + stats.outOfStock}</p>
                </div>
                <Package className="w-8 h-8 text-orange-500/60" />
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="text-red-600">📦 {stats.outOfStock} out of stock</span>
                <span className="text-orange-600">⚠️ {stats.lowStock} low stock</span>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#e8dccc] hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9b7a5a] text-sm">Expiring Products</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.expiringSoon + stats.expired}</p>
                </div>
                <Calendar className="w-8 h-8 text-amber-500/60" />
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="text-red-600">❌ {stats.expired} expired</span>
                <span className="text-amber-600">📅 {stats.expiringSoon} expiring soon</span>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#e8dccc] hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9b7a5a] text-sm">Priority Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical + stats.high}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500/60" />
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="text-red-600">🔥 {stats.critical} critical</span>
                <span className="text-orange-600">⚠️ {stats.high} high priority</span>
              </div>
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-[#e8dccc]">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    filter === "all" 
                      ? "bg-[#c9a87b] text-white shadow-md" 
                      : "bg-white/50 text-[#9b7a5a] hover:bg-white/80"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  All
                </button>
                <button
                  onClick={() => setFilter("discounts")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    filter === "discounts" 
                      ? "bg-[#c9a87b] text-white shadow-md" 
                      : "bg-white/50 text-[#9b7a5a] hover:bg-white/80"
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  Discounts
                </button>
                <button
                  onClick={() => setFilter("inventory")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    filter === "inventory" 
                      ? "bg-[#c9a87b] text-white shadow-md" 
                      : "bg-white/50 text-[#9b7a5a] hover:bg-white/80"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Stock Alerts
                </button>
                <button
                  onClick={() => setFilter("expiry")}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    filter === "expiry" 
                      ? "bg-[#c9a87b] text-white shadow-md" 
                      : "bg-white/50 text-[#9b7a5a] hover:bg-white/80"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Expiry Alerts
                </button>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 bg-white/50 border border-[#e8dccc] rounded-lg text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c9a87b]"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white/50 border border-[#e8dccc] rounded-lg text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c9a87b]"
                >
                  <option value="time">Latest First</option>
                  <option value="time-asc">Oldest First</option>
                  <option value="priority">By Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedNotifications.size > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-amber-700" />
                <span className="text-sm text-amber-800 font-medium">
                  {selectedNotifications.size} notification{selectedNotifications.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBulkMarkRead}
                  className="px-4 py-2 bg-[#c9a87b] text-white rounded-lg hover:bg-[#b8926a] transition-all text-sm font-medium"
                >
                  Mark as Read
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedNotifications(new Set())}
                  className="px-4 py-2 border border-amber-300 text-amber-800 rounded-lg hover:border-amber-400 transition-all text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="space-y-3">
            {loading ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-12 text-center border border-[#e8dccc]">
                <RefreshCw className="w-8 h-8 text-[#c9a87b] animate-spin mx-auto mb-3" />
                <p className="text-[#9b7a5a]">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-12 text-center border border-[#e8dccc]">
                <Bell className="w-12 h-12 text-[#c9a87b]/40 mx-auto mb-3" />
                <p className="text-[#9b7a5a]">No notifications to display</p>
                <p className="text-sm text-[#9b7a5a]/60 mt-1">All caught up! No active discounts, stock alerts, or expiring products.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const typeBadge = getTypeBadge(notification.type);
                const isExpanded = expandedNotification === notification.id;
                
                return (
                  <div
                    key={notification.id}
                    className={`group bg-white/60 backdrop-blur-sm rounded-xl border transition-all hover:shadow-lg ${
                      !notification.read
                        ? "border-l-4 border-l-[#c9a87b] border-[#e8dccc] bg-white/80"
                        : "border-[#e8dccc] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Checkbox for bulk actions */}
                        <div className="flex-shrink-0 pt-1">
                          <input
                            type="checkbox"
                            checked={selectedNotifications.has(notification.id)}
                            onChange={() => toggleSelect(notification.id)}
                            className="w-4 h-4 rounded border-[#e8dccc] accent-[#c9a87b] cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          {getIcon(notification.icon, notification.priority)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold text-[#2c2c2c] flex items-center gap-2">
                                  {notification.title}
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-[#c9a87b] rounded-full animate-pulse"></span>
                                  )}
                                </h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadge.color}`}>
                                  {typeBadge.label}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority.toUpperCase()} PRIORITY
                                </span>
                              </div>
                              <p className="text-[#9b7a5a] text-sm">{notification.message}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3 text-xs text-[#9b7a5a]/70">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(notification.time)}
                            </span>
                            {notification.type === "active-discount" && notification.discountPercent && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Percent className="w-3 h-3" />
                                {notification.discountPercent}% OFF
                              </span>
                            )}
                            {notification.type === "active-discount" && notification.savings && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Sparkles className="w-3 h-3" />
                                Save KES {notification.savings.toLocaleString()}
                              </span>
                            )}
                            {notification.type === "discount-expiring" && notification.daysUntilExpiry && (
                              <span className={`flex items-center gap-1 ${notification.daysUntilExpiry <= 2 ? 'text-red-600' : 'text-orange-600'}`}>
                                <Timer className="w-3 h-3" />
                                {notification.daysUntilExpiry} days left
                              </span>
                            )}
                            {(notification.type === "low-stock" || notification.type === "out-of-stock") && notification.stock !== undefined && (
                              <span className="flex items-center gap-1 text-orange-600">
                                <Package className="w-3 h-3" />
                                Stock: {notification.stock} units
                              </span>
                            )}
                            {(notification.type === "expiring-soon" || notification.type === "expired") && notification.daysUntilExpiry !== undefined && (
                              <span className={`flex items-center gap-1 ${notification.daysUntilExpiry <= 7 ? 'text-red-600' : 'text-amber-600'}`}>
                                <Calendar className="w-3 h-3" />
                                {notification.daysUntilExpiry <= 0 ? 'Expired' : `${notification.daysUntilExpiry} days left`}
                              </span>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-4">
                            {(notification.type === "low-stock" || notification.type === "out-of-stock") && (
                              <button
                                onClick={() => handleAction(notification, "restock")}
                                className="px-3 py-1.5 bg-[#c9a87b] text-white rounded-lg text-xs hover:bg-[#b8926a] transition-all flex items-center gap-1"
                              >
                                <Package className="w-3 h-3" />
                                Restock Now
                              </button>
                            )}
                            {(notification.type === "active-discount" || notification.type === "discount-expiring" || notification.type === "expiring-soon") && (
                              <button
                                onClick={() => handleAction(notification, "view-product")}
                                className="px-3 py-1.5 bg-[#c9a87b] text-white rounded-lg text-xs hover:bg-[#b8926a] transition-all flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                View Product
                              </button>
                            )}
                            {notification.type === "expired" && (
                              <button
                                onClick={() => handleAction(notification, "dispose")}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-all flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove from Inventory
                              </button>
                            )}
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="px-3 py-1.5 border border-[#e8dccc] rounded-lg text-xs hover:bg-white/50 transition-all flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Mark as Read
                            </button>
                            <button
                              onClick={() => setExpandedNotification(isExpanded ? null : notification.id)}
                              className="px-3 py-1.5 border border-[#e8dccc] rounded-lg text-xs hover:bg-white/50 transition-all flex items-center gap-1"
                            >
                              <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                              Details
                            </button>
                          </div>
                          
                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-[#e8dccc]">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-xs text-[#9b7a5a] mb-1">Product Details</p>
                                  <p className="text-[#2c2c2c]">ID: {notification.productId}</p>
                                  <p className="text-[#2c2c2c]">Name: {notification.productName}</p>
                                </div>
                                {(notification.type === "active-discount" || notification.type === "discount-expiring") && (
                                  <div>
                                    <p className="text-xs text-[#9b7a5a] mb-1">Discount Details</p>
                                    <p className="text-[#2c2c2c]">Discount: {notification.discountPercent}% OFF</p>
                                    <p className="text-[#2c2c2c]">Original: KES {notification.originalPrice?.toLocaleString()}</p>
                                    <p className="text-[#2c2c2c]">Current: KES {notification.currentPrice?.toLocaleString()}</p>
                                    {notification.expiryDate && (
                                      <p className="text-[#2c2c2c]">Expires: {new Date(notification.expiryDate).toLocaleString()}</p>
                                    )}
                                  </div>
                                )}
                                {(notification.type === "expiring-soon" || notification.type === "expired") && notification.expiryDate && (
                                  <div>
                                    <p className="text-xs text-[#9b7a5a] mb-1">Expiry Information</p>
                                    <p className="text-[#2c2c2c]">Expiry Date: {new Date(notification.expiryDate).toLocaleDateString()}</p>
                                    <p className="text-[#2c2c2c]">Days Left: {notification.daysUntilExpiry}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs text-[#9b7a5a] mb-1">Notification Info</p>
                                  <p className="text-[#2c2c2c]">ID: {notification.id}</p>
                                  <p className="text-[#2c2c2c]">Type: {notification.type}</p>
                                  <p className="text-[#2c2c2c]">Received: {new Date(notification.time).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notifications;