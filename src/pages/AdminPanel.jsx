import React, { useState, useEffect } from 'react';
import vehicleApi from '../api/vehicleApi';
import AdminVehicleForm from '../components/AdminVehicleForm';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  Receipt,
  Car,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

const AdminPanel = () => {
  const [vehicles, setVehicles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'sales'
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, tData] = await Promise.all([
        vehicleApi.getVehicles(),
        vehicleApi.getAllTransactions().catch(() => []),
      ]);
      setVehicles(vData);
      setTransactions(tData);
    } catch (err) {
      showToast('Failed to load admin management ledger data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingVehicle) {
        const updated = await vehicleApi.updateVehicle(editingVehicle.id, formData);
        setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? updated : v)));
        showToast(`Vehicle ${formData.make} ${formData.model} updated successfully!`);
      } else {
        const created = await vehicleApi.createVehicle(formData);
        setVehicles((prev) => [created, ...prev]);
        showToast(`New vehicle ${formData.make} ${formData.model} added to catalog!`);
      }
      setIsFormOpen(false);
      setEditingVehicle(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed.';
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleDelete = async (id, make, model) => {
    if (!window.confirm(`Are you sure you want to remove ${make} ${model} from the inventory ledger?`)) return;

    try {
      await vehicleApi.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showToast(`Vehicle ${make} ${model} removed from catalog.`);
    } catch (err) {
      showToast('Failed to delete vehicle', 'error');
    }
  };

  const handleRestock = async (id, make, model) => {
    try {
      const res = await vehicleApi.restockVehicle(id, 10);
      setVehicles((prev) => prev.map((v) => (v.id === id ? res.vehicle : v)));
      showToast(`Restocked +10 units for ${make} ${model}. New stock: ${res.vehicle.stock}`);
    } catch (err) {
      showToast('Failed to restock vehicle inventory', 'error');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const totalCatalogValue = vehicles.reduce((sum, v) => sum + v.price * (v.stock || 0), 0);
  const lowStockCount = vehicles.filter((v) => v.stock <= 3).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center space-x-3 transition-all ${
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

      {/* Admin Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold text-purple-300 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Operations & Audit Control</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dealership Operations Center
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Manage inventory records, adjust stock levels, add new vehicle models, and inspect sales audit ledgers.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingVehicle(null);
              setIsFormOpen(true);
            }}
            className="flex items-center space-x-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Vehicle Record</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-purple-500/20">
          <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-2xl">
            <span className="text-xs font-semibold text-gray-400 block uppercase">Total Catalog Models</span>
            <span className="text-2xl font-black text-white mt-1 block">{vehicles.length}</span>
          </div>
          <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-2xl">
            <span className="text-xs font-semibold text-gray-400 block uppercase">Total Stock Value</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{formatPrice(totalCatalogValue)}</span>
          </div>
          <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-2xl">
            <span className="text-xs font-semibold text-gray-400 block uppercase">Low Stock Alerts</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">{lowStockCount}</span>
          </div>
          <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-2xl">
            <span className="text-xs font-semibold text-gray-400 block uppercase">Completed Transactions</span>
            <span className="text-2xl font-black text-blue-400 mt-1 block">{transactions.length}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehicle Inventory Ledger ({vehicles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'sales'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Sales Audit Log ({transactions.length})</span>
        </button>
      </div>

      {/* Tab 1: Inventory Management Table */}
      {activeTab === 'inventory' && (
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900/90 text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">Vehicle Specification</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4 text-right">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-200">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={v.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'}
                          alt={v.model}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-800 flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block">
                            {v.year} {v.make} {v.model}
                          </span>
                          <span className="text-xs text-gray-400">ID: {v.id.substring(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-2.5 py-1 rounded-md">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">{formatPrice(v.price)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          v.stock === 0
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : v.stock <= 3
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        <span>{v.stock} units</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleRestock(v.id, v.make, v.model)}
                          title="Restock +10 units"
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingVehicle(v);
                            setIsFormOpen(true);
                          }}
                          title="Edit Specs"
                          className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.make, v.model)}
                          title="Delete Vehicle"
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Sales Audit Ledger Table */}
      {activeTab === 'sales' && (
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900/90 text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Vehicle Purchased</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No sales transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-purple-400">
                        {t.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white block">
                          {t.users?.name || t.user_name || 'Customer'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {t.users?.email || t.user_email || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-200">
                        {t.vehicles ? `${t.vehicles.year} ${t.vehicles.make} ${t.vehicles.model}` : t.vehicle_name || 'Vehicle'}
                      </td>
                      <td className="px-6 py-4 font-bold">{t.quantity}</td>
                      <td className="px-6 py-4 font-extrabold text-emerald-400">
                        {formatPrice(t.total_price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                          {t.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(t.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Vehicle Form Modal */}
      {isFormOpen && (
        <AdminVehicleForm
          initialData={editingVehicle}
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setIsFormOpen(false);
            setEditingVehicle(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;
