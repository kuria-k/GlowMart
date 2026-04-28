// routes/routes.jsx
import { Routes, Route } from "react-router-dom";
import { useCart } from "../hooks/usecart";
import CartSidebar from "../components/CartSidebar";
import Home from "../pages/home";
import Login from "../pages/login";
import Blogs from "../pages/blogs";
import Stocks from "../pages/stocks";
import About from "../pages/about";
import Admindash from "../pages/admin/dashboard";
import Adminninventory from "../pages/admin/inventory";
import Adminnotifications from "../pages/admin/notifications";
import Adminorders from "../pages/admin/orders";
import Adminsupplier from "../pages/admin/supplier";
import Admincategory from "../pages/admin/categories";
import Wishlist from "../pages/wishlist";

function AppRoutes() {
  const { openCart } = useCart();
  
  // Debug log
  console.log('AppRoutes - openCart available:', !!openCart);

  return (
    <>
      
      <CartSidebar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Admindash />} />
        <Route path="/admin/inventory" element={<Adminninventory />} />
        <Route path="/admin/notifications" element={<Adminnotifications />} />
        <Route path="/admin/orders" element={<Adminorders />} />
        <Route path="/admin/suppliers" element={<Adminsupplier />} />
        <Route path="/admin/categories" element={<Admincategory />} />
      </Routes>
    </>
  );
}

export default AppRoutes;