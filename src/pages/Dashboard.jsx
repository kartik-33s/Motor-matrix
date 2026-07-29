import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleApi from '../api/vehicleApi';
import SearchFilterBar from '../components/SearchFilterBar';
import VehicleCard from '../components/VehicleCard';
import {
  CheckCircle2,
  AlertCircle,
  Package,
  X,
  ArrowRight,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const [filters, setFilters] = useState({
    q: '',
    make: 'All',
    category: 'All',
    minPrice: '',
    maxPrice: '',
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.searchVehicles(filters);
      setVehicles(data);
    } catch (err) {
      showToast('Failed to load vehicle inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filters.make, filters.category, filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.q]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      make: 'All',
      category: 'All',
      minPrice: '',
      maxPrice: '',
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePurchaseVehicle = async (id) => {
    try {
      const res = await vehicleApi.purchaseVehicle(id, 1);

      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, stock: res.vehicle.stock } : v))
      );

      setOrderConfirmation({
        vehicle: res.vehicle,
        transaction: res.transaction,
      });

      showToast(
        `${res.vehicle.year} ${res.vehicle.make} ${res.vehicle.model} ADDED TO ORDERS`,
        'success'
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'TRANSACTION FAILED';
      showToast(msg, 'error');
      throw err;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 bg-[#1a1a1a] border flex items-center space-x-3 ${
            toast.type === 'success'
              ? 'border-[#0fa336]'
              : 'border-[#e22718]'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#0fa336] flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#e22718] flex-shrink-0" />
          )}
          <span className="text-[14px] font-bold text-white uppercase tracking-[1.5px]">{toast.message}</span>
        </div>
      )}

      {/* Hero Photo Band */}
      <div className="relative w-full h-[600px] overflow-hidden bg-[#000000]">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
          alt="Performance Vehicle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        
        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="text-[14px] font-bold text-[#1c69d4] uppercase tracking-[1.5px] mb-4">
              PERFORMANCE INVENTORY
            </div>
            <h1 className="text-[56px] lg:text-[80px] font-bold text-white uppercase leading-none mb-6">
              THE ULTIMATE
              <br />
              DRIVING CATALOG
            </h1>
            <p className="text-[16px] font-light text-[#bbbbbb] leading-relaxed max-w-xl mb-8">
              Explore our curated collection of high-performance vehicles. Real-time inventory management with instant purchase capabilities.
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-[#1a1a1a] px-6 py-4">
                <span className="text-[32px] font-bold text-white block leading-none">{vehicles.length}</span>
                <span className="text-[12px] text-[#7e7e7e] uppercase tracking-[1.5px] font-bold">MODELS</span>
              </div>
              <div className="bg-[#1a1a1a] px-6 py-4">
                <span className="text-[32px] font-bold text-[#0fa336] block leading-none">
                  {vehicles.reduce((acc, v) => acc + (v.stock || 0), 0)}
                </span>
                <span className="text-[12px] text-[#7e7e7e] uppercase tracking-[1.5px] font-bold">IN STOCK</span>
              </div>
              <div className="bg-[#1a1a1a] px-6 py-4">
                <span className="text-[32px] font-bold text-[#1c69d4] block leading-none">
                  {new Set(vehicles.map((v) => v.category)).size}
                </span>
                <span className="text-[12px] text-[#7e7e7e] uppercase tracking-[1.5px] font-bold">CATEGORIES</span>
              </div>
            </div>
          </div>
        </div>

        {/* M Stripe Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-24">
        
        {/* Search & Filter Controls */}
        <SearchFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={vehicles.length}
        />

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#1a1a1a] animate-pulse">
                <div className="w-full aspect-video bg-[#262626]"></div>
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-[#262626] w-1/3"></div>
                  <div className="h-6 bg-[#262626] w-3/4"></div>
                  <div className="h-3 bg-[#262626] w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty State */
          <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-16 text-center my-16">
            <h3 className="text-[24px] font-bold text-white uppercase tracking-wider mb-3">NO VEHICLES FOUND</h3>
            <p className="text-[14px] text-[#7e7e7e] font-light mb-6 max-w-md mx-auto">
              No inventory items matched your filter criteria. Clear filters to view all available vehicles.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-8 py-4 bg-[#000000] border border-[#ffffff] text-white text-[14px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          /* Vehicle Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} onPurchase={handlePurchaseVehicle} />
            ))}
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      {orderConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] max-w-2xl w-full relative">
            <button
              onClick={() => setOrderConfirmation(null)}
              className="absolute top-6 right-6 p-2 text-[#7e7e7e] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* M Stripe */}
            <div className="h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]"></div>

            <div className="p-8 sm:p-12">
              {/* Header */}
              <div className="mb-8">
                <div className="text-[12px] font-bold text-[#0fa336] uppercase tracking-[1.5px] mb-2">
                  ORDER CONFIRMED
                </div>
                <h2 className="text-[40px] font-bold text-white uppercase leading-tight">
                  PURCHASE
                  <br />
                  COMPLETE
                </h2>
              </div>

              {/* Vehicle Summary */}
              <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-[14px]">
                  <div>
                    <span className="text-[#7e7e7e] uppercase tracking-[1.5px] text-[12px] font-bold block mb-1">VEHICLE</span>
                    <span className="text-white font-bold">{orderConfirmation.vehicle.year} {orderConfirmation.vehicle.make} {orderConfirmation.vehicle.model}</span>
                  </div>
                  <div>
                    <span className="text-[#7e7e7e] uppercase tracking-[1.5px] text-[12px] font-bold block mb-1">CATEGORY</span>
                    <span className="text-[#1c69d4] font-bold">{orderConfirmation.vehicle.category}</span>
                  </div>
                  <div>
                    <span className="text-[#7e7e7e] uppercase tracking-[1.5px] text-[12px] font-bold block mb-1">PRICE</span>
                    <span className="text-[#0fa336] font-bold text-[20px]">{formatPrice(orderConfirmation.vehicle.price)}</span>
                  </div>
                  <div>
                    <span className="text-[#7e7e7e] uppercase tracking-[1.5px] text-[12px] font-bold block mb-1">TRANSACTION</span>
                    <span className="text-white font-mono text-[12px]">{orderConfirmation.transaction?.id || 'VERIFIED'}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <p className="text-[14px] text-[#bbbbbb] font-light leading-relaxed mb-8">
                Your purchase order has been logged into the dealership transaction ledger. View your complete order history and track fulfillment status on your orders page.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setOrderConfirmation(null);
                    navigate('/orders');
                  }}
                  className="flex-1 px-6 py-4 bg-[#000000] border border-[#ffffff] text-white text-[14px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all flex items-center justify-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>VIEW MY ORDERS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setOrderConfirmation(null)}
                  className="sm:w-auto px-6 py-4 bg-[#1a1a1a] border border-[#3c3c3c] text-[#bbbbbb] text-[14px] font-bold uppercase tracking-[1.5px] hover:text-white hover:border-white transition-all"
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
