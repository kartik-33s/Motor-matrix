import React, { useState, useEffect } from 'react';
import vehicleApi from '../api/vehicleApi';
import AdminVehicleForm from '../components/AdminVehicleForm';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Car,
  CheckCircle2,
  AlertCircle,
  Receipt,
} from 'lucide-react';

const AdminPanel = () => {
  const [vehicles, setVehicles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');

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
      showToast('FAILED TO LOAD DATA', 'error');
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
        showToast(`${formData.make} ${formData.model} UPDATED`);
      } else {
        const created = await vehicleApi.createVehicle(formData);
        setVehicles((prev) => [created, ...prev]);
        showToast(`${formData.make} ${formData.model} ADDED`);
      }
      setIsFormOpen(false);
      setEditingVehicle(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'OPERATION FAILED';
      showToast(msg, 'error');
      throw err;
    }
  };

  const handleDelete = async (id, make, model) => {
    if (!window.confirm(`Remove ${make} ${model} from inventory?`)) return;

    try {
      await vehicleApi.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showToast(`${make} ${model} REMOVED`);
    } catch (err) {
      showToast('DELETE FAILED', 'error');
    }
  };

  const handleRestock = async (id, make, model) => {
    try {
      const res = await vehicleApi.restockVehicle(id, 10);
      setVehicles((prev) => prev.map((v) => (v.id === id ? res.vehicle : v)));
      showToast(`${make} ${model} RESTOCKED +10`);
    } catch (err) {
      showToast('RESTOCK FAILED', 'error');
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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-16 relative">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 bg-[#1a1a1a] border flex items-center space-x-3 ${
            toast.type === 'success' ? 'border-[#0fa336]' : 'border-[#e22718]'
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

      {/* M Stripe Divider */}
      <div className="h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718] mb-12"></div>

      {/* Header */}
      <div className="mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1c69d4] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div className="text-[12px] font-bold text-[#1c69d4] uppercase tracking-[1.5px]">
                ADMIN OPERATIONS CENTER
              </div>
            </div>
            <h1 className="text-[56px] lg:text-[80px] font-bold text-white uppercase leading-none mb-6">
              DEALERSHIP
              <br />
              MANAGEMENT
            </h1>
            <p className="text-[16px] font-light text-[#bbbbbb] leading-relaxed max-w-2xl">
              Manage inventory records, adjust stock levels, add new vehicle models, and inspect sales audit ledgers.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingVehicle(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-[#000000] border border-[#ffffff] text-white font-bold text-[14px] uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>ADD VEHICLE</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6">
            <span className="text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] block mb-3">CATALOG MODELS</span>
            <span className="text-[40px] font-bold text-white leading-none block">{vehicles.length}</span>
          </div>
          <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6">
            <span className="text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] block mb-3">STOCK VALUE</span>
            <span className="text-[32px] font-bold text-[#0fa336] leading-none block">{formatPrice(totalCatalogValue)}</span>
          </div>
          <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6">
            <span className="text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] block mb-3">LOW STOCK</span>
            <span className="text-[40px] font-bold text-[#f4b400] leading-none block">{lowStockCount}</span>
          </div>
          <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6">
            <span className="text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] block mb-3">TRANSACTIONS</span>
            <span className="text-[40px] font-bold text-[#1c69d4] leading-none block">{transactions.length}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 mb-8 border-b border-[#3c3c3c]">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-4 text-[14px] font-bold uppercase tracking-[1.5px] transition-colors relative ${
            activeTab === 'inventory'
              ? 'text-white'
              : 'text-[#7e7e7e] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            <span>INVENTORY ({vehicles.length})</span>
          </div>
          {activeTab === 'inventory' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-6 py-4 text-[14px] font-bold uppercase tracking-[1.5px] transition-colors relative ${
            activeTab === 'sales'
              ? 'text-white'
              : 'text-[#7e7e7e] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            <span>SALES LOG ({transactions.length})</span>
          </div>
          {activeTab === 'sales' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
          )}
        </button>
      </div>

      {/* Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="bg-[#1a1a1a] border border-[#3c3c3c]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#0d0d0d] text-[#7e7e7e] text-[12px] font-bold uppercase tracking-[1.5px] border-b border-[#3c3c3c]">
                <tr>
                  <th className="px-6 py-4">VEHICLE</th>
                  <th className="px-6 py-4">CATEGORY</th>
                  <th className="px-6 py-4">PRICE</th>
                  <th className="px-6 py-4">STOCK</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3c3c3c] text-[#bbbbbb]">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-[#262626] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={v.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'}
                          alt={v.model}
                          className="w-16 h-12 object-cover bg-[#0d0d0d] border border-[#3c3c3c]"
                        />
                        <div>
                          <span className="font-bold text-white block uppercase">
                            {v.year} {v.make} {v.model}
                          </span>
                          <span className="text-[12px] text-[#7e7e7e] font-mono">ID: {v.id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#1c69d4]/10 text-[#1c69d4] text-[10px] font-bold px-3 py-1 uppercase tracking-[1.5px]">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#0fa336]">{formatPrice(v.price)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-[1.5px] ${
                          v.stock === 0
                            ? 'bg-[#e22718] text-white'
                            : v.stock <= 3
                            ? 'bg-[#f4b400] text-[#000000]'
                            : 'bg-[#0fa336] text-white'
                        }`}
                      >
                        {v.stock} UNITS
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleRestock(v.id, v.make, v.model)}
                          title="Restock +10"
                          className="p-2 bg-[#0fa336]/10 hover:bg-[#0fa336]/20 text-[#0fa336] border border-[#0fa336]/20 transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingVehicle(v);
                            setIsFormOpen(true);
                          }}
                          title="Edit"
                          className="p-2 bg-[#1c69d4]/10 hover:bg-[#1c69d4]/20 text-[#1c69d4] border border-[#1c69d4]/20 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id, v.make, v.model)}
                          title="Delete"
                          className="p-2 bg-[#e22718]/10 hover:bg-[#e22718]/20 text-[#e22718] border border-[#e22718]/20 transition-all"
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

      {/* Sales Table */}
      {activeTab === 'sales' && (
        <div className="bg-[#1a1a1a] border border-[#3c3c3c]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#0d0d0d] text-[#7e7e7e] text-[12px] font-bold uppercase tracking-[1.5px] border-b border-[#3c3c3c]">
                <tr>
                  <th className="px-6 py-4">TX ID</th>
                  <th className="px-6 py-4">CUSTOMER</th>
                  <th className="px-6 py-4">VEHICLE</th>
                  <th className="px-6 py-4">QTY</th>
                  <th className="px-6 py-4">AMOUNT</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3c3c3c] text-[#bbbbbb]">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#7e7e7e] uppercase tracking-[1.5px]">
                      NO TRANSACTIONS
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-[#262626] transition-colors">
                      <td className="px-6 py-4 font-mono text-[12px] text-[#1c69d4]">
                        {t.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-white block uppercase">
                          {t.users?.name || t.user_name || 'CUSTOMER'}
                        </span>
                        <span className="text-[12px] text-[#7e7e7e]">
                          {t.users?.email || t.user_email || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white uppercase">
                        {t.vehicles ? `${t.vehicles.year} ${t.vehicles.make} ${t.vehicles.model}` : t.vehicle_name || 'VEHICLE'}
                      </td>
                      <td className="px-6 py-4 font-bold">{t.quantity}</td>
                      <td className="px-6 py-4 font-bold text-[#0fa336]">
                        {formatPrice(t.total_price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[#0fa336] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-[1.5px]">
                          {t.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[12px] text-[#7e7e7e]">
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

      {/* Form Modal */}
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
