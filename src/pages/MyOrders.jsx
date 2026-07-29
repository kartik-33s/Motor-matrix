import React, { useState, useEffect } from 'react';
import orderApi from '../api/orderApi';
import {
  Package,
  Car,
  DollarSign,
  TrendingUp,
  Award,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  FileText,
  X,
  ChevronRight,
  Sparkles,
  PieChart,
  Calendar,
  Shield,
  Printer,
  Download,
  AlertCircle,
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loadingReceipt, setLoadingReceipt] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const [ordersRes, analyticsRes] = await Promise.all([
        orderApi.getMyOrders({
          status: selectedStatus,
          category: selectedCategory,
          search: searchTerm,
        }),
        orderApi.getOrderAnalytics(),
      ]);

      if (ordersRes.orders) {
        setOrders(ordersRes.orders);
      }
      if (analyticsRes.analytics) {
        setAnalytics(analyticsRes.analytics);
      }
    } catch (err) {
      console.error('Error loading order data:', err);
      showToast('Failed to load order history & analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [selectedStatus, selectedCategory]);

  // Debounced search term
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrderData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenReceipt = async (orderId) => {
    setLoadingReceipt(true);
    try {
      const res = await orderApi.getOrderReceipt(orderId);
      if (res.receipt) {
        setSelectedReceipt(res.receipt);
      }
    } catch (err) {
      showToast('Failed to load transaction receipt details', 'error');
    } finally {
      setLoadingReceipt(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  const getDeliveryBadge = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case 'delivered':
        return (
          <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'in_transit':
        return (
          <span className="text-[11px] font-medium text-blue-400 flex items-center gap-1">
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-medium text-purple-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Processing Order
          </span>
        );
    }
  };

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

      {/* Hero Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Garage & Financial Audit</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Vehicle Orders & Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Track your acquired vehicle fleet, review transaction receipts, analyze your expenditure breakdown, and monitor real-time order fulfillment status.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchOrderData}
              className="px-4 py-2 bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Orders Card */}
        <div className="bg-gray-900/80 border border-gray-800 hover:border-blue-500/40 p-5 rounded-2xl shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Cars Ordered
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">
              {analytics ? analytics.totalOrders : 0}
            </span>
            <span className="text-xs text-blue-400 font-medium">Vehicles</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{analytics?.completedOrders || 0} Delivered/Completed</span>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-gray-900/80 border border-gray-800 hover:border-emerald-500/40 p-5 rounded-2xl shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Investment
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatCurrency(analytics?.totalSpent)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Verified Financial Transactions</span>
          </div>
        </div>

        {/* Favorite Brand Card */}
        <div className="bg-gray-900/80 border border-gray-800 hover:border-purple-500/40 p-5 rounded-2xl shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Favorite Brand
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-300">
              {analytics?.favoriteMake || 'N/A'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
            <Shield className="w-3 h-3 text-purple-400" />
            <span>Most Purchased Manufacturer</span>
          </div>
        </div>

        {/* Average Order Value Card */}
        <div className="bg-gray-900/80 border border-gray-800 hover:border-amber-500/40 p-5 rounded-2xl shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Avg. Vehicle Value
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              {analytics?.totalOrders > 0
                ? formatCurrency(analytics.totalSpent / analytics.totalOrders)
                : '$0'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>Per Acquired Unit</span>
          </div>
        </div>
      </div>

      {/* Visual Category & Brand Distribution Analytics Section */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Vehicle Category Breakdown Visual Progress Bars */}
          <div className="lg:col-span-2 bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-blue-400" />
                  Category Fleet Breakdown
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Distribution of acquired vehicles across categories
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {analytics.categoryBreakdown && analytics.categoryBreakdown.length > 0 ? (
                analytics.categoryBreakdown.map((item, idx) => {
                  const colors = [
                    'from-blue-500 to-indigo-500',
                    'from-purple-500 to-pink-500',
                    'from-emerald-500 to-teal-500',
                    'from-amber-500 to-orange-500',
                  ];
                  const gradient = colors[idx % colors.length];

                  return (
                    <div key={item.category} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-200">{item.category}</span>
                        <div className="flex items-center space-x-3 text-gray-400">
                          <span>{item.count} car(s)</span>
                          <span className="font-bold text-white">{formatCurrency(item.totalSpent)}</span>
                          <span className="text-blue-400 font-mono">({item.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                          style={{ width: `${Math.max(item.percentage, 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-400 text-xs">
                  No category analytics available yet.
                </div>
              )}
            </div>
          </div>

          {/* Brand Preference Summary Card */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-purple-400" />
                Brand Preference Summary
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Total investment per vehicle manufacturer
              </p>

              <div className="space-y-3">
                {analytics.brandBreakdown && analytics.brandBreakdown.length > 0 ? (
                  analytics.brandBreakdown.map((b) => (
                    <div
                      key={b.make}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 border border-gray-700/50"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-xs">
                          {b.make.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white block">{b.make}</span>
                          <span className="text-[10px] text-gray-400">{b.count} vehicle(s)</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        {formatCurrency(b.totalSpent)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 text-xs">
                    No brand breakdown available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders by vehicle make, model, or Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 text-gray-200 placeholder-gray-500 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center space-x-3">
            {/* Status Filter */}
            <div className="flex items-center space-x-1.5 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-xs text-gray-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-gray-900">All Statuses</option>
                <option value="completed" className="bg-gray-900">Completed</option>
                <option value="pending" className="bg-gray-900">Pending</option>
                <option value="cancelled" className="bg-gray-900">Cancelled</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-1.5 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2">
              <Car className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs text-gray-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-gray-900">All Categories</option>
                <option value="Electric" className="bg-gray-900">Electric</option>
                <option value="Sports" className="bg-gray-900">Sports</option>
                <option value="SUV" className="bg-gray-900">SUV</option>
                <option value="Sedan" className="bg-gray-900">Sedan</option>
                <option value="Truck" className="bg-gray-900">Truck</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List Section */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 animate-pulse h-32 flex items-center gap-4">
              <div className="w-24 h-20 bg-gray-800 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-12 text-center my-6">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No vehicle orders found</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
            You don't have any vehicle purchases matching your search filters. Explore our catalog dashboard to order your next luxury vehicle.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Car className="w-4 h-4" />
            Browse Inventory Catalog
          </a>
        </div>
      ) : (
        /* Orders List Cards */
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              {/* Left: Thumbnail & Info */}
              <div className="flex items-center space-x-4">
                <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-gray-950 border border-gray-800 flex-shrink-0 relative group-hover:border-blue-500/40 transition-colors">
                  <img
                    src={order.vehicle?.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80'}
                    alt={order.vehicle?.model || 'Vehicle'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-gray-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-semibold text-blue-400 border border-gray-800">
                    {order.vehicle?.category || 'Car'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                      ID: {order.id}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-blue-400 transition-colors">
                    {order.vehicle ? `${order.vehicle.year} ${order.vehicle.make} ${order.vehicle.model}` : order.vehicle_name || 'Vehicle Purchase'}
                  </h3>

                  <div className="flex items-center space-x-3 text-xs text-gray-400 pt-0.5">
                    <span>Qty: <strong className="text-gray-200">{order.quantity || 1}</strong></span>
                    <span>•</span>
                    {getDeliveryBadge(order.delivery_status)}
                  </div>
                </div>
              </div>

              {/* Right: Status, Pricing & Action */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-gray-800 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Amount</span>
                  <span className="text-xl font-black text-emerald-400">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(order.payment_status)}

                  <button
                    onClick={() => handleOpenReceipt(order.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-blue-600 text-gray-200 hover:text-white text-xs font-semibold transition-all border border-gray-700 hover:border-blue-500 cursor-pointer shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Itemized Order Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Official Purchase Receipt</h2>
                  <span className="text-xs font-mono text-gray-400">Order Ref: #{selectedReceipt.orderId}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Summary Cards */}
            <div className="space-y-5">
              {/* Customer & Date info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-950 p-4 rounded-2xl border border-gray-800 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-semibold">Billed To</span>
                  <span className="font-bold text-white block mt-0.5">{selectedReceipt.customer.name}</span>
                  <span className="text-gray-400 block">{selectedReceipt.customer.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-semibold">Transaction Date</span>
                  <span className="font-bold text-white block mt-0.5">{formatDate(selectedReceipt.date)}</span>
                  <span className="text-emerald-400 font-semibold uppercase text-[10px]">
                    Status: {selectedReceipt.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Vehicle Specs Header */}
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center space-x-4">
                {selectedReceipt.vehicle.image_url && (
                  <img
                    src={selectedReceipt.vehicle.image_url}
                    alt="Vehicle"
                    className="w-20 h-16 rounded-xl object-cover border border-gray-800"
                  />
                )}
                <div>
                  <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest">
                    {selectedReceipt.vehicle.category}
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {selectedReceipt.vehicle.year} {selectedReceipt.vehicle.make} {selectedReceipt.vehicle.model}
                  </h4>
                  <span className="text-xs text-gray-400 font-mono">VIN / Vehicle Asset Verified</span>
                </div>
              </div>

              {/* Itemized Financial Calculation Table */}
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-400 pb-2 border-b border-gray-800 font-semibold">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Base Vehicle Price ({selectedReceipt.pricing.quantity}x)</span>
                  <span>{formatCurrency(selectedReceipt.pricing.subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Enclosed Logistics & Destination Fee</span>
                  <span>{formatCurrency(selectedReceipt.pricing.destinationCharge)}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Estimated State Sales Tax & Licensing (7%)</span>
                  <span>{formatCurrency(selectedReceipt.pricing.estimatedTax)}</span>
                </div>

                <div className="flex justify-between text-white font-extrabold pt-3 border-t border-gray-800 text-sm">
                  <span>Grand Total Paid</span>
                  <span className="text-emerald-400">{formatCurrency(selectedReceipt.pricing.grandTotal)}</span>
                </div>
              </div>

              {/* Delivery Address & Payment Method */}
              <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 text-xs space-y-1.5">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  <span><strong>Destination:</strong> {selectedReceipt.shippingAddress}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span><strong>Payment Method:</strong> {selectedReceipt.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Invoice
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
