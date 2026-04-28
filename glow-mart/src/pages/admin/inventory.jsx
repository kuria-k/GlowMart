// pages/admin/Inventory.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { 
  getProducts, 
  getCategories, 
  getSuppliers,
  createProduct,
  updateProduct,
  deleteProduct
} from "../../api"; 
import AdminNav from "../../components/adminnav";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

// API endpoints
// const api = {
//   getProducts:   () => axios.get(`${API_BASE}/inventory/products/`),
//   getProduct:    (id) => axios.get(`${API_BASE}/inventory/products/${id}/`),
//   createProduct: (data) => axios.post(`${API_BASE}/inventory/products/`, data, { 
//     headers: { "Content-Type": "multipart/form-data" } 
//   }),
//   updateProduct: (id, data) => axios.put(`${API_BASE}/inventory/products/${id}/`, data, { 
//     headers: { "Content-Type": "multipart/form-data" } 
//   }),
//   deleteProduct: (id) => axios.delete(`${API_BASE}/inventory/products/${id}/`),
//   getCategories: () => axios.get(`${API_BASE}/inventory/categories/`),
//   getSuppliers:  () => axios.get(`${API_BASE}/inventory/suppliers/`),
// };

// Empty product template with discount fields (matches backend model)
const EMPTY_PRODUCT = {
  name: "",
  category: "",
  supplier: "",
  description: "",
  price: "",
  stock: "",
  expiry_date: "",
  image: null,
  discount_percent: "",
  discount_expiry: ""
};

/* ── Timezone Helper Functions ── */

// Get local timezone offset string
const getTimezoneOffset = () => {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const minutes = Math.abs(offset % 60);
  const sign = offset <= 0 ? '+' : '-';
  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Convert local datetime to UTC for API storage (matches backend expectation)
const toUTCString = (localDateTimeString) => {
  if (!localDateTimeString) return '';
  const localDate = new Date(localDateTimeString);
  return localDate.toISOString();
};

// Convert UTC datetime from API to local for display/edit
const toLocalDateTimeString = (utcDateTimeString) => {
  if (!utcDateTimeString) return '';
  const utcDate = new Date(utcDateTimeString);
  const year = utcDate.getFullYear();
  const month = String(utcDate.getMonth() + 1).padStart(2, '0');
  const day = String(utcDate.getDate()).padStart(2, '0');
  const hours = String(utcDate.getHours()).padStart(2, '0');
  const minutes = String(utcDate.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Format UTC datetime for display in local timezone
const formatLocalDateTime = (utcDateTimeString) => {
  if (!utcDateTimeString) return '—';
  const date = new Date(utcDateTimeString);
  return date.toLocaleString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/* ── Toast Notification Component ── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "✓" },
    error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", icon: "✕" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "⚠" }
  };

  const s = styles[type] || styles.success;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-up">
      <div className={`${s.bg} ${s.border} border ${s.text} p-4 rounded-lg shadow-xl flex items-center gap-3`}>
        <span className="text-lg font-medium">{s.icon}</span>
        <p className="text-sm flex-1 font-light">{message}</p>
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">✕</button>
      </div>
    </div>
  );
}

/* ── Confirmation Dialog ── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#f0e7db] p-8 max-w-md w-full shadow-2xl animate-fade-in">
        <div className="font-serif text-2xl font-light text-[#2c2c2c] mb-3">Confirm Action</div>
        <p className="text-sm text-[#6b6b6b] font-light mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 text-white text-xs tracking-wider hover:bg-red-700 transition-colors"
          >
            DELETE
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-[#e0d5c8] text-[#6b6b6b] text-xs tracking-wider hover:border-[#b89b7b] hover:text-[#b89b7b] transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Image Upload Component ── */
function ImageUpload({ file, preview, onChange }) {
  const fileInputRef = useRef();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    onChange(f, URL.createObjectURL(f));
  };

  return (
    <div>
      <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">PRODUCT IMAGE</label>
      <div
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
        className={`border-2 border-dashed rounded-lg cursor-pointer transition-all ${
          isDragging ? "border-[#b89b7b] bg-[#fdf8f2]" : 
          preview ? "border-[#c9a882] bg-[#fefcfa]" : "border-[#e0d5c8] hover:border-[#b89b7b]"
        }`}
      >
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="preview" className="w-full max-h-48 object-contain p-4" />
            <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs tracking-wider text-[#b89b7b]">CHANGE IMAGE</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <div className="text-3xl opacity-30 mb-2">↑</div>
            <div className="text-sm text-[#b89b7b] font-light mb-1">Click or drag & drop</div>
            <div className="text-xs text-[#c4b8a8] font-light">PNG · JPG · WEBP</div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      </div>
      {preview && (
        <button
          onClick={(e) => { e.stopPropagation(); onChange(null, null); }}
          className="mt-2 text-xs text-red-600 hover:text-red-700 font-light"
        >
          ✕ Remove image
        </button>
      )}
    </div>
  );
}

/* ── Product Modal (Add/Edit) with Discount Fields ── */
function ProductModal({ product, categories, suppliers, onClose, onSaved }) {
  const isEdit = !!product?.id;
  
  // Convert UTC expiry from API to local for display
  const getInitialExpiry = () => {
    if (isEdit && product.discount_expiry) {
      return toLocalDateTimeString(product.discount_expiry);
    }
    return "";
  };
  
  const [form, setForm] = useState(isEdit ? {
    name: product.name || "",
    category: product.category || "",
    supplier: product.supplier || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || "",
    expiry_date: product.expiry_date || "",
    image: null,
    discount_percent: product.discount_percent || "",
    discount_expiry: getInitialExpiry()
  } : { ...EMPTY_PRODUCT });
  
  const [preview, setPreview] = useState(
    isEdit && product.image 
      ? (product.image.startsWith("http") ? product.image : `${API_BASE.replace("/api", "")}${product.image}`) 
      : null
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Product name is required";
    if (!form.category) e.category = "Category is required";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = "Valid price is required";
    if (form.stock === "" || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "Stock quantity is required";
    if (form.discount_percent && (form.discount_percent < 0 || form.discount_percent > 100)) {
      e.discount_percent = "Discount must be between 0 and 100";
    }
    return e;
  };

  // Inside Inventory.jsx, find the ProductModal component and update handleSubmit:

const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length) {
    setErrors(e);
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "image") {
        if (value) formData.append("image", value);
      } else if (key === "discount_expiry" && value) {
        formData.append(key, toUTCString(value));
      } else if (value !== "" && value != null) {
        formData.append(key, value);
      }
    });

    // ✅ CHANGE THIS: Use the imported functions directly
    if (isEdit) {
      await updateProduct(product.id, formData);  // Changed from api.updateProduct
      onSaved("Product updated successfully", "success");
    } else {
      await createProduct(formData);  // Changed from api.createProduct
      onSaved("Product added successfully", "success");
    }
    onClose();
  } catch (error) {
    console.error("Submit error:", error);
    const msg = error?.response?.data 
      ? Object.values(error.response.data).flat().join(" ").slice(0, 150) 
      : error.message || "Operation failed. Please try again.";
    onSaved(msg, "error");
  } finally {
    setLoading(false);
  }
};

  const inputClass = (field) => `
    w-full px-4 py-3 border rounded-lg bg-[#faf7f2] text-[#2c2c2c] 
    focus:outline-none focus:border-[#b89b7b] transition-colors
    ${errors[field] ? 'border-red-400' : 'border-[#e8ddd3]'}
  `;

  // Calculate discounted price preview (matches backend calculation)
  const discountedPrice = form.price && form.discount_percent && form.discount_percent > 0 && form.discount_expiry
    ? (Number(form.price) * (1 - Number(form.discount_percent) / 100)).toFixed(2)
    : null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#f0e7db] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#f0e7db] p-6 flex justify-between items-center">
          <div>
            <div className="text-xs tracking-wider text-[#b89b7b] font-light mb-1">
              {isEdit ? "EDIT PRODUCT" : "NEW PRODUCT"}
            </div>
            <h2 className="font-serif text-2xl font-light text-[#2c2c2c]">
              {isEdit ? form.name || "Edit Product" : "Add to Inventory"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-[#f0e7db] hover:border-[#2c2c2c] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="col-span-2">
              <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">PRODUCT NAME *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass("name")}
                placeholder="e.g., Osteocare Original"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">CATEGORY *</label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={inputClass("category")}
              >
                <option value="">Select category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">SUPPLIER</label>
              <select
                value={form.supplier}
                onChange={(e) => handleChange("supplier", e.target.value)}
                className="w-full px-4 py-3 border border-[#e8ddd3] rounded-lg bg-[#faf7f2] focus:outline-none focus:border-[#b89b7b] transition-colors"
              >
                <option value="">Select supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">REGULAR PRICE (KSh) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className={inputClass("price")}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">STOCK QUANTITY *</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className={inputClass("stock")}
                placeholder="0"
              />
              {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
            </div>

            {/* Discount Percent */}
            <div>
              <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">DISCOUNT (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={form.discount_percent}
                onChange={(e) => handleChange("discount_percent", e.target.value)}
                className="w-full px-4 py-3 border border-[#e8ddd3] rounded-lg bg-[#faf7f2] focus:outline-none focus:border-[#b89b7b] transition-colors"
                placeholder="0"
              />
              {errors.discount_percent && <p className="mt-1 text-xs text-red-600">{errors.discount_percent}</p>}
            </div>

            {/* Discount Expiry - datetime-local with timezone info */}
            <div>
              <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">DISCOUNT EXPIRY DATE & TIME ({getTimezoneOffset()})</label>
              <input
                type="datetime-local"
                value={form.discount_expiry}
                onChange={(e) => handleChange("discount_expiry", e.target.value)}
                className="w-full px-4 py-3 border border-[#e8ddd3] rounded-lg bg-[#faf7f2] focus:outline-none focus:border-[#b89b7b] transition-colors"
              />
              {form.discount_percent && form.discount_percent > 0 && form.discount_expiry && discountedPrice && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-green-600">
                    💰 Discounted price: KES {discountedPrice}
                  </p>
                  <p className="text-xs text-orange-600">
                    ⏰ Discount will expire on {new Date(form.discount_expiry).toLocaleString()}
                  </p>
                </div>
              )}
              {form.discount_percent && form.discount_percent > 0 && !form.discount_expiry && (
                <p className="mt-1 text-xs text-red-600">
                  ⚠️ Expiry date is required when discount percent is greater than 0 (backend validation)
                </p>
              )}
            </div>

            {/* Product Expiry Date */}
            <div className="col-span-2">
              <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">PRODUCT EXPIRY DATE</label>
              <input
                type="date"
                value={form.expiry_date}
                onChange={(e) => handleChange("expiry_date", e.target.value)}
                className="w-full px-4 py-3 border border-[#e8ddd3] rounded-lg bg-[#faf7f2] focus:outline-none focus:border-[#b89b7b] transition-colors"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-xs tracking-wide text-[#6b6b6b] mb-2">DESCRIPTION</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-[#e8ddd3] rounded-lg bg-[#faf7f2] focus:outline-none focus:border-[#b89b7b] transition-colors resize-none"
                placeholder="Product description, benefits, usage instructions..."
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-2">
              <ImageUpload
                file={form.image}
                preview={preview}
                onChange={(file, url) => {
                  handleChange("image", file);
                  setPreview(url);
                }}
              />
            </div>

            {isEdit && product.image && !form.image && (
              <div className="col-span-2 text-xs text-[#b89b7b] bg-[#fdf8f2] p-3 rounded-lg border border-[#f0e7db]">
                ℹ Existing image will be kept unless you upload a new one.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-[#f0e7db]">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 py-4 text-sm tracking-wider transition-colors ${
                loading 
                  ? 'bg-[#e8ddd3] text-[#b0a090] cursor-not-allowed' 
                  : 'bg-[#2c2c2c] text-white hover:bg-[#b89b7b]'
              }`}
            >
              {loading ? 'PROCESSING...' : isEdit ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 border border-[#e0d5c8] text-[#6b6b6b] text-sm tracking-wider hover:border-[#b89b7b] hover:text-[#b89b7b] transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Inventory Component ── */
export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

// Update current time every second for real-time discount expiration
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);
  return () => clearInterval(interval);
}, []);

// Auto-refresh products when discounts expire to update UI
useEffect(() => {
  // Check if any product's discount has expired but still shows as active
  const hasExpiredDiscounts = products.some(product => {
    const discountPercent = Number(product.discount_percent) || 0;
    const discountExpiry = product.discount_expiry;
    
    if (discountPercent <= 0 || !discountExpiry) return false;
    
    const expiryDate = new Date(discountExpiry);
    return expiryDate <= currentTime;
  });
  
  // If discounts expired, refresh data to get updated product info from backend
  if (hasExpiredDiscounts) {
    fetchData();
  }
}, [currentTime, products.length]); // Re-check when time changes or products array length changes

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Fetch all data from API
  // pages/admin/Inventory.jsx - Fix the fetchData function
// pages/admin/Inventory.jsx - Update fetchData function

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    // Use the imported functions directly
    const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
      getProducts(),      // Changed from api.getProducts()
      getCategories(),    // Changed from api.getCategories()
      getSuppliers()      // Changed from api.getSuppliers()
    ]);
    
    // Extract products from paginated response
    let productsData = [];
    if (Array.isArray(productsRes.data)) {
      productsData = productsRes.data;
    } else if (productsRes.data?.results && Array.isArray(productsRes.data.results)) {
      productsData = productsRes.data.results;
    } else if (productsRes.data?.data && Array.isArray(productsRes.data.data)) {
      productsData = productsRes.data.data;
    } else {
      console.warn('Unexpected products response format:', productsRes.data);
      productsData = [];
    }
    
    // Extract categories from paginated response
    let categoriesData = [];
    if (Array.isArray(categoriesRes.data)) {
      categoriesData = categoriesRes.data;
    } else if (categoriesRes.data?.results && Array.isArray(categoriesRes.data.results)) {
      categoriesData = categoriesRes.data.results;
    } else if (categoriesRes.data?.data && Array.isArray(categoriesRes.data.data)) {
      categoriesData = categoriesRes.data.data;
    } else {
      console.warn('Unexpected categories response format:', categoriesRes.data);
      categoriesData = [];
    }
    
    // Extract suppliers from paginated response
    let suppliersData = [];
    if (Array.isArray(suppliersRes.data)) {
      suppliersData = suppliersRes.data;
    } else if (suppliersRes.data?.results && Array.isArray(suppliersRes.data.results)) {
      suppliersData = suppliersRes.data.results;
    } else if (suppliersRes.data?.data && Array.isArray(suppliersRes.data.data)) {
      suppliersData = suppliersRes.data.data;
    } else {
      console.warn('Unexpected suppliers response format:', suppliersRes.data);
      suppliersData = [];
    }
    
    setProducts(productsData);
    setCategories(categoriesData);
    setSuppliers(suppliersData);
    
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    setError("Failed to load inventory data. Please try again.");
    showToast("Failed to load inventory data", "error");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchData();
  }, []);

  // Handle delete
  // pages/admin/Inventory.jsx - Update handleDelete

const handleDelete = async (ids) => {
  try {
    await Promise.all(ids.map(id => deleteProduct(id)));  // Changed from api.deleteProduct
    setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    setSelectedProducts(new Set());
    showToast(`${ids.length} product${ids.length > 1 ? 's' : ''} deleted successfully`);
  } catch (error) {
    console.error("Delete error:", error);
    showToast("Failed to delete products", "error");
  }
  setConfirmDelete(null);
};
  // Toggle product selection
  const toggleSelect = (id) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (filteredProducts.length === 0) return;
    setSelectedProducts(prev => 
      prev.size === filteredProducts.length ? new Set() : new Set(filteredProducts.map(p => p.id))
    );
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Helper to check if discount is active based on current time (matches backend is_discount_active)
 // Helper to check if discount is active based on current time (matches backend is_discount_active)
const isDiscountActive = useCallback((product) => {
  const discountPercent = Number(product.discount_percent) || 0;
  const discountExpiry = product.discount_expiry;
  
  if (discountPercent <= 0) return false;
  if (!discountExpiry) return false;
  
  const expiryDate = new Date(discountExpiry);
  const now = new Date();
  
  // Check if expiry date is valid and still in the future
  return expiryDate > now;
}, [currentTime]);

  // Helper to get current price (matches backend current_price property)
  const getCurrentPrice = useCallback((product) => {
    const price = Number(product.price) || 0;
    const discountPercent = Number(product.discount_percent) || 0;
    
    if (isDiscountActive(product)) {
      return price * (1 - discountPercent / 100);
    }
    return price;
  }, [isDiscountActive]);

  // Helper to get active discount percent
  const getActiveDiscountPercent = useCallback((product) => {
    if (isDiscountActive(product)) {
      return Number(product.discount_percent) || 0;
    }
    return 0;
  }, [isDiscountActive]);

  // Format time remaining for discount
  const getTimeRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const diff = expiry - currentTime;
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(p => {
      const matchesCategory = selectedCategory === 'all' || String(p.category_detail?.id || p.category) === String(selectedCategory);
      const matchesSearch = !search || 
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.supplier_detail?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category_detail?.name?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      let valA, valB;
      
      switch(sortBy) {
        case 'name':
          valA = a.name || '';
          valB = b.name || '';
          break;
        case 'price':
          valA = getCurrentPrice(a);
          valB = getCurrentPrice(b);
          break;
        case 'stock':
          valA = Number(a.stock) || 0;
          valB = Number(b.stock) || 0;
          break;
        case 'category':
          valA = a.category_detail?.name || '';
          valB = b.category_detail?.name || '';
          break;
        default:
          valA = a.name || '';
          valB = b.name || '';
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate metrics (using discounted prices for total value)
  const totalValue = products.reduce((sum, p) => sum + (getCurrentPrice(p) * Number(p.stock || 0)), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const activeDiscountCount = products.filter(p => isDiscountActive(p)).length;

  // Stock status helper
  const getStockStatus = (stock) => {
    if (stock === 0) return { 
      label: "OUT", 
      color: "text-red-600", 
      bg: "bg-red-50", 
      border: "border-red-200",
      dot: "bg-red-600"
    };
    if (stock <= 10) return { 
      label: "LOW", 
      color: "text-amber-600", 
      bg: "bg-amber-50", 
      border: "border-amber-200",
      dot: "bg-amber-600"
    };
    return { 
      label: "OK", 
      color: "text-green-600", 
      bg: "bg-green-50", 
      border: "border-green-200",
      dot: "bg-green-600"
    };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Check expiry status
  const getExpiryStatus = (dateString) => {
    if (!dateString) return { status: 'none', text: '—', className: 'text-[#6b6b6b]' };
    
    const today = new Date();
    const expiry = new Date(dateString);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', text: 'Expired', className: 'text-red-600 font-medium' };
    } else if (daysUntilExpiry <= 90) {
      return { 
        status: 'near', 
        text: `${formatDate(dateString)} (${daysUntilExpiry} days)`,
        className: 'text-amber-600 font-medium' 
      };
    } else {
      return { 
        status: 'good', 
        text: formatDate(dateString),
        className: 'text-[#6b6b6b]' 
      };
    }
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE.replace('/api', '')}${imagePath}`;
  };

  return (
    <>
      <AdminNav />
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-red {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-pulse-red {
          animation: pulse-red 1s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-[#f5f2ee] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="text-xs tracking-wider text-[#b89b7b] font-light mb-2">
                INVENTORY MANAGEMENT
              </div>
              <h1 className="font-serif text-4xl font-light text-[#2c2c2c]">
                Products
              </h1>
              <p className="text-sm text-[#6b6b6b] font-light mt-2">
                {products.length} total products · {categories.length} categories · {suppliers.length} suppliers
                {activeDiscountCount > 0 && (
                  <span className="ml-2 text-green-600 font-medium">· {activeDiscountCount} on sale</span>
                )}
              </p>
            </div>
            <button
              onClick={() => setModalOpen({ mode: 'create' })}
              className="px-6 py-3 bg-[#2c2c2c] text-white text-sm tracking-wider hover:bg-[#b89b7b] transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
              ADD PRODUCT
            </button>
          </div>

          {/* Current Time Display */}
          <div className="bg-white border border-[#f0e7db] p-3 mb-6 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6b6b6b]">Current server time:</span>
              <span className="font-mono text-sm font-medium text-[#2c2c2c]">
                {currentTime.toLocaleString('en-GB', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-[#6b6b6b]">Live discount monitoring</span>
              </div>
              <div className="text-xs text-[#b89b7b] bg-[#faf7f2] px-2 py-1 rounded">
                {getTimezoneOffset()}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 border border-[#f0e7db] hover:shadow-lg transition-shadow">
              <div className="text-xs tracking-wider text-[#6b6b6b] font-light mb-2">TOTAL PRODUCTS</div>
              <div className="font-serif text-3xl text-[#2c2c2c] font-light">{products.length}</div>
              <div className="text-xs text-[#b89b7b] mt-2">
                {filteredProducts.length} shown
              </div>
            </div>
            
            <div className="bg-white p-6 border border-[#f0e7db] hover:shadow-lg transition-shadow">
              <div className="text-xs tracking-wider text-[#6b6b6b] font-light mb-2">INVENTORY VALUE</div>
              <div className="font-serif text-3xl text-[#2c2c2c] font-light">{formatCurrency(totalValue)}</div>
              <div className="text-xs text-[#b89b7b] mt-2">at current prices</div>
            </div>
            
            <div className="bg-white p-6 border border-[#f0e7db] hover:shadow-lg transition-shadow">
              <div className="text-xs tracking-wider text-[#6b6b6b] font-light mb-2">LOW STOCK</div>
              <div className={`font-serif text-3xl font-light ${lowStockCount > 0 ? 'text-amber-600' : 'text-[#2c2c2c]'}`}>
                {lowStockCount}
              </div>
              <div className="text-xs text-[#b89b7b] mt-2">10 units or fewer</div>
            </div>
            
            <div className="bg-white p-6 border border-[#f0e7db] hover:shadow-lg transition-shadow">
              <div className="text-xs tracking-wider text-[#6b6b6b] font-light mb-2">ON SALE</div>
              <div className={`font-serif text-3xl font-light ${activeDiscountCount > 0 ? 'text-green-600' : 'text-[#2c2c2c]'}`}>
                {activeDiscountCount}
              </div>
              <div className="text-xs text-[#b89b7b] mt-2">products with active discounts</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-4 border border-[#f0e7db] mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b89b7b]">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, brand, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#e8ddd3] focus:border-[#b89b7b] outline-none transition-colors"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-[#e8ddd3] focus:border-[#b89b7b] outline-none transition-colors bg-white min-w-[160px]"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2 border border-[#e8ddd3] focus:border-[#b89b7b] outline-none transition-colors bg-white min-w-[160px]"
              >
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="stock-asc">Stock ↑</option>
                <option value="stock-desc">Stock ↓</option>
                <option value="category-asc">Category A–Z</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.size > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 mb-6 flex items-center justify-between animate-fade-in">
              <span className="text-sm text-amber-800">
                {selectedProducts.size} product{selectedProducts.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete({ ids: [...selectedProducts] })}
                  className="px-4 py-2 bg-red-600 text-white text-xs tracking-wider hover:bg-red-700 transition-colors"
                >
                  DELETE SELECTED
                </button>
                <button
                  onClick={() => setSelectedProducts(new Set())}
                  className="px-4 py-2 border border-amber-300 text-amber-800 text-xs tracking-wider hover:border-amber-400 transition-colors"
                >
                  CLEAR
                </button>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white border border-[#f0e7db] overflow-hidden rounded-lg">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-[#f0e7db] border-t-[#b89b7b] rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4 opacity-30">📦</div>
                <h3 className="font-serif text-xl text-[#6b6b6b] mb-2">No products found</h3>
                <p className="text-sm text-[#b89b7b]">
                  {search || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Add your first product to get started'}
                </p>
                {!search && selectedCategory === 'all' && products.length === 0 && (
                  <button
                    onClick={() => setModalOpen({ mode: 'create' })}
                    className="mt-6 px-6 py-3 bg-[#2c2c2c] text-white text-sm tracking-wider hover:bg-[#b89b7b] transition-colors"
                  >
                    ADD FIRST PRODUCT
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#faf7f2] border-b border-[#f0e7db]">
                    <tr>
                      <th className="px-4 py-3 w-12">
                        <input
                          type="checkbox"
                          checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 accent-[#b89b7b] cursor-pointer"
                          disabled={filteredProducts.length === 0}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs tracking-wider text-[#6b6b6b] font-medium">
                        IMAGE
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs tracking-wider text-[#6b6b6b] font-medium cursor-pointer hover:text-[#b89b7b]"
                        onClick={() => handleSort('name')}
                      >
                        PRODUCT {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs tracking-wider text-[#6b6b6b] font-medium cursor-pointer hover:text-[#b89b7b]"
                        onClick={() => handleSort('category')}
                      >
                        CATEGORY {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs tracking-wider text-[#6b6b6b] font-medium cursor-pointer hover:text-[#b89b7b]"
                        onClick={() => handleSort('price')}
                      >
                        PRICE {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs tracking-wider text-[#6b6b6b] font-medium cursor-pointer hover:text-[#b89b7b]"
                        onClick={() => handleSort('stock')}
                      >
                        STOCK {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs tracking-wider text-[#6b6b6b] font-medium">
                        EXPIRY INFO
                      </th>
                      <th className="px-4 py-3 text-left text-xs tracking-wider text-[#6b6b6b] font-medium">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const status = getStockStatus(product.stock);
                      const expiry = getExpiryStatus(product.expiry_date);
                      const imageUrl = getImageUrl(product.image);
                      const currentPrice = getCurrentPrice(product);
                      const originalPrice = Number(product.price) || 0;
                      const discountPercent = getActiveDiscountPercent(product);
                      const isDiscounted = discountPercent > 0;
                      const discountExpiry = product.discount_expiry;
                      const savings = originalPrice - currentPrice;
                      const timeRemaining = discountExpiry ? getTimeRemaining(discountExpiry) : null;
                      
                      return (
                        <tr 
                          key={product.id} 
                          className={`border-b border-[#f0e7db] hover:bg-[#faf7f2] transition-colors ${
                            selectedProducts.has(product.id) ? 'bg-amber-50/50' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedProducts.has(product.id)}
                              onChange={() => toggleSelect(product.id)}
                              className="w-4 h-4 accent-[#b89b7b] cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded border border-[#f0e7db]"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<div class="w-10 h-10 bg-[#faf7f2] border border-[#f0e7db] flex items-center justify-center text-[#b89b7b]">📦</div>';
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 bg-[#faf7f2] border border-[#f0e7db] flex items-center justify-center text-[#b89b7b]">
                                📦
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-[#2c2c2c]">{product.name}</div>
                            <div className="text-xs text-[#b89b7b] font-light mt-1">
                              {product.supplier_detail?.name || '—'}
                            </div>
                            {isDiscounted && (
                              <div className="mt-1 flex flex-wrap items-center gap-1">
                                <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  🔥 {discountPercent}% OFF
                                </span>
                                {timeRemaining && (
                                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse-red">
                                    ⏰ {timeRemaining} left
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-[#faf7f2] border border-[#f0e7db] text-xs text-[#6b6b6b]">
                              {product.category_detail?.name || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {isDiscounted ? (
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-serif text-[#c9a87b] font-bold text-base">
                                    {formatCurrency(currentPrice)}
                                  </span>
                                  <span className="text-xs text-[#aaa] line-through">
                                    {formatCurrency(originalPrice)}
                                  </span>
                                </div>
                                <div className="text-xs text-green-600 font-medium mt-1">
                                  💰 Save {formatCurrency(savings)}
                                </div>
                              </div>
                            ) : (
                              <span className="font-serif text-[#2c2c2c]">
                                {formatCurrency(currentPrice)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
                              <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                              {product.stock} · {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              {product.expiry_date && (
                                <div className={`flex items-center gap-1 text-xs ${expiry.className}`}>
                                  <span>📅</span>
                                  <span>{expiry.text}</span>
                                </div>
                              )}
                              {isDiscounted && discountExpiry && (
                                <div className="flex items-center gap-1 text-xs text-orange-600">
                                  <span>⏰</span>
                                  <span>Ends: {formatLocalDateTime(discountExpiry)}</span>
                                </div>
                              )}
                              {!product.expiry_date && !isDiscounted && (
                                <span className="text-xs text-[#aaa]">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setModalOpen({ mode: 'edit', product })}
                                className="p-1 border border-[#e8ddd3] rounded hover:border-[#b89b7b] hover:text-[#b89b7b] transition-colors"
                                title="Edit product"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ ids: [product.id] })}
                                className="p-1 border border-[#e8ddd3] rounded hover:border-red-400 hover:text-red-600 transition-colors"
                                title="Delete product"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          {!loading && filteredProducts.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-xs text-[#6b6b6b]">
              <span>
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <span className="text-[#b89b7b]">
                Total value: {formatCurrency(totalValue)}
              </span>
            </div>
          )}
        </div>

        {/* Modals */}
        {modalOpen && (
          <ProductModal
            product={modalOpen.mode === 'edit' ? modalOpen.product : null}
            categories={categories}
            suppliers={suppliers}
            onClose={() => setModalOpen(null)}
            onSaved={(msg, type) => {
              showToast(msg, type);
              fetchData();
            }}
          />
        )}

        {confirmDelete && (
          <ConfirmDialog
            message={`Permanently delete ${confirmDelete.ids.length} product${confirmDelete.ids.length > 1 ? 's' : ''}? This action cannot be undone.`}
            onConfirm={() => handleDelete(confirmDelete.ids)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
}