import React, { useState, useEffect } from 'react';
import orderApi from '../api/orderApi';
import {
  Package,
  Car,
  DollarSign,
  TrendingUp,
  Award,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  FileText,
  X,
  PieChart,
  Calendar,
  Shield,
  AlertCircle,
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [toast, setToast] = useState(null);

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
      showToast('FAILED TO LOAD ORDER HISTORY', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [selectedStatus, selectedCategory]);

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
    try {
      const res = await orderApi.getOrderReceipt(orderId);
      if (res.receipt) {
        setSelectedReceipt(res.receipt);
      }
    } catch (err) {
      showToast('FAILED TO LOAD RECEIPT', 'error');
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0fa336] text-white text-[10px] font-bold uppercase tracking-[1.5px]">
            <CheckCircle2 className="w-3 h-3" />
            COMPLETED
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f4b400] text-[#000000] text-[10px] font-bold uppercase tracking-[1.5px]">
            <Clock className="w-3 h-3" />
            PENDING
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e22718] text-white text-[10px] font-bold uppercase tracking-[1.5px]">
            <XCircle className="w-3 h-3" />
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7e7e7e] text-white text-[10px] font-bold uppercase tracking-[1.5px]">
            {status}
          </span>
        );
    }
  };

  const getDeliveryBadge = (deliveryStatus) => {
    switch (deliveryStatus?.toLowerCase()) {
      case 'delivered':
        return (
          <span className="text-[11px] font-bold text-[#0fa336] flex items-center gap-1 uppercase tracking-[1.5px]">
            <CheckCircle2 className="w-3 h-3" /> DELIVERED
          </span>
        );
      case 'in_transit':
        return (
          <span className="text-[11px] font-bold text-[#1c69d4] flex items-center gap-1 uppercase tracking-[1.5px]">
            <Truck className="w-3 h-3" /> IN TRANSIT
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold text-[#7e7e7e] flex items-center gap-1 uppercase tracking-[1.5px]">
            <Clock className="w-3 h-3" /> PROCESSING
          </span>
        );
    }
  };

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
        <div className="text-[12px] font-bold text-[#1c69d4] uppercase tracking-[1.5px] mb-4">
          ORDER MANAGEMENT SYSTEM
        </div>
        <h1 className="text-[56px] lg:text-[80px] font-bold text-white uppercase leading-none mb-6">
          MY VEHICLE
          <br />
          ORDERS
        </h1>
        <p className="text-[16px] font-light text-[#bbbbbb] leading-relaxed max-w-2xl">
          Track your acquired vehicle fleet, review transaction receipts, and analyze your expenditure breakdown with real-time order fulfillment monitoring.
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px]">TOTAL ORDERS</span>
            <Car className="w-5 h-5 text-[#1c69d4]" />
          </div>
          <div className="text-[40px] font-bold text-white leading-none mb-2">
            {analytics ? analytics.totalOrders : 0}
          </div>
          <div className="text-[12px] text-[#7e7e7e] font-light uppercase">VEHICLES ACQUIRED</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px]">TOTAL SPENT</span>
            <DollarSign className="w-5 h-5 text-[#0fa336]" />
          </div>
          <div className="text-[32px] font-bold text-[#0fa336] leading-none mb-2">
            {formatCurrency(analytics?.totalSpent)}
          </div>
          <div className="text-[12px] text-[#7e7e7e] font-light uppercase">TOTAL INVESTMENT</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px]">TOP BRAND</span>
            <Award className="w-5 h-5 text-[#1c69d4]" />
          </div>
          <div className="text-[24px] font-bold text-white leading-none mb-2">
            {analytics?.favoriteMake || 'N/A'}
          </div>
          <div className="text-[12px] text-[#7e7e7e] font-light uppercase">FAVORITE MAKE</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px]">AVG VALUE</span>
            <PieChart className="w-5 h-5 text-[#f4b400]" />
          </div>
          <div className="text-[32px] font-bold text-[#f4b400] leading-none mb-2">
            {analytics?.totalOrders > 0
              ? formatCurrency(analytics.totalSpent / analytics.totalOrders)
              : '$0'}
          </div>
          <div className="text-[12px] text-[#7e7e7e] font-light uppercase">PER VEHICLE</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {analytics && analytics.categoryBreakdown && analytics.categoryBreakdown.length > 0 && (
        <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-8 mb-16">
          <h3 className="text-[24px] font-bold text-white uppercase mb-6">CATEGORY BREAKDOWN</h3>
          <div className="space-y-4">
            {analytics.categoryBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-[14px]">
                  <span className="font-bold text-white uppercase">{item.category}</span>
                  <div className="flex items-center space-x-4 text-[#bbbbbb]">
                    <span>{item.count} VEHICLE{item.count !== 1 ? 'S' : ''}</span>
                    <span className="font-bold text-white">{formatCurrency(item.totalSpent)}</span>
                    <span className="text-[#1c69d4] font-bold">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-[#0d0d0d]">
                  <div
                    className="h-full bg-[#1c69d4]"
                    style={{ width: `${Math.max(item.percentage, 2)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#7e7e7e] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="SEARCH ORDERS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#3c3c3c] text-white placeholder-[#7e7e7e] text-[14px] pl-12 pr-4 py-3 outline-none focus:border-[#ffffff] transition-all uppercase font-light"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7e7e7e] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0d0d0d] border border-[#3c3c3c] text-white text-[14px] px-4 py-3 outline-none focus:border-[#ffffff] transition-colors uppercase font-light"
          >
            <option value="all">ALL STATUSES</option>
            <option value="completed">COMPLETED</option>
            <option value="pending">PENDING</option>
            <option value="cancelled">CANCELLED</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0d0d0d] border border-[#3c3c3c] text-white text-[14px] px-4 py-3 outline-none focus:border-[#ffffff] transition-colors uppercase font-light"
          >
            <option value="all">ALL CATEGORIES</option>
            <option value="Electric">ELECTRIC</option>
            <option value="Sports">SPORTS</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">SEDAN</option>
            <option value="Truck">TRUCK</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#3c3c3c] p-6 animate-pulse h-32"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-16 text-center">
          <Package className="w-12 h-12 text-[#7e7e7e] mx-auto mb-4" />
          <h3 className="text-[24px] font-bold text-white uppercase mb-2">NO ORDERS FOUND</h3>
          <p className="text-[14px] text-[#7e7e7e] font-light mb-6 max-w-md mx-auto">
            You don't have any vehicle purchases. Explore the catalog to order your next vehicle.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#000000] border border-[#ffffff] text-white text-[14px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all"
          >
            <Car className="w-4 h-4" />
            BROWSE CATALOG
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#1a1a1a] border border-[#3c3c3c] hover:border-white transition-colors p-6 flex flex-col md:flex-row gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-32 h-24 bg-[#0d0d0d] overflow-hidden flex-shrink-0">
                  <img
                    src={order.vehicle?.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80'}
                    alt={order.vehicle?.model || 'Vehicle'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-[#1c69d4] uppercase tracking-[1.5px] bg-[#1c69d4]/10 px-2 py-1">
                      ID: {order.id}
                    </span>
                    <span className="text-[12px] text-[#7e7e7e] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <h3 className="text-[20px] font-bold text-white uppercase mb-2">
                    {order.vehicle ? `${order.vehicle.year} ${order.vehicle.make} ${order.vehicle.model}` : order.vehicle_name || 'VEHICLE PURCHASE'}
                  </h3>

                  <div className="flex items-center gap-4 text-[12px] text-[#bbbbbb]">
                    <span>QTY: <strong className="text-white">{order.quantity || 1}</strong></span>
                    <span>•</span>
                    {getDeliveryBadge(order.delivery_status)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between gap-4 md:border-l md:border-[#3c3c3c] md:pl-6">
                <div className="text-left md:text-right">
                  <span className="text-[12px] text-[#7e7e7e] uppercase tracking-[1.5px] block mb-1">TOTAL</span>
                  <span className="text-[24px] font-bold text-[#0fa336]">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.payment_status)}
                  <button
                    onClick={() => handleOpenReceipt(order.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#000000] border border-[#ffffff] text-white text-[12px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    RECEIPT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-6 right-6 p-2 text-[#7e7e7e] hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* M Stripe */}
            <div className="h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]"></div>

            <div className="p-12">
              <h2 className="text-[32px] font-bold text-white uppercase mb-8">PURCHASE RECEIPT</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 bg-[#0d0d0d] border border-[#3c3c3c] p-6 text-[14px]">
                  <div>
                    <span className="text-[12px] text-[#7e7e7e] uppercase tracking-[1.5px] font-bold block mb-1">BILLED TO</span>
                    <span className="font-bold text-white block">{selectedReceipt.customer.name}</span>
                    <span className="text-[#bbbbbb]">{selectedReceipt.customer.email}</span>
                  </div>
                  <div>
                    <span className="text-[12px] text-[#7e7e7e] uppercase tracking-[1.5px] font-bold block mb-1">DATE</span>
                    <span className="font-bold text-white block">{formatDate(selectedReceipt.date)}</span>
                    <span className="text-[#0fa336] uppercase font-bold text-[12px]">{selectedReceipt.paymentStatus}</span>
                  </div>
                </div>

                <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-6">
                  <h4 className="text-[20px] font-bold text-white uppercase mb-4">
                    {selectedReceipt.vehicle.year} {selectedReceipt.vehicle.make} {selectedReceipt.vehicle.model}
                  </h4>
                  <span className="text-[12px] text-[#1c69d4] uppercase tracking-[1.5px] font-bold">{selectedReceipt.vehicle.category}</span>
                </div>

                <div className="bg-[#0d0d0d] border border-[#3c3c3c] p-6 space-y-3 text-[14px]">
                  <div className="flex justify-between text-[#bbbbbb]">
                    <span>BASE PRICE ({selectedReceipt.pricing.quantity}x)</span>
                    <span>{formatCurrency(selectedReceipt.pricing.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-[#bbbbbb]">
                    <span>DESTINATION FEE</span>
                    <span>{formatCurrency(selectedReceipt.pricing.destinationCharge)}</span>
                  </div>

                  <div className="flex justify-between text-[#bbbbbb]">
                    <span>TAX (7%)</span>
                    <span>{formatCurrency(selectedReceipt.pricing.estimatedTax)}</span>
                  </div>

                  <div className="flex justify-between text-white font-bold pt-3 border-t border-[#3c3c3c] text-[16px]">
                    <span>TOTAL PAID</span>
                    <span className="text-[#0fa336]">{formatCurrency(selectedReceipt.pricing.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
