// components/adminnav.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import MK from "../assets/ro.png";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

function AdminNavbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const mobileMenuRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Helper to check if discount is active
  const isDiscountActive = (product) => {
    const discountPercent = Number(product.discount_percent) || 0;
    const discountExpiry = product.discount_expiry;
    
    if (discountPercent <= 0) return false;
    if (!discountExpiry) return false;
    
    const expiryDate = new Date(discountExpiry);
    return expiryDate > new Date();
  };

  // Fetch real activity logs from endpoints
  const fetchActivityLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      // Fetch recent changes from different endpoints
      const [
        productsRes,
        ordersRes,
        suppliersRes,
        categoriesRes
      ] = await Promise.allSettled([
        axios.get(`${API_BASE}/inventory/products/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { ordering: '-updated_at' }
        }),
        axios.get(`${API_BASE}/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { ordering: '-updated_at' }
        }),
        axios.get(`${API_BASE}/inventory/suppliers/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { ordering: '-updated_at' }
        }),
        axios.get(`${API_BASE}/inventory/categories/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { ordering: '-updated_at' }
        })
      ]);

      const activities = [];

      // Process products
      if (productsRes.status === 'fulfilled' && productsRes.value.data) {
        const products = Array.isArray(productsRes.value.data) 
          ? productsRes.value.data 
          : (productsRes.value.data.results || []);
        
        products.forEach(product => {
          if (product.created_at) {
            activities.push({
              action: `Created new product: ${product.name || product.id}`,
              timestamp: product.created_at,
              type: 'create',
              entity: 'product',
              entityId: product.id
            });
          }
          if (product.updated_at && product.updated_at !== product.created_at) {
            activities.push({
              action: `Updated product: ${product.name || product.id}`,
              timestamp: product.updated_at,
              type: 'edit',
              entity: 'product',
              entityId: product.id
            });
          }
        });
      }

      // Process orders
      if (ordersRes.status === 'fulfilled' && ordersRes.value.data) {
        const orders = Array.isArray(ordersRes.value.data) 
          ? ordersRes.value.data 
          : (ordersRes.value.data.results || []);
        
        orders.forEach(order => {
          if (order.created_at) {
            activities.push({
              action: `Order #${order.order_number || order.id} created - Total: $${order.total_amount || 0}`,
              timestamp: order.created_at,
              type: 'create',
              entity: 'order',
              entityId: order.id
            });
          }
          if (order.updated_at && order.status) {
            activities.push({
              action: `Order #${order.order_number || order.id} status updated to: ${order.status}`,
              timestamp: order.updated_at,
              type: 'process',
              entity: 'order',
              entityId: order.id
            });
          }
        });
      }

      // Process suppliers
      if (suppliersRes.status === 'fulfilled' && suppliersRes.value.data) {
        const suppliers = Array.isArray(suppliersRes.value.data) 
          ? suppliersRes.value.data 
          : (suppliersRes.value.data.results || []);
        
        suppliers.forEach(supplier => {
          if (supplier.created_at) {
            activities.push({
              action: `Added new supplier: ${supplier.name || supplier.company_name || supplier.id}`,
              timestamp: supplier.created_at,
              type: 'create',
              entity: 'supplier',
              entityId: supplier.id
            });
          }
          if (supplier.updated_at && supplier.updated_at !== supplier.created_at) {
            activities.push({
              action: `Updated supplier: ${supplier.name || supplier.company_name || supplier.id}`,
              timestamp: supplier.updated_at,
              type: 'edit',
              entity: 'supplier',
              entityId: supplier.id
            });
          }
        });
      }

      // Process categories
      if (categoriesRes.status === 'fulfilled' && categoriesRes.value.data) {
        const categories = Array.isArray(categoriesRes.value.data) 
          ? categoriesRes.value.data 
          : (categoriesRes.value.data.results || []);
        
        categories.forEach(category => {
          if (category.created_at) {
            activities.push({
              action: `Created new category: ${category.name || category.id}`,
              timestamp: category.created_at,
              type: 'create',
              entity: 'category',
              entityId: category.id
            });
          }
          if (category.updated_at && category.updated_at !== category.created_at) {
            activities.push({
              action: `Updated category: ${category.name || category.id}`,
              timestamp: category.updated_at,
              type: 'edit',
              entity: 'category',
              entityId: category.id
            });
          }
        });
      }

      // Check for low stock and out of stock products
      try {
        const lowStockRes = await axios.get(`${API_BASE}/inventory/products/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { stock__lt: 10, stock__gt: 0, ordering: '-updated_at' }
        });
        
        const lowStockProducts = lowStockRes.data.results || lowStockRes.data || [];
        lowStockProducts.forEach(product => {
          if (Number(product.stock) <= 10 && Number(product.stock) > 0) {
            activities.push({
              action: `⚠️ Low stock alert: ${product.name || product.id} has only ${product.stock} units left`,
              timestamp: product.updated_at || new Date().toISOString(),
              type: 'alert',
              entity: 'product',
              entityId: product.id
            });
          }
        });

        const outOfStockRes = await axios.get(`${API_BASE}/inventory/products/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { stock: 0, ordering: '-updated_at' }
        });
        
        const outOfStockProducts = outOfStockRes.data.results || outOfStockRes.data || [];
        outOfStockProducts.forEach(product => {
          activities.push({
            action: `❌ Out of stock: ${product.name || product.id} needs restocking immediately`,
            timestamp: product.updated_at || new Date().toISOString(),
            type: 'alert',
            entity: 'product',
            entityId: product.id
          });
        });
      } catch (error) {
        console.error("Error fetching stock alerts:", error);
      }

      // Sort by timestamp (newest first) and get top 5
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

      return sortedActivities;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      return [];
    }
  };

  // Load activity logs
  const loadActivityLogs = async () => {
    setLoadingActivities(true);
    const logs = await fetchActivityLogs();
    setActivityLogs(logs);
    setLoadingActivities(false);
  };

  // Fetch real notification count from the database
  const fetchNotificationCount = async () => {
    try {
      setLoadingNotifications(true);
      
      const productsRes = await axios.get(`${API_BASE}/inventory/products/`);
      
      let products = [];
      if (Array.isArray(productsRes.data)) {
        products = productsRes.data;
      } else if (productsRes.data?.results && Array.isArray(productsRes.data.results)) {
        products = productsRes.data.results;
      } else if (productsRes.data?.data && Array.isArray(productsRes.data.data)) {
        products = productsRes.data.data;
      } else {
        console.warn('Unexpected products response format:', productsRes.data);
        products = [];
      }
      
      let notificationCount = 0;
      const today = new Date();
      
      products.forEach(product => {
        const discountPercent = Number(product.discount_percent) || 0;
        const discountExpiry = product.discount_expiry;
        
        if (discountPercent > 0 && discountExpiry) {
          const expiryDate = new Date(discountExpiry);
          const isActive = expiryDate > today;
          const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
          
          if (isActive) notificationCount++;
          if (isActive && daysUntilExpiry <= 7) notificationCount++;
        }
        
        const stock = Number(product.stock) || 0;
        if (stock === 0) {
          notificationCount++;
        } else if (stock <= 10) {
          notificationCount++;
        }
        
        if (product.expiry_date) {
          const expiryDate = new Date(product.expiry_date);
          const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysUntilExpiry <= 0) {
            notificationCount++;
          } else if (daysUntilExpiry <= 30) {
            notificationCount++;
          }
        }
      });
      
      setNotificationCount(notificationCount);
    } catch (error) {
      console.error("Error fetching notification count:", error);
      setNotificationCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotificationCount();
    loadActivityLogs();
    
    const notificationInterval = setInterval(() => {
      fetchNotificationCount();
    }, 30000);
    
    const activityInterval = setInterval(() => {
      loadActivityLogs();
    }, 30000);
    
    return () => {
      clearInterval(notificationInterval);
      clearInterval(activityInterval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const user = {
    name: "Kamau Admin",
    email: "kamau.admin@glowmart.com",
    role: "Super Admin",
    avatar: "KA",
    joined: "January 2024",
    lastLogin: "2024-03-05 09:30 AM",
    permissions: ["Full Access", "User Management", "Inventory Control"],
  };

  const navLinks = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Inventory", href: "/admin/inventory", icon: "📦" },
    { label: "Orders", href: "/admin/orders", icon: "🛒" },
    { label: "Suppliers", href: "/admin/suppliers", icon: "🏭" },
    { label: "Categories", href: "/admin/categories", icon: "📑" },
    { label: "Notifications", href: "/admin/notifications", icon: "🔔", badge: notificationCount },
  ];

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes glassFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        .animate-glassFadeIn { animation: glassFadeIn 0.3s ease-out forwards; }
        .animate-modalPop { animation: modalPop 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) forwards; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        
        /* Desktop Navigation */
        .desktop-nav {
          display: flex;
        }
        
        /* Mobile Menu Button - Hidden on desktop */
        .mobile-menu-btn {
          display: none;
        }
        
        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1045;
          animation: fadeIn 0.3s ease-out;
        }
        
        .mobile-menu-container {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 320px;
          background: white;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
          z-index: 1050;
          overflow-y: auto;
          animation: slideInRight 0.3s ease-out;
        }
        
        /* Profile Dropdown - Fixed positioning */
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          background: white;
          border: 1px solid #f0e7db;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          z-index: 1060;
          overflow: hidden;
        }
        
        /* Modal container */
        .modal-container {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        /* Responsive Breakpoints */
        @media (max-width: 1023px) {
          .desktop-nav { display: none; }
          .mobile-menu-btn { display: flex; }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .tablet-nav { display: flex; }
          .desktop-nav { display: none; }
        }
        
        @media (min-width: 1024px) {
          .desktop-nav { display: flex; }
          .mobile-menu-btn { display: none; }
          .tablet-nav { display: none; }
        }
        
        /* Scrollbar */
        .mobile-menu-container::-webkit-scrollbar {
          width: 4px;
        }
        .mobile-menu-container::-webkit-scrollbar-track {
          background: #f0e7db;
        }
        .mobile-menu-container::-webkit-scrollbar-thumb {
          background: #b89b7b;
          border-radius: 4px;
        }
        
        /* Nav link hover effects */
        .nav-link {
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          background: rgba(184, 155, 123, 0.1);
        }
        
        /* Ensure navbar has higher z-index */
        .navbar-container {
          z-index: 1000;
        }
        
        /* Profile button styles */
        .profile-button {
          position: relative;
        }
      `}</style>

      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-300 navbar-container ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-[#f0e7db]"
          : "bg-white border-b border-[#f0e7db]"
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
                <div className="relative flex-shrink-0">
                  <img
                    src={MK}
                    alt="Glowmart Logo"
                    className="h-10 sm:h-12 md:h-14 object-contain transition-all duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#b89b7b] font-medium whitespace-nowrap">
                    Admin Dashboard
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="desktop-nav items-center space-x-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`
                      relative flex items-center px-3 lg:px-4 py-2 rounded-lg transition-all duration-200
                      ${active
                        ? "bg-[#faf7f2] text-[#b89b7b]"
                        : "text-[#6b6b6b] hover:bg-[#faf7f2] hover:text-[#2c2c2c]"
                      }
                    `}
                  >
                    <span className="text-base lg:text-lg mr-2">{link.icon}</span>
                    <span className="text-xs lg:text-sm font-medium tracking-wide whitespace-nowrap">
                      {link.label}
                    </span>
                    {link.badge > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse px-1">
                        {link.badge > 99 ? '99+' : link.badge}
                      </span>
                    )}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#b89b7b] rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Tablet Navigation (Condensed) */}
            <div className="tablet-nav items-center space-x-1">
              {navLinks.slice(0, 4).map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`
                      relative flex items-center px-2 py-2 rounded-lg transition-all duration-200
                      ${active
                        ? "bg-[#faf7f2] text-[#b89b7b]"
                        : "text-[#6b6b6b] hover:bg-[#faf7f2] hover:text-[#2c2c2c]"
                      }
                    `}
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.badge > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                        {link.badge > 99 ? '99+' : link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section - Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Profile Menu */}
              <div className="relative profile-button" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 sm:space-x-3 p-1.5 rounded-lg hover:bg-[#faf7f2] transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#b89b7b] to-[#9b7a5a] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-[#2c2c2c]">{user.name}</p>
                    <p className="text-xs text-[#b89b7b] font-light">{user.role}</p>
                  </div>
                  <svg
                    className="w-3 h-3 text-[#6b6b6b] transition-transform duration-200 hidden sm:block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ transform: profileDropdownOpen ? "rotate(180deg)" : "none" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="p-4 border-b border-[#f0e7db] bg-white">
                      <p className="text-sm font-medium text-[#2c2c2c]">{user.name}</p>
                      <p className="text-xs text-[#6b6b6b] mt-1">{user.email}</p>
                      <p className="text-xs text-[#b89b7b] mt-1">{user.role}</p>
                    </div>
                    <div className="py-2 bg-white">
                      <button
                        onClick={() => { setProfileDropdownOpen(false); setActivityModalOpen(true); loadActivityLogs(); }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-[#2c2c2c] hover:bg-[#faf7f2] transition-colors text-left"
                      >
                        <span className="mr-3 text-base">📋</span>
                        Activity Log
                      </button>
                      <button
                        onClick={() => { setProfileDropdownOpen(false); setSettingsModalOpen(true); }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-[#2c2c2c] hover:bg-[#faf7f2] transition-colors text-left"
                      >
                        <span className="mr-3 text-base">⚙️</span>
                        Settings
                      </button>
                      <div className="border-t border-[#f0e7db] my-1"></div>
                      <button
                        onClick={() => { setProfileDropdownOpen(false); openLogoutModal(); }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <span className="mr-3 text-base">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="mobile-menu-btn p-2 text-[#6b6b6b] hover:text-[#b89b7b] hover:bg-[#faf7f2] rounded-lg transition-all"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-menu-container" ref={mobileMenuRef}>
            <div className="p-5 border-b border-[#f0e7db] bg-gradient-to-r from-[#faf7f2] to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#b89b7b] to-[#9b7a5a] rounded-full flex items-center justify-center text-white text-lg font-medium">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-[#2c2c2c]">{user.name}</p>
                    <p className="text-xs text-[#6b6b6b]">{user.email}</p>
                    <p className="text-xs text-[#b89b7b]">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#6b6b6b] hover:text-[#2c2c2c] hover:bg-[#faf7f2] rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="py-4">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center px-6 py-3 transition-all
                      ${active
                        ? "bg-[#faf7f2] text-[#b89b7b] border-l-4 border-[#b89b7b]"
                        : "text-[#6b6b6b] hover:bg-[#faf7f2]"
                      }
                    `}
                  >
                    <span className="text-xl mr-3">{link.icon}</span>
                    <span className="text-sm font-medium flex-1">{link.label}</span>
                    {link.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {link.badge > 99 ? '99+' : link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-[#f0e7db] pt-4 px-6 pb-6">
              <p className="text-xs text-[#6b6b6b] mb-2 uppercase tracking-wide">Quick Actions</p>
              <button
                onClick={() => { setMobileMenuOpen(false); setActivityModalOpen(true); loadActivityLogs(); }}
                className="w-full flex items-center px-4 py-3 text-sm text-[#2c2c2c] hover:bg-[#faf7f2] rounded-lg transition-colors"
              >
                <span className="mr-3 text-base">📋</span>
                Activity Log
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setSettingsModalOpen(true); }}
                className="w-full flex items-center px-4 py-3 text-sm text-[#2c2c2c] hover:bg-[#faf7f2] rounded-lg transition-colors"
              >
                <span className="mr-3 text-base">⚙️</span>
                Settings
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); openLogoutModal(); }}
                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
              >
                <span className="mr-3 text-base">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Activity Log Modal */}
      {activityModalOpen && (
        <div className="modal-container" onClick={() => setActivityModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-6 border-b border-[#f0e7db] flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-light text-[#2c2c2c]">Activity Log</h2>
                <p className="text-xs text-[#6b6b6b] mt-1">Recent actions and system events</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={async () => {
                    setLoadingActivities(true);
                    const logs = await fetchActivityLogs();
                    setActivityLogs(logs);
                    setLoadingActivities(false);
                  }} 
                  className="p-2 text-[#6b6b6b] hover:text-[#2c2c2c] hover:bg-[#faf7f2] rounded-lg transition-colors"
                  title="Refresh activities"
                  disabled={loadingActivities}
                >
                  {loadingActivities ? "⏳" : "🔄"}
                </button>
                <button 
                  onClick={() => setActivityModalOpen(false)} 
                  className="p-2 text-[#6b6b6b] hover:text-[#2c2c2c] hover:bg-[#faf7f2] rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              {loadingActivities ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#b89b7b]"></div>
                  <p className="text-sm text-[#6b6b6b] mt-2">Loading activities...</p>
                </div>
              ) : activityLogs.length > 0 ? (
                <div className="space-y-4">
                  {activityLogs.map((activity, idx) => (
                    <div key={idx} className="flex items-start space-x-3 pb-4 border-b border-[#f0e7db] last:border-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === "create" ? "bg-green-100 text-green-600" :
                        activity.type === "edit" ? "bg-blue-100 text-blue-600" :
                        activity.type === "delete" ? "bg-red-100 text-red-600" :
                        activity.type === "process" ? "bg-purple-100 text-purple-600" :
                        activity.type === "login" ? "bg-amber-100 text-amber-600" :
                        activity.type === "alert" ? "bg-orange-100 text-orange-600" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {activity.type === "create" && "✓"}
                        {activity.type === "edit" && "✎"}
                        {activity.type === "delete" && "🗑"}
                        {activity.type === "process" && "⚙"}
                        {activity.type === "login" && "🔐"}
                        {activity.type === "alert" && "⚠"}
                        {activity.type === "report" && "📊"}
                        {activity.type === "update" && "↻"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#2c2c2c]">{activity.action}</p>
                        <p className="text-xs text-[#6b6b6b] mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-[#6b6b6b]">No recent activities found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div className="modal-container" onClick={() => setSettingsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-6 border-b border-[#f0e7db] flex justify-between items-center">
              <h2 className="font-serif text-2xl font-light text-[#2c2c2c]">Profile Settings</h2>
              <button onClick={() => setSettingsModalOpen(false)} className="p-2 text-[#6b6b6b] hover:text-[#2c2c2c] hover:bg-[#faf7f2] rounded-lg transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#b89b7b] to-[#9b7a5a] rounded-full flex items-center justify-center text-white text-2xl font-medium">{user.avatar}</div>
                <div>
                  <h3 className="text-lg font-medium text-[#2c2c2c]">{user.name}</h3>
                  <p className="text-sm text-[#b89b7b]">{user.role}</p>
                  <p className="text-xs text-[#6b6b6b] mt-1">Member since {user.joined}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs text-[#6b6b6b] mb-1">FULL NAME</label><input type="text" defaultValue={user.name} className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none rounded-lg" /></div>
                <div><label className="block text-xs text-[#6b6b6b] mb-1">EMAIL</label><input type="email" defaultValue={user.email} className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none rounded-lg" /></div>
                <div><label className="block text-xs text-[#6b6b6b] mb-1">PHONE</label><input type="tel" defaultValue="+254 712 345 678" className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none rounded-lg" /></div>
                <div><label className="block text-xs text-[#6b6b6b] mb-1">DEPARTMENT</label><input type="text" defaultValue="Administration" className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none rounded-lg" /></div>
              </div>
              <div><label className="block text-xs text-[#6b6b6b] mb-2">PERMISSIONS</label><div className="flex flex-wrap gap-2">{user.permissions.map((perm, idx) => (<span key={idx} className="px-3 py-1 bg-[#faf7f2] border border-[#f0e7db] text-xs text-[#6b6b6b] rounded-full">{perm}</span>))}</div></div>
              <div className="bg-[#faf7f2] p-4 rounded-lg"><p className="text-xs text-[#6b6b6b]">LAST LOGIN</p><p className="text-sm text-[#2c2c2c] mt-1">{user.lastLogin}</p></div>
              <div className="flex gap-3 pt-4 border-t border-[#f0e7db]">
                <button className="flex-1 py-3 bg-[#2c2c2c] text-white text-sm hover:bg-[#b89b7b] transition-colors rounded-lg">SAVE CHANGES</button>
                <button onClick={() => setSettingsModalOpen(false)} className="flex-1 py-3 border border-[#e0d5c8] text-[#6b6b6b] text-sm hover:border-[#b89b7b] transition-colors rounded-lg">CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="modal-container" onClick={closeLogoutModal}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-t-2xl"></div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2c2c2c] mb-2">Confirm Logout</h3>
              <p className="text-sm text-[#6b6b6b]">Are you sure you want to logout? You will need to login again to access the admin dashboard.</p>
            </div>
            <div className="mx-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6b6b6b]">Current Session:</span>
                <span className="text-[#2c2c2c] font-medium">{user.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-[#6b6b6b]">Role:</span>
                <span className="text-[#b89b7b] font-medium">{user.role}</span>
              </div>
            </div>
            <div className="p-6 flex gap-3">
              <button onClick={closeLogoutModal} className="flex-1 px-4 py-2.5 border border-[#e0d5c8] text-[#6b6b6b] rounded-lg hover:bg-[#faf7f2] transition-all text-sm font-medium">Cancel</button>
              <button onClick={handleLogout} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all text-sm font-medium shadow-lg shadow-red-500/30">Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
}

export default AdminNavbar;