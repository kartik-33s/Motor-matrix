import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, AlertTriangle, XCircle, Calendar, Tag, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VehicleCard = ({ vehicle, onPurchase }) => {
  const { isAuthenticated } = useAuth();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStockBadge = () => {
    if (vehicle.stock === 0) {
      return (
        <span className="inline-flex items-center space-x-1.5 bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
          <XCircle className="w-3.5 h-3.5" />
          <span>Out of Stock</span>
        </span>
      );
    }
    if (vehicle.stock <= 3) {
      return (
        <span className="inline-flex items-center space-x-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Low Stock ({vehicle.stock} left)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>In Stock ({vehicle.stock} units)</span>
      </span>
    );
  };

  const handleConfirmPurchase = async () => {
    setIsPurchasing(true);
    try {
      await onPurchase(vehicle.id);
      setShowConfirmModal(false);
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <>
      <div className="bg-[#111827]/80 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col group">
        
        {/* Vehicle Image & Badge Overlay */}
        <div className="relative aspect-video overflow-hidden bg-gray-950">
          <img
            src={vehicle.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/40"></div>

          {/* Category Tag (Top Left) */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600/90 text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md backdrop-blur-sm">
              {vehicle.category}
            </span>
          </div>

          {/* Stock Status Badge (Top Right) */}
          <div className="absolute top-3 right-3">{renderStockBadge()}</div>

          {/* Price Banner (Bottom Left) */}
          <div className="absolute bottom-3 left-3">
            <span className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              {formatPrice(vehicle.price)}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{vehicle.year} Model</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
              {vehicle.description || 'Premium high-performance vehicle with state-of-the-art engineering and luxury features.'}
            </p>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              Stock: <strong className="text-white">{vehicle.stock}</strong>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={vehicle.stock === 0 || !isAuthenticated}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer ${
                vehicle.stock === 0
                  ? 'bg-gray-800 text-gray-500 border border-gray-700/50 cursor-not-allowed'
                  : !isAuthenticated
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {vehicle.stock === 0
                  ? 'Sold Out'
                  : !isAuthenticated
                  ? 'Sign in to Purchase'
                  : 'Order Now'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Confirm Vehicle Purchase</h3>
            <p className="text-sm text-gray-400 mb-4">
              You are about to initiate an immediate transactional order for:
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vehicle:</span>
                <span className="font-bold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Category:</span>
                <span className="text-blue-400 font-semibold">{vehicle.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Price:</span>
                <span className="font-extrabold text-emerald-400">{formatPrice(vehicle.price)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isPurchasing}
                className="flex-1 py-2.5 px-4 border border-gray-800 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={isPurchasing}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
              >
                {isPurchasing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Confirm Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleCard;
