import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
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
        <span className="inline-flex items-center space-x-1.5 bg-[#e22718] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-[1.5px]">
          <XCircle className="w-3 h-3" />
          <span>OUT OF STOCK</span>
        </span>
      );
    }
    if (vehicle.stock <= 3) {
      return (
        <span className="inline-flex items-center space-x-1.5 bg-[#f4b400] text-[#000000] text-[10px] font-bold px-2.5 py-1 uppercase tracking-[1.5px]">
          <AlertTriangle className="w-3 h-3" />
          <span>LOW ({vehicle.stock})</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 bg-[#0fa336] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-[1.5px]">
        <CheckCircle className="w-3 h-3" />
        <span>IN STOCK ({vehicle.stock})</span>
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
      <div className="bg-[#1a1a1a] overflow-hidden hover:bg-[#262626] transition-all duration-300 flex flex-col group">

        {/* Vehicle Image */}
        <div className="relative aspect-video overflow-hidden bg-[#000000]">
          <img
            src={vehicle.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

          {/* Category Tag */}
          <div className="absolute top-4 left-4">
            <span className="bg-[#1c69d4] text-white text-[10px] font-bold uppercase tracking-[1.5px] px-3 py-1.5">
              {vehicle.category}
            </span>
          </div>

          {/* Stock Badge */}
          <div className="absolute top-4 right-4">{renderStockBadge()}</div>

          {/* Price */}
          <div className="absolute bottom-4 left-4">
            <span className="text-[24px] font-bold text-white leading-none">
              {formatPrice(vehicle.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
              {vehicle.year} MODEL
            </div>
            <h3 className="text-[20px] font-bold text-white uppercase mb-3 group-hover:text-[#1c69d4] transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-[14px] text-[#bbbbbb] font-light leading-relaxed line-clamp-2">
              {vehicle.description || 'Premium high-performance vehicle with state-of-the-art engineering.'}
            </p>
          </div>

          {/* Action */}
          <div className="mt-6 pt-4 border-t border-[#3c3c3c]">
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={vehicle.stock === 0 || !isAuthenticated}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 font-bold text-[14px] uppercase tracking-[1.5px] transition-all ${
                vehicle.stock === 0
                  ? 'bg-[#262626] text-[#7e7e7e] border border-[#3c3c3c] cursor-not-allowed'
                  : !isAuthenticated
                  ? 'bg-[#1a1a1a] text-[#bbbbbb] border border-[#3c3c3c] hover:text-white hover:border-white'
                  : 'bg-[#000000] text-white border border-[#ffffff] hover:bg-[#ffffff] hover:text-[#000000]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {vehicle.stock === 0
                  ? 'SOLD OUT'
                  : !isAuthenticated
                    ? 'SIGN IN'
                    : 'ORDER NOW'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] max-w-md w-full relative">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-2 text-[#7e7e7e] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* M Stripe */}
            <div className="h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]"></div>

            <div className="p-8">
              <h3 className="text-[24px] font-bold text-white uppercase mb-4">CONFIRM PURCHASE</h3>
              <p className="text-[14px] text-[#bbbbbb] font-light mb-6">
                You are about to purchase the following vehicle:
              </p>

              <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-6 mb-6 space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#7e7e7e] uppercase tracking-[1.5px] text-[12px] font-bold">VEHICLE</span>
                  <span className="font-bold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#7e7e7e] uppercase tracking-[1.5px] text-[12px] font-bold">CATEGORY</span>
                  <span className="text-[#1c69d4] font-bold">{vehicle.category}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#7e7e7e] uppercase tracking-[1.5px] text-[12px] font-bold">PRICE</span>
                  <span className="font-bold text-[#0fa336] text-[20px]">{formatPrice(vehicle.price)}</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isPurchasing}
                  className="flex-1 px-6 py-3 border border-[#3c3c3c] text-[14px] font-bold text-[#bbbbbb] uppercase tracking-[1.5px] hover:text-white hover:border-white transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  disabled={isPurchasing}
                  className="flex-1 px-6 py-3 bg-[#000000] border border-[#ffffff] text-white text-[14px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all flex items-center justify-center space-x-2"
                >
                  {isPurchasing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>CONFIRM</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleCard;
