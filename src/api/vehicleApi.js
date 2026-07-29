import api from './axios';

export const vehicleApi = {
  /**
   * Fetch all vehicles
   */
  getVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  /**
   * Search and filter vehicles
   */
  searchVehicles: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.q) params.append('q', filters.q);
    if (filters.make && filters.make !== 'All') params.append('make', filters.make);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    const response = await api.get(`/vehicles/search?${params.toString()}`);
    return response.data;
  },

  /**
   * Fetch vehicle by ID
   */
  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Create new vehicle (Admin only)
   */
  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  /**
   * Update existing vehicle (Admin only)
   */
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  /**
   * Delete vehicle (Admin only)
   */
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Purchase vehicle (decrements stock & creates transaction)
   */
  purchaseVehicle: async (id, quantity = 1) => {
    const response = await api.post(`/vehicles/${id}/purchase`, { quantity });
    return response.data;
  },

  /**
   * Restock vehicle (Admin only)
   */
  restockVehicle: async (id, amount = 10) => {
    const response = await api.post(`/vehicles/${id}/restock`, { amount });
    return response.data;
  },

  /**
   * Get all sales transaction logs (Admin only)
   */
  getAllTransactions: async () => {
    const response = await api.get('/vehicles/transactions/all');
    return response.data;
  },
};

export default vehicleApi;
