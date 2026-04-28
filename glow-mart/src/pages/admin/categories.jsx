// pages/admin/Categories.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import AdminNav from "../../components/adminnav";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

// Helper to extract data from paginated response
const extractDataFromResponse = (response) => {
  if (!response || !response.data) return [];
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data.results && Array.isArray(data.results)) return data.results;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.categories && Array.isArray(data.categories)) return data.categories;
  console.warn('Unexpected categories response format:', data);
  return [];
};

// API endpoints
const api = {
  getCategories: () => axios.get(`${API_BASE}/inventory/categories/`),
  getCategory: (id) => axios.get(`${API_BASE}/inventory/categories/${id}/`),
  createCategory: (data) => axios.post(`${API_BASE}/inventory/categories/`, data),
  updateCategory: (id, data) => axios.put(`${API_BASE}/inventory/categories/${id}/`, data),
  deleteCategory: (id) => axios.delete(`${API_BASE}/inventory/categories/${id}/`),
};

// Empty category template
const EMPTY_CATEGORY = {
  name: "",
  description: "",
  icon: "",
  status: "active",
};

/* ── Toast Notification ── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-600",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`${styles[type]} border px-6 py-4 rounded-lg shadow-xl flex items-center gap-3`}>
        <span className="text-lg">{icons[type]}</span>
        <p className="text-sm">{message}</p>
        <button onClick={onClose} className="opacity-60 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}

/* ── Confirmation Dialog ── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#f0e7db] p-6 max-w-md w-full shadow-2xl">
        <h3 className="font-serif text-xl font-light text-[#2c2c2c] mb-3">Confirm Delete</h3>
        <p className="text-sm text-[#6b6b6b] mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">
            DELETE
          </button>
          <button onClick={onCancel} className="flex-1 py-2 border border-[#e0d5c8] text-[#6b6b6b] text-sm hover:border-[#b89b7b] transition-colors">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Category Modal ── */
function CategoryModal({ category, onClose, onSaved }) {
  const isEdit = !!category?.id;
  const [form, setForm] = useState(isEdit ? {
    name: category.name || "",
    description: category.description || "",
    icon: category.icon || "",
    status: category.status || "active",
  } : { ...EMPTY_CATEGORY });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Category name is required";
    if (form.name?.length > 100) e.name = "Category name must be less than 100 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.updateCategory(category.id, form);
        onSaved("Category updated successfully", "success");
      } else {
        await api.createCategory(form);
        onSaved("Category created successfully", "success");
      }
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.name?.[0] || "Operation failed";
      onSaved(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Common icons for categories
  const iconOptions = [
    { value: "📦", label: "Box" },
    { value: "💊", label: "Medicine" },
    { value: "💄", label: "Cosmetics" },
    { value: "🧴", label: "Skincare" },
    { value: "💇", label: "Hair Care" },
    { value: "🦷", label: "Dental" },
    { value: "👶", label: "Baby" },
    { value: "🏃", label: "Fitness" },
    { value: "🍎", label: "Nutrition" },
    { value: "💪", label: "Supplements" },
    { value: "🧪", label: "Vitamins" },
    { value: "🌸", label: "Herbal" },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#f0e7db] w-full max-w-md shadow-2xl rounded-lg">
        <div className="p-6 border-b border-[#f0e7db] flex justify-between items-center">
          <h2 className="font-serif text-xl font-light text-[#2c2c2c]">
            {isEdit ? "Edit Category" : "New Category"}
          </h2>
          <button onClick={onClose} className="text-[#6b6b6b] hover:text-[#2c2c2c] transition-colors">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">CATEGORY NAME *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-400' : 'border-[#e8ddd3]'} bg-[#faf7f2] focus:border-[#b89b7b] outline-none transition-colors`}
              placeholder="e.g., Bone Health"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">ICON</label>
            <select
              value={form.icon}
              onChange={(e) => handleChange("icon", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none transition-colors"
            >
              <option value="">Select an icon</option>
              {iconOptions.map(icon => (
                <option key={icon.value} value={icon.value}>
                  {icon.value} - {icon.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">DESCRIPTION</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none resize-none transition-colors"
              placeholder="Brief description of this category..."
            />
          </div>

          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">STATUS</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none transition-colors"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="p-6 border-t border-[#f0e7db] flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-2 ${loading ? 'bg-[#e8ddd3] cursor-not-allowed' : 'bg-[#2c2c2c] hover:bg-[#b89b7b]'} text-white text-sm transition-colors`}
          >
            {loading ? 'SAVING...' : isEdit ? 'UPDATE' : 'CREATE'}
          </button>
          <button onClick={onClose} className="flex-1 py-2 border border-[#e0d5c8] text-[#6b6b6b] text-sm hover:border-[#b89b7b] transition-colors">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const itemsPerPage = 20;

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      // Use the helper to extract data properly
      const categoriesData = extractDataFromResponse(res);
      
      // Handle paginated response
      let cats = categoriesData;
      let total = cats.length;
      
      // If response has count and results (paginated)
      if (res.data?.count !== undefined) {
        total = res.data.count;
        setTotalPages(Math.ceil(total / itemsPerPage));
      }
      
      setCategories(cats);
      setTotalCategories(total);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Failed to load categories", "error");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast("Category deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete category";
      showToast(errorMsg, "error");
    }
    setConfirmDelete(null);
  };

  // Calculate category stats - safely handle empty array
  const getCategoryStats = () => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return {
        totalProducts: 0,
        avgProductsPerCategory: 0,
        activeCategories: 0,
        inactiveCategories: 0,
      };
    }
    
    const totalProducts = categories.reduce((sum, cat) => sum + (cat.product_count || 0), 0);
    const activeCategories = categories.filter(cat => cat.status !== "inactive").length;
    const inactiveCategories = categories.filter(cat => cat.status === "inactive").length;
    
    return {
      totalProducts,
      avgProductsPerCategory: categories.length ? Math.round(totalProducts / categories.length) : 0,
      activeCategories,
      inactiveCategories,
    };
  };

  const stats = getCategoryStats();
  
  // Safely filter categories
  const filteredCategories = Array.isArray(categories) ? categories.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  // Paginate filtered results
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const displayTotalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Category color mapping for visual appeal
  const getCategoryColor = (index) => {
    const colors = [
      "bg-amber-50 border-amber-200",
      "bg-emerald-50 border-emerald-200",
      "bg-blue-50 border-blue-200",
      "bg-purple-50 border-purple-200",
      "bg-rose-50 border-rose-200",
      "bg-teal-50 border-teal-200",
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <AdminNav />
      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>

      <div className="min-h-screen bg-[#f5f2ee] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="text-xs text-[#b89b7b] mb-2 uppercase tracking-wide">CATALOG MANAGEMENT</div>
              <h1 className="font-serif text-3xl font-light text-[#2c2c2c]">Categories</h1>
              <p className="text-sm text-[#6b6b6b] mt-1">
                {totalCategories} total categories · {stats.activeCategories} active · {stats.inactiveCategories} inactive
              </p>
            </div>
            <button
              onClick={() => setModalOpen({ mode: 'create' })}
              className="px-4 py-2 bg-[#2c2c2c] text-white text-sm hover:bg-[#b89b7b] transition-colors flex items-center gap-2 rounded-lg"
            >
              <span className="text-lg">+</span> NEW CATEGORY
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 border border-[#f0e7db] rounded-lg hover:shadow-md transition-shadow">
              <div className="text-xs text-[#6b6b6b] mb-1 uppercase tracking-wide">TOTAL CATEGORIES</div>
              <div className="font-serif text-2xl text-[#2c2c2c]">{totalCategories}</div>
              <div className="text-xs text-[#b89b7b] mt-2">Organize your products</div>
            </div>
            <div className="bg-white p-5 border border-[#f0e7db] rounded-lg hover:shadow-md transition-shadow">
              <div className="text-xs text-[#6b6b6b] mb-1 uppercase tracking-wide">TOTAL PRODUCTS</div>
              <div className="font-serif text-2xl text-[#2c2c2c]">{stats.totalProducts}</div>
              <div className="text-xs text-[#b89b7b] mt-2">Across all categories</div>
            </div>
            <div className="bg-white p-5 border border-[#f0e7db] rounded-lg hover:shadow-md transition-shadow">
              <div className="text-xs text-[#6b6b6b] mb-1 uppercase tracking-wide">AVG PER CATEGORY</div>
              <div className="font-serif text-2xl text-[#2c2c2c]">{stats.avgProductsPerCategory}</div>
              <div className="text-xs text-[#b89b7b] mt-2">Products per category</div>
            </div>
            <div className="bg-white p-5 border border-[#f0e7db] rounded-lg hover:shadow-md transition-shadow">
              <div className="text-xs text-[#6b6b6b] mb-1 uppercase tracking-wide">ACTIVE CATEGORIES</div>
              <div className="font-serif text-2xl text-green-600">{stats.activeCategories}</div>
              <div className="text-xs text-[#b89b7b] mt-2">Currently active</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 border border-[#f0e7db] mb-6 rounded-lg">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b89b7b]">🔍</span>
              <input
                type="text"
                placeholder="Search categories by name or description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-[#e8ddd3] focus:border-[#b89b7b] outline-none rounded-lg transition-colors"
              />
            </div>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-[#f0e7db]">
              <div className="w-8 h-8 border-2 border-[#f0e7db] border-t-[#b89b7b] rounded-full animate-spin"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-[#f0e7db]">
              <div className="text-6xl mb-4 opacity-30">📑</div>
              <p className="text-[#6b6b6b]">No categories found</p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-sm text-[#b89b7b] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedCategories.map((cat, index) => (
                  <div
                    key={cat.id}
                    className={`bg-white rounded-xl border p-5 hover:shadow-lg transition-all duration-300 ${getCategoryColor(index)} animate-fade-in`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{cat.icon || "📦"}</div>
                        <div>
                          <h3 className="font-medium text-[#2c2c2c] text-lg">{cat.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-[#6b6b6b]">
                              {cat.product_count || 0} products
                            </span>
                            {cat.status === "inactive" && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setModalOpen({ mode: 'edit', category: cat })}
                          className="p-2 text-[#6b6b6b] hover:text-[#b89b7b] hover:bg-white/50 rounded-lg transition-all"
                          title="Edit category"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => setConfirmDelete(cat.id)}
                          className="p-2 text-[#6b6b6b] hover:text-red-600 hover:bg-white/50 rounded-lg transition-all"
                          title="Delete category"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                    {cat.description && (
                      <p className="text-sm text-[#6b6b6b] mt-3 line-clamp-2">{cat.description}</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-[#f0e7db]/50">
                      <button
                        onClick={() => window.location.href = `/admin/inventory?category=${cat.id}`}
                        className="text-xs text-[#b89b7b] hover:text-[#9b7a5a] transition-colors flex items-center gap-1"
                      >
                        View products →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {displayTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-[#e8ddd3] rounded-lg text-[#6b6b6b] disabled:opacity-50 hover:border-[#b89b7b] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[#6b6b6b]">
                    Page {currentPage} of {displayTotalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(displayTotalPages, prev + 1))}
                    disabled={currentPage === displayTotalPages}
                    className="px-3 py-1 border border-[#e8ddd3] rounded-lg text-[#6b6b6b] disabled:opacity-50 hover:border-[#b89b7b] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        {modalOpen && (
          <CategoryModal
            category={modalOpen.mode === 'edit' ? modalOpen.category : null}
            onClose={() => setModalOpen(null)}
            onSaved={(msg, type) => {
              showToast(msg, type);
              fetchCategories();
            }}
          />
        )}

        {confirmDelete && (
          <ConfirmDialog
            message="Are you sure you want to delete this category? This may affect products associated with it."
            onConfirm={() => handleDelete(confirmDelete)}
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