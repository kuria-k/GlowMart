// components/CheckoutView.jsx - Enhanced with Delivery Location System
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../context/cartcontext";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

// Delivery zones configuration
const DELIVERY_ZONES = {
  nairobi_cbd: {
    name: "Nairobi CBD",
    areas: ["CBD", "City Centre", "Moi Avenue", "Kenyatta Avenue", "Uhuru Highway", "Haile Selassie Avenue"],
    fee: 150,
    estimated_time: "20-30 min",
    color: "bg-green-50 border-green-200 text-green-700"
  },
  nairobi_north: {
    name: "Nairobi North",
    areas: ["Westlands", "Parklands", "Kilimani", "Lavington", "Kileleshwa", "Hurlingham", "Highridge", "Kitisuru"],
    fee: 200,
    estimated_time: "30-45 min",
    color: "bg-blue-50 border-blue-200 text-blue-700"
  },
  nairobi_east: {
    name: "Nairobi East",
    areas: ["Eastlands", "Buruburu", "Umoja", "Donholm", "Embakasi", "Tena", "Kayole", "Komarock"],
    fee: 180,
    estimated_time: "35-50 min",
    color: "bg-amber-50 border-amber-200 text-amber-700"
  },
  nairobi_south: {
    name: "Nairobi South",
    areas: ["South B", "South C", "Lang'ata", "Karen", "Ngong", "Rongai", "Ongata Rongai", "Kitengela"],
    fee: 250,
    estimated_time: "40-60 min",
    color: "bg-purple-50 border-purple-200 text-purple-700"
  },
  nairobi_west: {
    name: "Nairobi West",
    areas: ["Dagoretti", "Kawangware", "Ngong Road", "Adams Arcade", "Jamhuri Estate", "Madaraka Estate"],
    fee: 220,
    estimated_time: "35-50 min",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700"
  },
  kiambu: {
    name: "Kiambu County",
    areas: ["Kiambu Town", "Thika", "Ruiru", "Juja", "Kikuyu", "Limuru", "Tigoni", "Karuri"],
    fee: 400,
    estimated_time: "60-90 min",
    color: "bg-orange-50 border-orange-200 text-orange-700"
  },
  machakos: {
    name: "Machakos County",
    areas: ["Machakos Town", "Athi River", "Mlolongo", "Syokimau", "Kitengela", "Joska", "Kangundo"],
    fee: 450,
    estimated_time: "60-90 min",
    color: "bg-red-50 border-red-200 text-red-700"
  },
  nakuru: {
    name: "Nakuru County",
    areas: ["Nakuru Town", "Naivasha", "Gilgil", "Molo", "Njoro", "Lanet"],
    fee: 800,
    estimated_time: "120-180 min",
    color: "bg-cyan-50 border-cyan-200 text-cyan-700"
  },
  mombasa: {
    name: "Mombasa County",
    areas: ["Mombasa CBD", "Nyali", "Bamburi", "Mtwapa", "Kilifi", "Diani", "Ukunda"],
    fee: 1500,
    estimated_time: "6-8 hours",
    color: "bg-teal-50 border-teal-200 text-teal-700"
  },
  kisumu: {
    name: "Kisumu County",
    areas: ["Kisumu CBD", "Milimani", "Kondele", "Kisian", "Ahero", "Maseno"],
    fee: 1200,
    estimated_time: "5-7 hours",
    color: "bg-sky-50 border-sky-200 text-sky-700"
  },
  other: {
    name: "Other Locations",
    areas: ["Outside Nairobi Metropolitan"],
    fee: 2000,
    estimated_time: "1-3 days",
    color: "bg-gray-50 border-gray-200 text-gray-700"
  }
};

// Common areas for quick selection
const QUICK_AREAS = [
  "Westlands", "Kilimani", "Karen", "Lavington", "Kileleshwa", 
  "Rongai", "Kitengela", "Syokimau", "Thika", "Ruaka"
];

const CheckoutView = ({ onBack, onProceed }) => {
  const { cartTotal } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [customLocation, setCustomLocation] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Nairobi",
    area: "",
    landmark: "",
    specialInstructions: "",
    deliveryZone: "",
  });
  
  const [errors, setErrors] = useState({});

  // Filter zones based on search
  const filteredZones = useMemo(() => {
    if (!searchTerm) return [];
    
    const searchLower = searchTerm.toLowerCase();
    const results = [];
    
    Object.entries(DELIVERY_ZONES).forEach(([key, zone]) => {
      // Check zone name
      if (zone.name.toLowerCase().includes(searchLower)) {
        results.push({ key, ...zone, matchedAreas: [] });
      }
      // Check areas
      const matchedAreas = zone.areas.filter(area => 
        area.toLowerCase().includes(searchLower)
      );
      if (matchedAreas.length > 0) {
        results.push({ key, ...zone, matchedAreas });
      }
    });
    
    return results;
  }, [searchTerm]);

  // Update delivery fee when zone or area changes
  useEffect(() => {
    if (selectedZone) {
      const zone = DELIVERY_ZONES[selectedZone];
      setDeliveryFee(zone.fee);
      setEstimatedTime(zone.estimated_time);
      setFormData(prev => ({ ...prev, deliveryZone: zone.name }));
    } else {
      setDeliveryFee(0);
      setEstimatedTime("");
    }
  }, [selectedZone]);

  // Auto-detect zone when area is selected
  useEffect(() => {
    if (selectedArea) {
      for (const [zoneKey, zone] of Object.entries(DELIVERY_ZONES)) {
        if (zone.areas.some(area => area.toLowerCase() === selectedArea.toLowerCase())) {
          setSelectedZone(zoneKey);
          setFormData(prev => ({ ...prev, area: selectedArea }));
          break;
        }
      }
    }
  }, [selectedArea]);

  const total = cartTotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setCustomLocation(false);
    setSearchTerm("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10,12}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Invalid phone number";
    if (!formData.address.trim()) newErrors.address = "Street address is required";
    if (!selectedZone && !customLocation) newErrors.area = "Please select a delivery location";
    if (customLocation && !formData.area.trim()) newErrors.area = "Please enter your location";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const checkoutData = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        address: formData.address,
        city: formData.city,
        area: selectedArea || formData.area,
        landmark: formData.landmark,
        notes: formData.specialInstructions,
        deliveryZone: selectedZone ? DELIVERY_ZONES[selectedZone].name : "Custom Location",
        deliveryFee: deliveryFee,
        estimatedTime: estimatedTime,
        subtotal: cartTotal,
        total: total,
      };
      
      sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
      
      console.log("📦 Checkout data saved:", checkoutData);
      onProceed();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col bg-gradient-to-b from-[#fefaf5] to-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#f0e7db]">
        <h2 className="text-xl font-light text-[#2c2c2c]">Checkout Details</h2>
        <p className="text-sm text-[#6b6b6b] mt-1">Complete your information for delivery</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        
        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-[#f0e7db] p-6 shadow-sm">
          <h3 className="font-light text-[#2c2c2c] mb-5 flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-[#b89b7b]" />
            </div>
            Contact Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition bg-[#fefaf5]
                  ${errors.fullName ? "border-red-300 focus:border-red-400" : "border-[#f0e7db] focus:border-[#b89b7b]"}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-2">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition bg-[#fefaf5]
                  ${errors.email ? "border-red-300 focus:border-red-400" : "border-[#f0e7db] focus:border-[#b89b7b]"}`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-2">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wide">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition bg-[#fefaf5]
                  ${errors.phone ? "border-red-300 focus:border-red-400" : "border-[#f0e7db] focus:border-[#b89b7b]"}`}
                placeholder="0712 345 678"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-2">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Delivery Location - Enhanced Section */}
        <div className="bg-white rounded-2xl border border-[#f0e7db] p-6 shadow-sm">
          <h3 className="font-light text-[#2c2c2c] mb-5 flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] flex items-center justify-center">
              <MapPinIcon className="w-4 h-4 text-[#b89b7b]" />
            </div>
            Delivery Location
          </h3>
          
          {/* Search for location */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wide">
              Search for your area
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b89b7b]" />
              <input
                type="text"
                placeholder="Westlands, Kilimani, Rongai, Thika..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#f0e7db] rounded-xl focus:border-[#b89b7b] focus:outline-none transition bg-[#fefaf5]"
              />
            </div>
            
            {/* Search results */}
            {searchTerm && filteredZones.length > 0 && (
              <div className="mt-3 border border-[#f0e7db] rounded-xl overflow-hidden bg-white shadow-lg">
                {filteredZones.map((zone) => (
                  <div key={zone.key} className="border-b border-[#f0e7db] last:border-0">
                    <div className="p-3 bg-gradient-to-r from-[#faf7f2] to-white">
                      <div className="font-medium text-[#2c2c2c]">{zone.name}</div>
                      <div className="text-xs text-[#6b6b6b] mt-1 flex items-center gap-3">
                        <span>Delivery: KES {zone.fee.toLocaleString()}</span>
                        <span>⏱️ {zone.estimated_time}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 p-3">
                      {(zone.matchedAreas.length > 0 ? zone.matchedAreas : zone.areas.slice(0, 5)).map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => handleAreaSelect(area)}
                          className="px-3 py-1.5 text-sm bg-white border border-[#f0e7db] rounded-full hover:border-[#b89b7b] hover:text-[#b89b7b] transition-colors"
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Areas */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-[#2c2c2c] mb-3 uppercase tracking-wide">
              Popular Areas
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleAreaSelect(area)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    selectedArea === area
                      ? "bg-[#b89b7b] text-white border-[#b89b7b]"
                      : "bg-white border border-[#f0e7db] hover:border-[#b89b7b] hover:text-[#b89b7b]"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Or enter manually */}
          <div className="mb-5">
            <button
              type="button"
              onClick={() => {
                setCustomLocation(!customLocation);
                setSelectedZone(null);
                setSelectedArea("");
              }}
              className="text-sm text-[#b89b7b] hover:text-[#9b7a5a] font-medium flex items-center gap-2"
            >
              {customLocation ? "← Select from list" : "+ Enter custom location"}
            </button>
          </div>

          {customLocation ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wide">Your Location</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#f0e7db] rounded-xl focus:border-[#b89b7b] focus:outline-none transition bg-[#fefaf5]"
                  placeholder="Enter your area/location"
                />
              </div>
              {customLocation && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    Custom locations may take longer. Delivery fee: KES 2,000
                  </p>
                </div>
              )}
            </div>
          ) : (
            selectedArea && (
              <div className={`mt-4 p-4 rounded-xl border ${DELIVERY_ZONES[selectedZone]?.color || 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <TruckIcon className="w-5 h-5" />
                      <span className="font-semibold text-[#2c2c2c]">{selectedArea}</span>
                    </div>
                    <div className="text-sm mt-2 space-y-1">
                      <p className="flex items-center gap-2">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        Delivery Fee: <strong>KES {deliveryFee.toLocaleString()}</strong>
                      </p>
                      <p className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        Estimated Time: <strong>{estimatedTime}</strong>
                      </p>
                    </div>
                  </div>
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                </div>
              </div>
            )
          )}

          {/* Street Address */}
          <div className="mt-5">
            <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wide">Street / Building</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition bg-[#fefaf5]
                ${errors.address ? "border-red-300 focus:border-red-400" : "border-[#f0e7db] focus:border-[#b89b7b]"}`}
              placeholder="Moi Avenue, Icon House"
            />
            {errors.address && <p className="text-xs text-red-500 mt-2">{errors.address}</p>}
          </div>

          {/* Landmark (Optional) */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-[#2c2c2c] mb-2 uppercase tracking-wide">
              Landmark <span className="text-[#6b6b6b] normal-case font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#f0e7db] rounded-xl focus:border-[#b89b7b] focus:outline-none transition bg-[#fefaf5]"
              placeholder="Near the mall, opposite the bank..."
            />
          </div>
        </div>

        {/* Delivery Zones Info */}
        <div className="bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-2xl border border-[#f0e7db] p-5">
          <h4 className="font-light text-[#2c2c2c] mb-3 text-base flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-[#b89b7b]" />
            Delivery Zones & Fees
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(DELIVERY_ZONES).slice(0, 8).map(([key, zone]) => (
              <div key={key} className="flex justify-between items-center py-1">
                <span className="text-[#6b6b6b]">{zone.name}:</span>
                <span className="font-medium text-[#2c2c2c]">KES {zone.fee.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#9b7a5a] mt-3 pt-2 border-t border-[#f0e7db]">
            * For locations outside listed zones, a custom delivery fee will be calculated
          </p>
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-2xl border border-[#f0e7db] p-6 shadow-sm">
          <h3 className="font-light text-[#2c2c2c] mb-4 text-base">Special Instructions</h3>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border-2 border-[#f0e7db] rounded-xl focus:border-[#b89b7b] focus:outline-none transition resize-none bg-[#fefaf5]"
            placeholder="Delivery instructions, gate code, apartment number..."
          />
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-[#faf7f2] to-[#f5ede0] rounded-2xl border border-[#f0e7db] p-5">
          <h4 className="font-light text-[#2c2c2c] mb-4 text-base">Order Summary</h4>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#6b6b6b]">Subtotal</span>
              <span className="font-medium text-[#2c2c2c]">KES {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#6b6b6b]">Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="text-[#b89b7b] font-semibold text-xs uppercase tracking-wider">To be calculated</span>
              ) : (
                <span className="font-medium text-[#2c2c2c]">KES {deliveryFee.toLocaleString()}</span>
              )}
            </div>
            <div className="border-t border-[#f0e7db] my-2"></div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-light text-[#2c2c2c] text-base">Total to Pay</span>
              <span className="text-2xl font-light text-[#2c2c2c]">
                KES <span className="font-semibold">{total.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="border-t border-[#f0e7db] p-5 bg-gradient-to-br from-[#fefaf5] to-white">
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3.5 border-2 border-[#f0e7db] text-[#6b6b6b] rounded-xl font-medium hover:bg-[#faf7f2] hover:border-[#b89b7b]/30 transition-all"
          >
            ← Back to Cart
          </button>
          <button
            type="submit"
            className="flex-1 py-3.5 bg-gradient-to-r from-[#2c2c2c] to-[#3a3a3a] text-white rounded-xl font-semibold hover:from-[#b89b7b] hover:to-[#9b7a5a] transition-all shadow-lg hover:shadow-xl transform active:scale-98"
          >
            Continue to Payment →
          </button>
        </div>

        <div className="flex items-center justify-center space-x-4 text-xs text-[#6b6b6b]">
          <span className="flex items-center space-x-1">
            <svg className="w-3.5 h-3.5 text-[#b89b7b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure Checkout</span>
          </span>
          <span className="w-px h-3 bg-[#f0e7db]"></span>
          <span>SSL Encrypted</span>
        </div>
      </div>
    </form>
  );
};

export default CheckoutView;