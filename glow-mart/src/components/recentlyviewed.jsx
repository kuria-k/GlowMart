// components/RecentlyViewed.jsx
import React, { useState, useEffect } from 'react';

const RecentlyViewed = ({ onProductClick }) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentProducts(viewed.slice(0, 6));
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <div className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">
          Recently Viewed
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentProducts.map(product => (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className="cursor-pointer group"
            >
              <div className="aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden">
                <img
                  src={product.image_url || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
              <p className="text-sm text-gray-500">KES {product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;