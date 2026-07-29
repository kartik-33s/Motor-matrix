import api from './axios';

export const orderApi = {
  /**
   * Fetch logged in user's order history with filters
   */
  getMyOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/orders/my-orders?${params.toString()}`);
    return response.data;
  },

  /**
   * Fetch order statistics & visual analytics data
   */
  getOrderAnalytics: async () => {
    const response = await api.get('/orders/analytics');
    return response.data;
  },

  /**
   * Fetch single order transaction receipt by ID
   */
  getOrderReceipt: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
};

export default orderApi;
