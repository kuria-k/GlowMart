// pages/admin/Suppliers.jsx
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
  if (data.suppliers && Array.isArray(data.suppliers)) return data.suppliers;
  console.warn('Unexpected suppliers response format:', data);
  return [];
};

// API endpoints
const api = {
  getSuppliers: () => axios.get(`${API_BASE}/inventory/suppliers/`),
  getSupplier: (id) => axios.get(`${API_BASE}/inventory/suppliers/${id}/`),
  createSupplier: (data) => axios.post(`${API_BASE}/inventory/suppliers/`, data),
  updateSupplier: (id, data) => axios.put(`${API_BASE}/inventory/suppliers/${id}/`, data),
  deleteSupplier: (id) => axios.delete(`${API_BASE}/inventory/suppliers/${id}/`),
};

// Empty supplier template
const EMPTY_SUPPLIER = {
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
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
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`${styles[type]} border px-6 py-4 rounded-lg shadow-xl flex items-center gap-3`}>
        <span className="text-lg">{type === "success" ? "✓" : "✕"}</span>
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
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 text-white text-sm hover:bg-red-700">DELETE</button>
          <button onClick={onCancel} className="flex-1 py-2 border border-[#e0d5c8] text-[#6b6b6b] text-sm hover:border-[#b89b7b]">CANCEL</button>
        </div>
      </div>
    </div>
  );
}

/* ── Supplier Modal ── */
function SupplierModal({ supplier, onClose, onSaved }) {
  const isEdit = !!supplier?.id;
  const [form, setForm] = useState(isEdit ? {
    name: supplier.name || "",
    contact_person: supplier.contact_person || "",
    email: supplier.email || "",
    phone: supplier.phone || "",
    address: supplier.address || "",
    notes: supplier.notes || "",
  } : { ...EMPTY_SUPPLIER });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Supplier name is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";
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
        await api.updateSupplier(supplier.id, form);
        onSaved("Supplier updated successfully", "success");
      } else {
        await api.createSupplier(form);
        onSaved("Supplier created successfully", "success");
      }
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      onSaved(error.response?.data?.message || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#f0e7db] w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-[#f0e7db] flex justify-between items-center">
          <h2 className="font-serif text-xl font-light text-[#2c2c2c]">
            {isEdit ? "Edit Supplier" : "New Supplier"}
          </h2>
          <button onClick={onClose} className="text-[#6b6b6b] hover:text-[#2c2c2c]">✕</button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">SUPPLIER NAME *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-400' : 'border-[#e8ddd3]'} bg-[#faf7f2] focus:border-[#b89b7b] outline-none`}
              placeholder="e.g., Vitabiotics"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">CONTACT PERSON</label>
            <input
              type="text"
              value={form.contact_person}
              onChange={(e) => handleChange("contact_person", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none"
              placeholder="e.g., John Smith"
            />
          </div>
          
          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">EMAIL</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-400' : 'border-[#e8ddd3]'} bg-[#faf7f2] focus:border-[#b89b7b] outline-none`}
              placeholder="contact@supplier.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">PHONE</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none"
              placeholder="+254 700 000000"
            />
          </div>
          
          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">ADDRESS</label>
            <textarea
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none resize-none"
              placeholder="Physical address"
            />
          </div>
          
          <div>
            <label className="block text-xs text-[#6b6b6b] mb-1">NOTES</label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-[#e8ddd3] bg-[#faf7f2] focus:border-[#b89b7b] outline-none resize-none"
              placeholder="Additional notes..."
            />
          </div>
        </div>
        <div className="p-6 border-t border-[#f0e7db] flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-2 ${loading ? 'bg-[#e8ddd3]' : 'bg-[#2c2c2c] hover:bg-[#b89b7b]'} text-white text-sm transition-colors`}
          >
            {loading ? 'SAVING...' : isEdit ? 'UPDATE' : 'CREATE'}
          </button>
          <button onClick={onClose} className="flex-1 py-2 border border-[#e0d5c8] text-[#6b6b6b] text-sm hover:border-[#b89b7b]">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.getSuppliers();
      // Use the helper to extract data properly
      const suppliersData = extractDataFromResponse(res);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      showToast("Failed to load suppliers", "error");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      showToast("Supplier deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete supplier", "error");
    }
    setConfirmDelete(null);
  };

  // Calculate supplier stats - safely handle empty array
  const getSupplierStats = () => {
    // Ensure suppliers is an array before using reduce
    if (!Array.isArray(suppliers) || suppliers.length === 0) {
      return {
        totalProducts: 0,
        totalValue: 0,
        avgProductsPerSupplier: 0,
      };
    }
    
    const totalProducts = suppliers.reduce((sum, s) => sum + (s.product_count || 0), 0);
    const totalValue = suppliers.reduce((sum, s) => sum + (s.total_value || 0), 0);
    
    return {
      totalProducts,
      totalValue,
      avgProductsPerSupplier: suppliers.length ? Math.round(totalProducts / suppliers.length) : 0,
    };
  };

  const stats = getSupplierStats();
  
  // Safely filter suppliers
  const filteredSuppliers = Array.isArray(suppliers) ? suppliers.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_person?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <>
      <AdminNav />
      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>

      <div className="min-h-screen bg-[#f5f2ee] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="text-xs text-[#b89b7b] mb-2">SUPPLIER MANAGEMENT</div>
              <h1 className="font-serif text-3xl font-light text-[#2c2c2c]">Suppliers</h1>
              <p className="text-sm text-[#6b6b6b] mt-1">{Array.isArray(suppliers) ? suppliers.length : 0} total suppliers</p>
            </div>
            <button
              onClick={() => setModalOpen({ mode: 'create' })}
              className="px-4 py-2 bg-[#2c2c2c] text-white text-sm hover:bg-[#b89b7b] transition-colors flex items-center gap-2"
            >
              <span>+</span> NEW SUPPLIER
            </button>
          </div>

          {/* Stats Cards - Track supplier contributions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 border border-[#f0e7db]">
              <div className="text-xs text-[#6b6b6b] mb-1">TOTAL SUPPLIERS</div>
              <div className="font-serif text-2xl text-[#2c2c2c]">{Array.isArray(suppliers) ? suppliers.length : 0}</div>
            </div>
            <div className="bg-white p-5 border border-[#f0e7db]">
              <div className="text-xs text-[#6b6b6b] mb-1">PRODUCTS SUPPLIED</div>
              <div className="font-serif text-2xl text-[#2c2c2c]">{stats.totalProducts}</div>
            </div>
            <div className="bg-white p-5 border border-[#f0e7db]">
              <div className="text-xs text-[#6b6b6b] mb-1">TOTAL VALUE</div>
              <div className="font-serif text-2xl text-[#2c2c2c]">KSh {stats.totalValue.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 border border-[#f0e7db]">
              <div className="text-xs text-[#6b6b6b] mb-1">AVG PER SUPPLIER</div>
              <div className="font-serif text-2xl text-[#2c2c2c]">{stats.avgProductsPerSupplier} products</div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-4 border border-[#f0e7db] mb-6">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-[#e8ddd3] focus:border-[#b89b7b] outline-none"
            />
          </div>

          {/* Suppliers List */}
          <div className="bg-white border border-[#f0e7db]">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="w-6 h-6 border-2 border-[#f0e7db] border-t-[#b89b7b] rounded-full animate-spin"></div>
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 opacity-30">🏢</div>
                <p className="text-[#6b6b6b]">No suppliers found</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f0e7db]">
                {filteredSuppliers.map((sup) => (
                  <div key={sup.id} className="p-4 hover:bg-[#faf7f2]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-[#2c2c2c]">{sup.name}</span>
                          <span className="text-xs bg-[#f0e7db] px-2 py-0.5 text-[#6b6b6b]">
                            {sup.product_count || 0} products
                          </span>
                          {sup.total_value && (
                            <span className="text-xs bg-[#b89b7b]/10 text-[#b89b7b] px-2 py-0.5">
                              KSh {sup.total_value.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {sup.contact_person && (
                            <div>
                              <span className="text-xs text-[#6b6b6b]">Contact:</span>
                              <p className="text-[#2c2c2c]">{sup.contact_person}</p>
                            </div>
                          )}
                          {sup.email && (
                            <div>
                              <span className="text-xs text-[#6b6b6b]">Email:</span>
                              <p className="text-[#2c2c2c]">{sup.email}</p>
                            </div>
                          )}
                          {sup.phone && (
                            <div>
                              <span className="text-xs text-[#6b6b6b]">Phone:</span>
                              <p className="text-[#2c2c2c]">{sup.phone}</p>
                            </div>
                          )}
                          {sup.address && (
                            <div>
                              <span className="text-xs text-[#6b6b6b]">Address:</span>
                              <p className="text-[#2c2c2c]">{sup.address}</p>
                            </div>
                          )}
                        </div>
                        
                        {sup.notes && (
                          <p className="text-sm text-[#6b6b6b] mt-2 italic">{sup.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setModalOpen({ mode: 'edit', supplier: sup })}
                          className="p-1 text-[#6b6b6b] hover:text-[#b89b7b]"
                          title="Edit supplier"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => setConfirmDelete(sup.id)}
                          className="p-1 text-[#6b6b6b] hover:text-red-600"
                          title="Delete supplier"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer summary */}
          {!loading && filteredSuppliers.length > 0 && (
            <div className="mt-4 text-xs text-[#6b6b6b] text-right">
              Showing {filteredSuppliers.length} of {Array.isArray(suppliers) ? suppliers.length : 0} suppliers
            </div>
          )}
        </div>

        {/* Modals */}
        {modalOpen && (
          <SupplierModal
            supplier={modalOpen.mode === 'edit' ? modalOpen.supplier : null}
            onClose={() => setModalOpen(null)}
            onSaved={(msg, type) => {
              showToast(msg, type);
              fetchSuppliers();
            }}
          />
        )}

        {confirmDelete && (
          <ConfirmDialog
            message="Are you sure you want to delete this supplier? This may affect associated products."
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