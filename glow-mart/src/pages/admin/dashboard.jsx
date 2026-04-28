// pages/admin/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import AdminNavbar from "../../components/adminnav";
import { 
  getProducts, 
  getOrders, 
  getCategories, 
  getSuppliers,
  getLowStockProducts,
  getOutOfStockProducts
} from "../../api";
import { 
  ShoppingBag, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ShoppingCart,
  Star,
  Box,
  Layers,
  Percent,
  Flame,
  Timer,
  RefreshCw,
  Download,
  ChevronRight,
  Zap,
  Shield,
  Gift,
  Sparkles,
  Users,
  Wallet
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Helper to extract data from paginated response
const extractDataFromResponse = (response) => {
  if (!response || !response.data) return [];
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data.results && Array.isArray(data.results)) return data.results;
  if (data.data && Array.isArray(data.data)) return data.data;
  return [];
};

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

// Helper to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    activeDiscounts: 0,
    totalInventoryValue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  
  const [timeRange, setTimeRange] = useState("week"); // week, month, year

  // Generate real sales data from orders
  const generateSalesDataFromOrders = useCallback((orders) => {
    const salesMap = new Map();
    const now = new Date();
    let daysToShow = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365;
    
    // Initialize all dates with zero
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      salesMap.set(dateKey, { date: dateKey, sales: 0, orders: 0, day: date.toLocaleDateString('en-GB', { weekday: 'short' }) });
    }
    
    // Aggregate order data
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const dateKey = orderDate.toISOString().split('T')[0];
      const amount = Number(order.total_amount) || 0;
      
      if (salesMap.has(dateKey)) {
        const existing = salesMap.get(dateKey);
        existing.sales += amount;
        existing.orders += 1;
        salesMap.set(dateKey, existing);
      }
    });
    
    // Convert to array and format
    const result = Array.from(salesMap.values()).map(item => ({
      name: timeRange === "week" ? item.day : item.date,
      sales: item.sales,
      orders: item.orders
    }));
    
    return result;
  }, [timeRange]);

  // Generate category distribution from real data
  const generateCategoryDistribution = useCallback((products, categories) => {
    const categoryMap = new Map();
    
    // Initialize categories
    categories.forEach(cat => {
      categoryMap.set(cat.id, { name: cat.name, count: 0, products: [] });
    });
    
    // Count products per category
    products.forEach(product => {
      const categoryId = product.category || product.category_detail?.id;
      if (categoryId && categoryMap.has(categoryId)) {
        const cat = categoryMap.get(categoryId);
        cat.count += 1;
        cat.products.push(product);
        categoryMap.set(categoryId, cat);
      }
    });
    
    // Convert to array and sort by count
    const result = Array.from(categoryMap.values())
      .filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map(cat => ({
        name: cat.name,
        value: cat.count,
        products: cat.count
      }));
    
    return result;
  }, []);

  // Generate order status distribution from real data
  const generateOrderStatusDistribution = useCallback((orders) => {
    const statusMap = new Map();
    const statusColors = {
      pending: '#fbbf24',
      processing: '#60a5fa',
      shipped: '#a78bfa',
      delivered: '#34d399',
      canceled: '#f87171'
    };
    
    orders.forEach(order => {
      const status = order.order_status || 'pending';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });
    
    const result = Array.from(statusMap.entries()).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: statusColors[status] || '#9ca3af'
    }));
    
    return result;
  }, []);

  // Generate daily sales trend from orders
  const generateDailySalesTrend = useCallback((orders) => {
    const dailyMap = new Map();
    const now = new Date();
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
      dailyMap.set(dateKey, { day: dayName, sales: 0, orders: 0 });
    }
    
    // Aggregate
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const dateKey = orderDate.toISOString().split('T')[0];
      if (dailyMap.has(dateKey)) {
        const existing = dailyMap.get(dateKey);
        existing.sales += Number(order.total_amount) || 0;
        existing.orders += 1;
        dailyMap.set(dateKey, existing);
      }
    });
    
    const result = Array.from(dailyMap.entries()).map(([date, data]) => ({
      name: data.day,
      sales: data.sales,
      orders: data.orders,
      fullDate: date
    }));
    
    return result;
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [productsRes, ordersRes, categoriesRes, suppliersRes, lowStockRes, outOfStockRes] = await Promise.all([
        getProducts(),
        getOrders(),
        getCategories(),
        getSuppliers(),
        getLowStockProducts(),
        getOutOfStockProducts()
      ]);
      
      // Extract data
      let products = extractDataFromResponse(productsRes);
      let orders = extractDataFromResponse(ordersRes);
      let categories = extractDataFromResponse(categoriesRes);
      let suppliers = extractDataFromResponse(suppliersRes);
      let lowStock = extractDataFromResponse(lowStockRes);
      let outOfStock = extractDataFromResponse(outOfStockRes);
      
      // Fallback extraction if needed
      if (!products || products.length === 0) {
        if (productsRes.data && typeof productsRes.data === 'object') {
          products = Object.values(productsRes.data).find(val => Array.isArray(val)) || [];
        }
      }
      
      console.log("Dashboard data loaded:", { 
        products: products.length, 
        orders: orders.length,
        categories: categories.length,
        suppliers: suppliers.length
      });
      
      // Calculate real stats
      const totalInventoryValue = products.reduce((sum, p) => sum + (getCurrentPrice(p) * (Number(p.stock) || 0)), 0);
      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
      const activeDiscounts = products.filter(p => isDiscountActive(p)).length;
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCategories: categories.length,
        totalSuppliers: suppliers.length,
        totalRevenue: totalRevenue,
        averageOrderValue: averageOrderValue,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        activeDiscounts: activeDiscounts,
        totalInventoryValue: totalInventoryValue
      });
      
      // Get recent orders (last 5)
      const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRecentOrders(sortedOrders.slice(0, 5));
      
      // Get top products by inventory value
      const productsWithValue = products.map(p => ({
        ...p,
        inventoryValue: (getCurrentPrice(p) * (Number(p.stock) || 0)),
        currentPrice: getCurrentPrice(p),
        hasDiscount: isDiscountActive(p)
      }));
      const topByValue = [...productsWithValue].sort((a, b) => b.inventoryValue - a.inventoryValue).slice(0, 5);
      setTopProducts(topByValue);
      
      // Low stock and out of stock products
      setLowStockProducts(lowStock.slice(0, 5));
      setOutOfStockProducts(outOfStock.slice(0, 5));
      
      // Generate real data from orders
      const salesChartData = generateSalesDataFromOrders(orders);
      setSalesData(salesChartData);
      
      // Generate daily sales trend
      const dailyTrend = generateDailySalesTrend(orders);
      setDailySales(dailyTrend);
      
      // Category distribution from real data
      const categoryData = generateCategoryDistribution(products, categories);
      setCategoryDistribution(categoryData);
      
      // Order status distribution
      const statusData = generateOrderStatusDistribution(orders);
      setOrderStatusDistribution(statusData);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [generateSalesDataFromOrders, generateCategoryDistribution, generateOrderStatusDistribution, generateDailySalesTrend]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleExport = () => {
    // Create CSV data
    const csvData = [
      ['Metric', 'Value'],
      ['Total Products', stats.totalProducts],
      ['Total Orders', stats.totalOrders],
      ['Total Revenue', stats.totalRevenue],
      ['Average Order Value', stats.averageOrderValue],
      ['Total Inventory Value', stats.totalInventoryValue],
      ['Active Discounts', stats.activeDiscounts],
      ['Low Stock Products', stats.lowStockCount],
      ['Out of Stock Products', stats.outOfStockCount]
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#c9a87b', '#e8dccc', '#b8926a', '#9b7a5a', '#d4b896', '#a88868', '#f0e4d0', '#8b6b4a'];

  // Stat cards data with real values
  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      text: "text-amber-600"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600"
    },
    {
      title: "Inventory Value",
      value: formatCurrency(stats.totalInventoryValue),
      icon: Box,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-600"
    },
    {
      title: "Active Discounts",
      value: stats.activeDiscounts,
      icon: Percent,
      color: "from-red-500 to-red-600",
      bg: "bg-red-50",
      text: "text-red-600"
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      text: "text-orange-600"
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockCount,
      icon: Truck,
      color: "from-rose-500 to-rose-600",
      bg: "bg-rose-50",
      text: "text-rose-600"
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(stats.averageOrderValue),
      icon: TrendingUp,
      color: "from-teal-500 to-teal-600",
      bg: "bg-teal-50",
      text: "text-teal-600"
    }
  ];

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] pt-20">
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#c9a87b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#9b7a5a] font-light">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.1);
        }
        .dashboard-card {
          transition: all 0.3s ease;
        }
        .dashboard-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8 animate-fadeInUp">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#c9a87b] to-[#b8926a] rounded-full"></div>
                  <p className="text-sm text-[#b89b7b] font-medium uppercase tracking-wide">Analytics Overview</p>
                </div>
                <h1 className="font-serif text-4xl font-light text-[#2c2c2c]">Dashboard</h1>
                <p className="text-[#6b6b6b] mt-1">Real-time overview of your store's performance</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#e8dccc] rounded-xl text-[#2c2c2c] hover:bg-white/80 transition-all flex items-center gap-2 text-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#e8dccc] rounded-xl text-[#2c2c2c] hover:bg-white/80 transition-all flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((card, index) => (
              <div
                key={card.title}
                className={`stat-card bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-[#e8dccc] hover:shadow-xl animate-fadeInUp`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.text}`} />
                  </div>
                </div>
                <p className="text-[#9b7a5a] text-sm mb-1">{card.title}</p>
                <p className="text-2xl font-semibold text-[#2c2c2c]">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart - Real data from orders */}
            <div className="dashboard-card bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#e8dccc] animate-fadeInUp">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-[#2c2c2c] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#c9a87b]" />
                    Sales Overview
                  </h3>
                  <p className="text-xs text-[#9b7a5a] mt-1">Last {timeRange === "week" ? "7 days" : timeRange === "month" ? "30 days" : "12 months"} performance</p>
                </div>
                <div className="flex gap-2">
                  {["week", "month", "year"].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                        timeRange === range
                          ? "bg-[#c9a87b] text-white"
                          : "text-[#6b6b6b] hover:bg-white/50"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a87b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#c9a87b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8dccc" />
                  <XAxis dataKey="name" tick={{ fill: '#9b7a5a', fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: '#9b7a5a', fontSize: 11 }} tickFormatter={(value) => `KES ${value/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9b7a5a', fontSize: 11 }} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'sales') return [formatCurrency(value), 'Sales'];
                      return [value, 'Orders'];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e8dccc',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#c9a87b" 
                    fill="url(#colorSales)"
                    strokeWidth={2}
                  />
                  <Bar yAxisId="right" dataKey="orders" fill="#e8dccc" radius={[4, 4, 0, 0]} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Distribution - Real data */}
            <div className="dashboard-card bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#e8dccc] animate-fadeInUp">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-[#2c2c2c] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#c9a87b]" />
                    Order Status Distribution
                  </h3>
                  <p className="text-xs text-[#9b7a5a] mt-1">Current order status breakdown</p>
                </div>
              </div>
              {orderStatusDistribution.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-[#9b7a5a]">No order data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="dashboard-card bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#e8dccc] animate-fadeInUp">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-[#2c2c2c] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#c9a87b]" />
                    Category Distribution
                  </h3>
                  <p className="text-xs text-[#9b7a5a] mt-1">Products by category</p>
                </div>
              </div>
              {categoryDistribution.length === 0 ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-[#9b7a5a]">No category data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8dccc" />
                    <XAxis type="number" tick={{ fill: '#9b7a5a', fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#9b7a5a', fontSize: 11 }} width={100} />
                    <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                    <Bar dataKey="value" fill="#c9a87b" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Daily Sales Trend */}
            <div className="dashboard-card bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#e8dccc] animate-fadeInUp">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-[#2c2c2c] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#c9a87b]" />
                    Daily Sales Trend
                  </h3>
                  <p className="text-xs text-[#9b7a5a] mt-1">Last 7 days performance</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8dccc" />
                  <XAxis dataKey="name" tick={{ fill: '#9b7a5a', fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: '#9b7a5a', fontSize: 11 }} tickFormatter={(value) => `KES ${value/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9b7a5a', fontSize: 11 }} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'sales') return [formatCurrency(value), 'Sales'];
                      return [value, 'Orders'];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e8dccc',
                      borderRadius: '12px'
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#c9a87b" strokeWidth={2} dot={{ fill: '#c9a87b', r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#9b7a5a" strokeWidth={2} dot={{ fill: '#9b7a5a', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders and Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders - Real data */}
            <div className="dashboard-card bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e8dccc] animate-fadeInUp">
              <div className="p-6 border-b border-[#e8dccc]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#2c2c2c] flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#c9a87b]" />
                      Recent Orders
                    </h3>
                    <p className="text-xs text-[#9b7a5a] mt-1">Latest customer orders</p>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/admin/orders'}
                    className="text-xs text-[#c9a87b] hover:text-[#b8926a] transition-colors flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-[#e8dccc] max-h-[400px] overflow-y-auto">
                {recentOrders.length === 0 ? (
                  <div className="p-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-[#c9a87b]/30 mx-auto mb-3" />
                    <p className="text-[#9b7a5a]">No orders yet</p>
                  </div>
                ) : (
                  recentOrders.map((order, idx) => (
                    <div key={order.id || idx} className="p-4 hover:bg-white/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/admin/orders/${order.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-[#c9a87b]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#2c2c2c] text-sm">
                              {order.order_number || `#${order.id}`}
                            </p>
                            <p className="text-xs text-[#9b7a5a]">{order.customer_name || 'Guest'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#2c2c2c] text-sm">
                            {formatCurrency(order.total_amount || 0)}
                          </p>
                          <p className="text-xs text-[#9b7a5a]">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Products by Inventory Value - Real data */}
            <div className="dashboard-card bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e8dccc] animate-fadeInUp">
              <div className="p-6 border-b border-[#e8dccc]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#2c2c2c] flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#c9a87b]" />
                      Top Products by Value
                    </h3>
                    <p className="text-xs text-[#9b7a5a] mt-1">Highest inventory value products</p>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/admin/inventory'}
                    className="text-xs text-[#c9a87b] hover:text-[#b8926a] transition-colors flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-[#e8dccc] max-h-[400px] overflow-y-auto">
                {topProducts.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="w-12 h-12 text-[#c9a87b]/30 mx-auto mb-3" />
                    <p className="text-[#9b7a5a]">No products yet</p>
                  </div>
                ) : (
                  topProducts.map((product, idx) => (
                    <div key={product.id || idx} className="p-4 hover:bg-white/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/admin/inventory?product=${product.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-xl flex items-center justify-center">
                            {product.hasDiscount ? (
                              <Flame className="w-5 h-5 text-red-500" />
                            ) : (
                              <Package className="w-5 h-5 text-[#c9a87b]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#2c2c2c] text-sm line-clamp-1 max-w-[200px]">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-[#9b7a5a]">Stock: {product.stock || 0}</span>
                              {product.hasDiscount && (
                                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                                  {product.discount_percent}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {product.hasDiscount ? (
                            <>
                              <p className="font-semibold text-red-500 text-sm">
                                {formatCurrency(product.currentPrice)}
                              </p>
                              <p className="text-xs text-[#9b7a5a] line-through">
                                {formatCurrency(product.price)}
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold text-[#2c2c2c] text-sm">
                              {formatCurrency(product.price)}
                            </p>
                          )}
                          <p className="text-xs text-[#9b7a5a] mt-1">
                            Value: {formatCurrency(product.inventoryValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Stock Alerts - Real data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Low Stock Alerts */}
            <div className="dashboard-card bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e8dccc] animate-fadeInUp">
              <div className="p-6 border-b border-[#e8dccc]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#2c2c2c] flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Low Stock Alerts
                    </h3>
                    <p className="text-xs text-[#9b7a5a] mt-1">Products running low on inventory</p>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/admin/inventory?filter=lowstock'}
                    className="text-xs text-[#c9a87b] hover:text-[#b8926a] transition-colors flex items-center gap-1"
                  >
                    Manage Stock
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-[#e8dccc]">
                {lowStockProducts.length === 0 ? (
                  <div className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500/30 mx-auto mb-3" />
                    <p className="text-[#9b7a5a]">No low stock alerts</p>
                    <p className="text-xs text-[#9b7a5a]/60 mt-1">All products have sufficient stock</p>
                  </div>
                ) : (
                  lowStockProducts.map((product, idx) => (
                    <div key={product.id || idx} className="p-4 hover:bg-white/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="font-medium text-[#2c2c2c] text-sm line-clamp-1 max-w-[200px]">{product.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-orange-600 font-medium">
                                Only {product.stock} units left
                              </span>
                              <span className="text-xs text-[#9b7a5a]">
                                Threshold: 10 units
                              </span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => window.location.href = `/admin/inventory?product=${product.id}`}
                          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition-colors"
                        >
                          Restock
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Out of Stock Alerts */}
            <div className="dashboard-card bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e8dccc] animate-fadeInUp">
              <div className="p-6 border-b border-[#e8dccc]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#2c2c2c] flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Out of Stock
                    </h3>
                    <p className="text-xs text-[#9b7a5a] mt-1">Products that need immediate restock</p>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/admin/inventory?filter=outofstock'}
                    className="text-xs text-[#c9a87b] hover:text-[#b8926a] transition-colors flex items-center gap-1"
                  >
                    Manage Stock
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-[#e8dccc]">
                {outOfStockProducts.length === 0 ? (
                  <div className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500/30 mx-auto mb-3" />
                    <p className="text-[#9b7a5a]">No out of stock products</p>
                    <p className="text-xs text-[#9b7a5a]/60 mt-1">All products are in stock</p>
                  </div>
                ) : (
                  outOfStockProducts.map((product, idx) => (
                    <div key={product.id || idx} className="p-4 hover:bg-white/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <p className="font-medium text-[#2c2c2c] text-sm line-clamp-1 max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-red-600 font-medium mt-1">Completely out of stock!</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => window.location.href = `/admin/inventory?product=${product.id}`}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-8 text-center text-xs text-[#9b7a5a]">
            <p>Last updated: {new Date().toLocaleString()}</p>
            <p className="mt-1">Data is automatically refreshed from your database</p>
          </div>
        </div>
      </div>
    </>
  );
}
