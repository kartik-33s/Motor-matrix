import React, { useState, useEffect } from 'react';
import { X, Save, Car, DollarSign, Image } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a1a1a] max-w-3xl w-full relative my-8">

        {/* M Stripe */}
        <div className="h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718]"></div>

        <div className="p-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#1c69d4] flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-[32px] font-bold text-white uppercase leading-none mb-2">
                {isEditing ? 'EDIT VEHICLE' : 'ADD VEHICLE'}
              </h3>
              <p className="text-[14px] text-[#7e7e7e] font-light">
                {isEditing ? 'Update specification details' : 'Register new inventory vehicle'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#7e7e7e] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Make */}
              <div>
                <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                  MANUFACTURER *
                </label>
                <input
                  type="text"
                  name="make"
                  required
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="PORSCHE, TESLA, BMW"
                  className="w-full bg-[#0d0d0d] border border-[#3c3c3c] focus:border-[#ffffff] px-4 py-3 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all uppercase font-light"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                  MODEL *
                </label>
                <input
                  type="text"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="911 GT3, MODEL S"
                  className="w-full bg-[#0d0d0d] border border-[#3c3c3c] focus:border-[#ffffff] px-4 py-3 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all uppercase font-light"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Year */}
              <div>
                <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                  YEAR *
                </label>
                <input
                  type="number"
                  name="year"
                  required
                  min="1990"
                  max="2100"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-[#0d0d0d] border border-[#3c3c3c] focus:border-[#ffffff] px-4 py-3 text-[14px] text-white outline-none transition-all font-light"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                  PRICE ($) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-[#7e7e7e] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="89990"
                    className="w-full bg-[#0d0d0d] border border-[#3c3c3c] focus:border-[#ffffff] pl-10 pr-4 py-3 text-[14px] text-white outline-none transition-all font-light"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                  STOCK *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full bg-[#0d0d0d] border border-[#3c3c3c] focus:border-[#ffffff] px-4 py-3 text-[14px] text-white outline-none transition-all font-light"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                CATEGORY *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0d0d0d] border border-[#3c3c3c] text-white text-[14px] px-4 py-3 outline-none focus:border-[#ffffff] transition-colors uppercase font-light"
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
              <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                IMAGE URL
              </label>
              <div className="relative">
                <Image className="w-4 h-4 text-[#7e7e7e] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#0d0d0d] border border-[#3c3c3c] focus:border-[#ffffff] pl-10 pr-4 py-3 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all font-light"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
                DESCRIPTION
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="POWERTRAIN, PERFORMANCE SPECS, INTERIOR TRIM..."
                className="w-full bg-[#0d0d0d] border border-[#3c3c3c] focus:border-[#ffffff] p-4 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all resize-none uppercase font-light"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#3c3c3c]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-[#1a1a1a] border border-[#3c3c3c] text-[#bbbbbb] text-[14px] font-bold uppercase tracking-[1.5px] hover:text-white hover:border-white transition-all"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#000000] border border-[#ffffff] text-white text-[14px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? 'SAVE' : 'CREATE'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminVehicleForm;
