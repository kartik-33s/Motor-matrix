import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Car, DollarSign, Image, FileText, Layers } from 'lucide-react';

const CATEGORIES = ['Electric', 'Sports', 'Sedan', 'SUV', 'Truck', 'Luxury'];

const AdminVehicleForm = ({ initialData = null, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    stock: 5,
    category: 'Electric',
    image_url: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        make: initialData.make || '',
        model: initialData.model || '',
        year: initialData.year || new Date().getFullYear(),
        price: initialData.price || '',
        stock: initialData.stock !== undefined ? initialData.stock : 5,
        category: initialData.category || 'Electric',
        image_url: initialData.image_url || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.price) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isEditing ? 'Edit Vehicle Specifications' : 'Add New Inventory Vehicle'}
              </h3>
              <p className="text-xs text-gray-400">
                {isEditing ? 'Update price, stock count, or specification details' : 'Register a new vehicle into dealership inventory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Manufacturer / Make *
              </label>
              <input
                type="text"
                name="make"
                required
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Porsche, Tesla, BMW"
                className="w-full bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Model Designation *
              </label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. 911 GT3, Model S"
                className="w-full bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Model Year
              </label>
              <input
                type="number"
                name="year"
                required
                min="1990"
                max="2100"
                value={formData.year}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Price ($ USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="89990"
                  className="w-full bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Initial Stock Units
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Image URL
            </label>
            <div className="relative">
              <Image className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Vehicle Specification Summary
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe powertrain, performance specs, interior trim..."
              className="w-full bg-gray-900 border border-gray-800 focus:border-purple-500 rounded-xl p-3 text-sm text-white placeholder-gray-500 outline-none transition-all resize-none"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-800 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Vehicle'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVehicleForm;
