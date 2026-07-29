import React, { useState, useEffect } from 'react';
import vehicleApi from '../api/vehicleApi';
import SearchFilterBar from '../components/SearchFilterBar';
import VehicleCard from '../components/VehicleCard';
import { Car, Zap, CheckCircle2, AlertCircle, Layers, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

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

  // Debounced search for q input
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
      showToast(`Order confirmed! ${res.vehicle.year} ${res.vehicle.make} ${res.vehicle.model} purchased successfully.`, 'success');
      
      // Update local state live
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, stock: res.vehicle.stock } : v))
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Transaction failed. Please try again.';
      showToast(msg, 'error');
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center space-x-3 transition-all transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/90 border-red-500/40 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="mb-10 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Real-Time Inventory Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Vehicle Catalog & Stock Ledger
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Browse available dealership stock, apply combinable filters by manufacturer or price, and execute instant purchase transactions.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-2xl text-center">
              <span className="text-2xl font-black text-white block">{vehicles.length}</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Available Models</span>
            </div>
            <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-2xl text-center">
              <span className="text-2xl font-black text-emerald-400 block">
                {vehicles.reduce((acc, v) => acc + (v.stock || 0), 0)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Stock</span>
            </div>
            <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-2xl text-center">
              <span className="text-2xl font-black text-purple-400 block">
                {new Set(vehicles.map((v) => v.category)).size}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <SearchFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={vehicles.length}
      />

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 animate-pulse h-96">
              <div className="w-full h-48 bg-gray-800 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        /* Empty State */
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-12 text-center my-8">
          <Car className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No vehicles found</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
            No inventory items matched your active filter criteria. Try clearing search keywords or expanding price range limits.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Vehicle Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} onPurchase={handlePurchaseVehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
