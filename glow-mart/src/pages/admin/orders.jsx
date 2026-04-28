// pages/admin/Orders.jsx - Complete Working Version with Server-Side Pagination
import React, { useState, useEffect, useCallback } from 'react';
import AdminNav from "../../components/adminnav";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

// Helper to extract data from paginated response
const extractDataFromResponse = (response) => {
  if (!response || !response.data) return { data: [], count: 0, next: null, previous: null };
  const res = response.data;
  if (res.results && Array.isArray(res.results)) {
    return {
      data: res.results,
      count: res.count || 0,
      next: res.next,
      previous: res.previous
    };
  }
  if (Array.isArray(res)) {
    return { data: res, count: res.length, next: null, previous: null };
  }
  return { data: [], count: 0, next: null, previous: null };
};

// API calls with server-side pagination
const api = {
  getOrders: (page = 1, pageSize = 20, filters = {}) => {
    const params = {
      page: page,
      page_size: pageSize,
      ordering: '-created_at' // Order by most recent first
    };
    
    // Add filters if present
    if (filters.search) params.search = filters.search;
    if (filters.orderStatus && filters.orderStatus !== 'all') params.order_status = filters.orderStatus;
    if (filters.paymentStatus && filters.paymentStatus !== 'all') params.payment_status = filters.paymentStatus;
    
    return axios.get(`${API_BASE}/orders/`, { params });
  },
  getOrder: (id) => axios.get(`${API_BASE}/orders/${id}/`),
  updateOrder: (id, data) => axios.patch(`${API_BASE}/orders/${id}/`, data),
  deleteOrder: (id) => axios.delete(`${API_BASE}/orders/${id}/`),
};

// Order status configuration
const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'amber', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  processing: { label: 'Processing', color: 'blue', icon: Package, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  shipped: { label: 'Shipped', color: 'purple', icon: Truck, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  delivered: { label: 'Delivered', color: 'green', icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  canceled: { label: 'Canceled', color: 'red', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const PAYMENT_STATUSES = {
  pending: { label: 'Pending', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700' },
  payment_pending: { label: 'Payment Pending', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700' },
  payment_completed: { label: 'Paid', color: 'green', bg: 'bg-green-50', text: 'text-green-700' },
  payment_failed: { label: 'Failed', color: 'red', bg: 'bg-red-50', text: 'text-red-700' },
};

// Professional Invoice Generator
const generateInvoice = (order, formatCurrency) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPos = margin;
  
  const brandPrimary = [184, 155, 123];
  const darkText = [44, 44, 44];
  const mediumGray = [107, 107, 107];
  const lightCream = [250, 247, 242];
  
  // Header
  doc.setFillColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.rect(0, 0, pageWidth, 12, 'F');
  
  yPos = 25;
  
  // Logo
  doc.setFillColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.roundedRect(margin, yPos, 45, 45, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('GM', margin + 10, yPos + 30);
  
  // Company info
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('GLOWMART', margin + 55, yPos + 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.text('Premium Cosmetics & Supplements', margin + 55, yPos + 28);
  doc.setFontSize(8);
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text('Moi Avenue, Nairobi, Kenya', margin + 55, yPos + 36);
  doc.text('+254 700 000 000 | hello@glowmart.co.ke', margin + 55, yPos + 42);
  
  // Invoice badge
  const badgeWidth = 65;
  const badgeX = pageWidth - margin - badgeWidth;
  doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
  doc.roundedRect(badgeX, yPos, badgeWidth, 45, 4, 4, 'F');
  doc.setDrawColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.roundedRect(badgeX, yPos, badgeWidth, 45, 4, 4, 'S');
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', badgeX + badgeWidth / 2, yPos + 20, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text(`#${order.order_number || order.id}`, badgeX + badgeWidth / 2, yPos + 32, { align: 'center' });
  doc.text(new Date(order.created_at).toLocaleDateString('en-GB'), badgeX + badgeWidth / 2, yPos + 40, { align: 'center' });
  
  yPos += 60;
  doc.setDrawColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;
  
  // Order Information
  doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 35, 3, 3, 'F');
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER INFORMATION', margin + 5, yPos + 8);
  
  doc.setFontSize(9);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  let infoY = yPos + 18;
  doc.text(`Order Number: ${order.order_number || order.id}`, margin + 5, infoY);
  const orderStatus = ORDER_STATUSES[order.order_status] || ORDER_STATUSES.pending;
  doc.text(`Status: ${orderStatus.label}`, margin + 85, infoY);
  infoY += 8;
  doc.text(`Created: ${new Date(order.created_at).toLocaleString()}`, margin + 5, infoY);
  doc.text(`Updated: ${new Date(order.updated_at).toLocaleString()}`, margin + 85, infoY);
  
  yPos += 50;
  
  // Customer Information
  doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
  doc.roundedRect(margin, yPos, (pageWidth - (margin * 2)) / 2 - 2.5, 45, 3, 3, 'F');
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.text('CUSTOMER INFORMATION', margin + 5, yPos + 8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  let customerY = yPos + 18;
  doc.text(`Name: ${order.customer_name || 'Guest'}`, margin + 5, customerY);
  customerY += 7;
  doc.text(`Email: ${order.customer_email || 'N/A'}`, margin + 5, customerY);
  customerY += 7;
  doc.text(`Phone: ${order.customer_phone || 'N/A'}`, margin + 5, customerY);
  
  // Delivery Information
  doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
  doc.roundedRect((pageWidth / 2) + 2.5, yPos, (pageWidth - (margin * 2)) / 2 - 2.5, 45, 3, 3, 'F');
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.text('DELIVERY INFORMATION', (pageWidth / 2) + 7, yPos + 8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  let deliveryY = yPos + 18;
  const addressLines = doc.splitTextToSize(order.delivery_address || 'No address provided', 60);
  doc.text(`Address: ${addressLines[0]}`, (pageWidth / 2) + 7, deliveryY);
  deliveryY += 7;
  doc.text(`City: ${order.delivery_city || 'Nairobi'}`, (pageWidth / 2) + 7, deliveryY);
  deliveryY += 7;
  doc.text(`Area: ${order.delivery_area || 'N/A'}`, (pageWidth / 2) + 7, deliveryY);
  
  yPos += 60;
  
  // Special Instructions
  if (order.special_instructions) {
    doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 3, 3, 'F');
    doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
    doc.text('SPECIAL INSTRUCTIONS', margin + 5, yPos + 8);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    const notesLines = doc.splitTextToSize(order.special_instructions, pageWidth - (margin * 2) - 10);
    let notesY = yPos + 18;
    notesLines.forEach(line => { doc.text(line, margin + 5, notesY); notesY += 5; });
    yPos += 40;
  }
  
  // Order Items Table Header
  doc.setFillColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.rect(margin, yPos, pageWidth - (margin * 2), 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  const colX = {
    item: margin + 5,
    qty: pageWidth - margin - 75,
    price: pageWidth - margin - 50,
    total: pageWidth - margin - 25
  };
  
  doc.text('PRODUCT', colX.item, yPos + 8);
  doc.text('QTY', colX.qty, yPos + 8);
  doc.text('PRICE', colX.price, yPos + 8);
  doc.text('TOTAL', colX.total, yPos + 8, { align: 'right' });
  
  yPos += 12;
  
  // Order Items from OrderItem model
  const items = order.items || [];
  let rowBg = true;
  
  items.forEach((item, index) => {
    const productName = item.product_name || `Product #${index + 1}`;
    const quantity = item.quantity || 1;
    const price = parseFloat(item.price) || 0;
    const total = quantity * price;
    
    if (rowBg) {
      doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
    }
    rowBg = !rowBg;
    
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(9);
    let displayName = productName;
    if (displayName.length > 40) displayName = displayName.substring(0, 37) + '...';
    doc.text(displayName, colX.item, yPos + 5);
    doc.text(quantity.toString(), colX.qty, yPos + 5);
    doc.text(formatCurrency(price), colX.price, yPos + 5);
    doc.text(formatCurrency(total), colX.total, yPos + 5, { align: 'right' });
    
    yPos += 10;
    
    if (yPos > pageHeight - 70) {
      doc.addPage();
      yPos = margin;
      doc.setFillColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('PRODUCT', colX.item, yPos + 8);
      doc.text('QTY', colX.qty, yPos + 8);
      doc.text('PRICE', colX.price, yPos + 8);
      doc.text('TOTAL', colX.total, yPos + 8, { align: 'right' });
      yPos += 12;
      rowBg = true;
    }
  });
  
  doc.setDrawColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;
  
  // Order Summary
  const subtotal = order.subtotal || items.reduce((sum, i) => sum + (parseFloat(i.price) * (i.quantity || 1)), 0);
  const shipping = parseFloat(order.shipping_cost) || 0;
  const total = parseFloat(order.total_amount) || subtotal + shipping;
  
  const summaryBoxWidth = 70;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;
  doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
  doc.roundedRect(summaryBoxX, yPos, summaryBoxWidth, 40, 4, 4, 'F');
  doc.setDrawColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.roundedRect(summaryBoxX, yPos, summaryBoxWidth, 40, 4, 4, 'S');
  
  let summaryY = yPos + 10;
  doc.setFontSize(9);
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text('Subtotal', summaryBoxX + 8, summaryY);
  doc.text(formatCurrency(subtotal), summaryBoxX + summaryBoxWidth - 8, summaryY, { align: 'right' });
  summaryY += 9;
  doc.text('Delivery', summaryBoxX + 8, summaryY);
  if (shipping === 0) {
    doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
    doc.text('FREE', summaryBoxX + summaryBoxWidth - 8, summaryY, { align: 'right' });
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  } else {
    doc.text(formatCurrency(shipping), summaryBoxX + summaryBoxWidth - 8, summaryY, { align: 'right' });
  }
  summaryY += 9;
  doc.setDrawColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.line(summaryBoxX + 8, summaryY, summaryBoxX + summaryBoxWidth - 8, summaryY);
  summaryY += 9;
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL', summaryBoxX + 8, summaryY);
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.setFontSize(13);
  doc.text(formatCurrency(total), summaryBoxX + summaryBoxWidth - 8, summaryY, { align: 'right' });
  
  yPos += 50;
  
  // Payment Information
  doc.setDrawColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT INFORMATION', margin, yPos);
  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text(`Payment Method: ${order.payment_method?.toUpperCase() || 'M-PESA'}`, margin, yPos);
  const paymentStatus = PAYMENT_STATUSES[order.payment_status]?.label || order.payment_status || 'Pending';
  doc.text(`Payment Status: ${paymentStatus}`, margin + 80, yPos);
  
  if (order.mpesa_receipt_number) {
    yPos += 7;
    doc.text(`M-PESA Receipt: ${order.mpesa_receipt_number}`, margin, yPos);
  }
  
  // Footer
  const footerY = pageHeight - 20;
  doc.setDrawColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  doc.setTextColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bolditalic');
  doc.text('Thank you for choosing Glowmart!', pageWidth / 2, footerY, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text('For inquiries: support@glowmart.co.ke | www.glowmart.co.ke', pageWidth / 2, footerY + 6, { align: 'center' });
  doc.setFillColor(brandPrimary[0], brandPrimary[1], brandPrimary[2]);
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');
  
  return doc;
};

// Toast Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600" />
  };
  
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border animate-slide-up
      ${type === 'success' ? 'bg-green-50 border-green-200' : 
        type === 'error' ? 'bg-red-50 border-red-200' : 
        'bg-amber-50 border-amber-200'}`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className={`text-sm font-medium ${type === 'success' ? 'text-green-700' : 
          type === 'error' ? 'text-red-600' : 'text-amber-700'}`}>
          {message}
        </p>
        <button onClick={onClose} className="opacity-60 hover:opacity-100 text-gray-600">✕</button>
      </div>
    </div>
  );
}

// Confirm Dialog
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-800">Confirm Action</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
            DELETE
          </button>
          <button onClick={onCancel} className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:border-gray-300 transition-colors font-medium">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

// Stats Cards
function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'text-gray-700', bg: 'bg-gray-50' },
    { label: 'Revenue', value: `KSh ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Paid', value: stats.paid, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Processing', value: stats.processing, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Canceled', value: stats.canceled, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
      {cards.map((c, i) => (
        <div key={i} className={`${c.bg} border rounded-2xl p-4 hover:shadow-lg transition-all`}>
          <div className="flex items-center justify-between mb-2">
            <c.icon className={`w-6 h-6 ${c.color}`} />
            <span className="text-2xl font-bold text-gray-800">{c.value}</span>
          </div>
          <p className="text-xs text-gray-600 font-medium">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

// Order Modal
function OrderModal({ order, mode, onClose, onSave, formatCurrency }) {
  const handleDownloadInvoice = () => {
    const doc = generateInvoice(order, formatCurrency);
    doc.save(`GlowMart-Invoice-${order.order_number || order.id}.pdf`);
  };

  const orderStatus = ORDER_STATUSES[order?.order_status] || ORDER_STATUSES.pending;
  const paymentStatus = PAYMENT_STATUSES[order?.payment_status] || PAYMENT_STATUSES.pending;
  const StatusIcon = orderStatus.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-[#faf7f2] to-white border-b border-[#f0e7db] p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-[#b89b7b] font-medium mb-1">ORDER DETAILS</p>
              <h2 className="font-bold text-2xl text-[#2c2c2c]">
                {order?.order_number || `Order #${order?.id}`}
              </h2>
              <div className="flex gap-3 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${orderStatus.bg} ${orderStatus.text}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {orderStatus.label}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${paymentStatus.bg} ${paymentStatus.text}`}>
                  {paymentStatus.label}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Status Update */}
          {mode === 'edit' && (
            <div className="mb-8 p-5 bg-gradient-to-r from-[#faf7f2] to-[#f5ede0] rounded-2xl border border-[#f0e7db]">
              <h3 className="text-sm font-semibold text-[#2c2c2c] mb-3 flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#b89b7b]" />
                Update Order Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ORDER_STATUSES).map(([key, status]) => (
                  <button
                    key={key}
                    onClick={() => onSave(order.id, { order_status: key })}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2
                      ${order.order_status === key 
                        ? `${status.bg} ${status.text} border-[#b89b7b] shadow-md` 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#b89b7b]/40'}`}
                  >
                    <status.icon className="w-4 h-4" />
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customer & Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#fefaf5] to-white rounded-xl border border-[#f0e7db] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-[#b89b7b]" />
                <h3 className="font-semibold text-[#2c2c2c]">Customer Information</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#2c2c2c]">{order?.customer_name || 'Guest Customer'}</p>
                <p className="text-sm text-[#6b6b6b]">{order?.customer_email}</p>
                <p className="text-sm text-[#6b6b6b]">{order?.customer_phone}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#fefaf5] to-white rounded-xl border border-[#f0e7db] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[#b89b7b]" />
                <h3 className="font-semibold text-[#2c2c2c]">Order Timeline</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[#6b6b6b]">Created: {new Date(order?.created_at).toLocaleString()}</p>
                <p className="text-sm text-[#6b6b6b]">Updated: {new Date(order?.updated_at).toLocaleString()}</p>
                {order?.paid_at && <p className="text-sm text-green-600">Paid: {new Date(order.paid_at).toLocaleString()}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-8 bg-gradient-to-br from-[#fefaf5] to-white rounded-xl border border-[#f0e7db] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-5 h-5 text-[#b89b7b]" />
              <h3 className="font-semibold text-[#2c2c2c]">Delivery Address</h3>
            </div>
            <p className="text-sm text-[#2c2c2c]">{order?.delivery_address}</p>
            <p className="text-sm text-[#6b6b6b] mt-1">{order?.delivery_city}{order?.delivery_area ? `, ${order.delivery_area}` : ''}</p>
            {order?.special_instructions && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-[#f0e7db]">
                <p className="text-xs text-[#b89b7b] mb-1">📝 Special Instructions:</p>
                <p className="text-sm text-[#2c2c2c]">{order.special_instructions}</p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="font-semibold text-[#2c2c2c] mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#b89b7b]" />
              Order Items
            </h3>
            <div className="border border-[#f0e7db] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#faf7f2] to-[#f5ede0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#6b6b6b] uppercase">Product</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#6b6b6b] uppercase">Qty</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#6b6b6b] uppercase">Price</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#6b6b6b] uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.items?.map((item, i) => (
                    <tr key={i} className="border-t border-[#f0e7db] hover:bg-[#fefaf5] transition-colors">
                      <td className="px-6 py-4 text-sm text-[#2c2c2c] font-medium">
                        {item.product_name || `Product #${i + 1}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-[#2c2c2c]">{item.quantity || 1}</td>
                      <td className="px-6 py-4 text-sm text-right text-[#2c2c2c]">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-[#2c2c2c]">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-[#faf7f2] to-[#f5ede0] border-t border-[#f0e7db]">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-medium text-[#6b6b6b]">Subtotal:</td>
                    <td className="px-6 py-4 text-right font-medium text-[#2c2c2c]">{formatCurrency(order?.subtotal || 0)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-medium text-[#6b6b6b]">Delivery:</td>
                    <td className="px-6 py-4 text-right font-medium text-[#2c2c2c]">{order?.shipping_cost === 0 ? 'FREE' : formatCurrency(order?.shipping_cost || 0)}</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-[#b89b7b]/10 to-[#9b7a5a]/10">
                    <td colSpan="3" className="px-6 py-4 text-right font-bold text-[#2c2c2c]">TOTAL:</td>
                    <td className="px-6 py-4 text-right font-bold text-[#b89b7b] text-lg">{formatCurrency(order?.total_amount || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* M-PESA Details */}
          {order?.mpesa_receipt_number && (
            <div className="mb-8 p-5 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">M-PESA Payment Details</h3>
              </div>
              <p className="text-sm text-green-700">Receipt Number: <strong>{order.mpesa_receipt_number}</strong></p>
              {order.mpesa_transaction_id && (
                <p className="text-sm text-green-700 mt-1">Transaction ID: {order.mpesa_transaction_id}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-[#f0e7db]">
            <button onClick={onClose} className="flex-1 py-3 border-2 border-[#f0e7db] text-[#6b6b6b] rounded-xl hover:border-[#b89b7b]/40 hover:bg-[#fefaf5] transition-colors font-medium">
              CLOSE
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="flex-1 py-3 bg-gradient-to-r from-[#2c2c2c] to-[#3a3a3a] text-white rounded-xl hover:from-[#b89b7b] hover:to-[#9b7a5a] transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              DOWNLOAD INVOICE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 transition-colors flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      <div className="flex gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            className={`w-10 h-10 rounded-xl transition-all font-medium ${
              currentPage === page
                ? 'bg-[#b89b7b] text-white shadow-md'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 transition-colors flex items-center gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// Order Filters
function OrderFilters({ filters, onChange, onClear }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-700">Filter Orders</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order # or customer..."
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#b89b7b] outline-none"
          />
        </div>
        <select 
          value={filters.orderStatus} 
          onChange={(e) => onChange('orderStatus', e.target.value)} 
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#b89b7b] outline-none"
        >
          <option value="all">All Order Statuses</option>
          {Object.entries(ORDER_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select 
          value={filters.paymentStatus} 
          onChange={(e) => onChange('paymentStatus', e.target.value)} 
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#b89b7b] outline-none"
        >
          <option value="all">All Payment Statuses</option>
          {Object.entries(PAYMENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button 
          onClick={onClear} 
          className="px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:border-gray-300 transition-colors font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

// Main Orders Component
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({ search: '', orderStatus: 'all', paymentStatus: 'all' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    canceled: 0,
    paid: 0,
    revenue: 0
  });
  const itemsPerPage = 20;

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  // Fetch orders with server-side pagination
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getOrders(currentPage, itemsPerPage, filters);
      const { data, count } = extractDataFromResponse(response);
      
      setOrders(data);
      setTotalOrders(count);
      setTotalPages(Math.ceil(count / itemsPerPage));
      
      // Calculate stats from all orders (you might want to fetch this from a separate endpoint)
      // For now, we'll use the current page data for stats
      const statsData = {
        total: count,
        pending: data.filter(o => o.order_status === 'pending').length,
        processing: data.filter(o => o.order_status === 'processing').length,
        shipped: data.filter(o => o.order_status === 'shipped').length,
        delivered: data.filter(o => o.order_status === 'delivered').length,
        canceled: data.filter(o => o.order_status === 'canceled').length,
        paid: data.filter(o => o.payment_status === 'payment_completed').length,
        revenue: data.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)
      };
      setStats(statsData);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleClearFilters = () => {
    setFilters({ search: '', orderStatus: 'all', paymentStatus: 'all' });
    setCurrentPage(1);
  };

  const handleOrderUpdate = async (orderId, updateData) => {
    try {
      await api.updateOrder(orderId, updateData);
      showToast('Order updated successfully', 'success');
      fetchOrders();
      setModalOpen(false);
    } catch (error) {
      showToast('Failed to update order', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteOrder(id);
      showToast('Order deleted successfully', 'success');
      fetchOrders();
    } catch (error) {
      showToast('Failed to delete order', 'error');
    }
    setConfirmDelete(null);
  };

  const formatCurrency = (amt) => `KSh ${Number(amt || 0).toLocaleString()}`;

  return (
    <>
      <AdminNav />
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up .3s ease-out; }
      `}</style>

      <div className="min-h-screen bg-[#f5f2ee] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-8 bg-[#b89b7b] rounded-full"></div>
                  <p className="text-sm text-[#b89b7b] font-medium uppercase tracking-wide">Order Management</p>
                </div>
                <h1 className="font-bold text-4xl text-gray-800 mb-2">Orders</h1>
                <p className="text-gray-600">Manage and track all customer orders</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <StatsCards stats={stats} />
          
          <OrderFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#b89b7b] rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-6xl mb-4 opacity-30">📦</div>
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Order #</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Items</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => {
                        const orderStatus = ORDER_STATUSES[order.order_status] || ORDER_STATUSES.pending;
                        const paymentStatus = PAYMENT_STATUSES[order.payment_status] || PAYMENT_STATUSES.pending;
                        const total = order.total_amount || 0;
                        const itemCount = order.items?.length || 0;
                        const StatusIcon = orderStatus.icon;
                        
                        return (
                          <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-sm font-mono font-medium text-[#b89b7b]">
                                {order.order_number || `#${order.id}`}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-800">{order.customer_name || 'Guest'}</div>
                              <div className="text-xs text-gray-500">{order.customer_email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{order.customer_phone || '—'}</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-600">{itemCount}</td>
                            <td className="px-6 py-4 text-right text-sm font-semibold text-gray-800">{formatCurrency(total)}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${orderStatus.bg} ${orderStatus.text}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {orderStatus.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${paymentStatus.bg} ${paymentStatus.text}`}>
                                {paymentStatus.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => { setSelectedOrder(order); setModalMode('view'); setModalOpen(true); }} className="p-2 text-gray-500 hover:text-[#b89b7b] hover:bg-gray-100 rounded-lg transition-colors" title="View Order">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setSelectedOrder(order); setModalMode('edit'); setModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Status">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => setConfirmDelete(order.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Order">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Pagination Info */}
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>Showing {orders.length} of {totalOrders} orders</span>
                <span>Page {currentPage} of {totalPages || 1}</span>
              </div>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {modalOpen && (
        <OrderModal
          order={selectedOrder}
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          onSave={handleOrderUpdate}
          formatCurrency={formatCurrency}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          message="Delete this order? This action cannot be undone."
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}