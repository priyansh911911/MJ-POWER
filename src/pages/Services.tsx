import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Services = () => {
  const { data, addItem, updateItem, deleteItem, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    duration: '',
    includes: ''
  });

  const canManageServices = ['admin', 'manager'].includes(currentUser?.role);
  const serviceCategories = data.categories.filter(c => c.type === 'service');

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      duration: formData.duration,
      includes: formData.includes
    };
    
    if (editingService) {
      updateItem('services', editingService.id, serviceData);
    } else {
      addItem('services', serviceData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      duration: '',
      includes: ''
    });
    setShowForm(false);
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name || '',
      category: service.category || '',
      price: service.price?.toString() || '',
      description: service.description || '',
      duration: service.duration || '',
      includes: service.includes || ''
    });
    setEditingService(service);
    setShowForm(true);
  };

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 relative z-10">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Services</h2>
        {canManageServices && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-4 py-2 rounded w-full sm:w-auto text-sm whitespace-nowrap"
          >
            Add Service
          </button>
        )}
      </div>

      {showForm && canManageServices && (
        <div className="glass-form p-3 sm:p-4 rounded-lg mb-4 relative z-10">
          <h3 className="text-base font-semibold text-green-400 mb-3">
            {editingService ? 'Edit Service' : 'Add Service'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm"
              required
            >
              <option value="" className="bg-gray-700 text-green-100">Select Category</option>
              {serviceCategories.map(cat => (
                <option key={cat.id} value={cat.name} className="bg-gray-700 text-green-100">{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2-3 hours)"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm"
              rows="2"
            />
            <textarea
              placeholder="What's included"
              value={formData.includes}
              onChange={(e) => setFormData({...formData, includes: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 rounded border border-green-600 text-sm"
              rows="2"
            />
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
              <button type="submit" className="btn-primary px-3 py-1.5 rounded text-sm">
                {editingService ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary px-3 py-1.5 rounded text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left text-gray-900 text-sm">Name</th>
              <th className="p-2 text-left text-gray-900 text-sm">Category</th>
              <th className="p-2 text-left text-gray-900 text-sm">Price</th>
              <th className="p-2 text-left text-gray-900 text-sm">Duration</th>
              <th className="p-2 text-left text-gray-900 text-sm">Description</th>
              {canManageServices && <th className="p-2 text-left text-gray-900 text-sm">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.services?.map(service => (
              <tr key={service.id} className="border-t border-gray-200">
                <td className="p-2 text-gray-900 text-sm">{service.name}</td>
                <td className="p-2 text-gray-700 text-sm">{service.category}</td>
                <td className="p-2 text-green-600 text-sm">₹{service.price}</td>
                <td className="p-2 text-gray-700 text-sm">{service.duration}</td>
                <td className="p-2 text-gray-700 text-sm">{service.description}</td>
                {canManageServices && (
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="btn-info px-2 py-1 rounded mr-1 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('services', service.id)}
                      className="btn-danger px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {data.services?.map(service => (
          <div key={service.id} className="bg-white border border-gray-200 p-3 rounded-lg">
            <div className="space-y-2">
              <div>
                <span className="text-gray-700 font-semibold">Name: </span>
                <span className="text-gray-900">{service.name}</span>
              </div>
              <div>
                <span className="text-gray-700 font-semibold">Category: </span>
                <span className="text-gray-800">{service.category}</span>
              </div>
              <div>
                <span className="text-gray-700 font-semibold">Price: </span>
                <span className="text-green-600">₹{service.price}</span>
              </div>
              <div>
                <span className="text-gray-700 font-semibold">Duration: </span>
                <span className="text-gray-800">{service.duration}</span>
              </div>
              <div>
                <span className="text-gray-700 font-semibold">Description: </span>
                <span className="text-gray-800">{service.description}</span>
              </div>
              <div>
                <span className="text-gray-700 font-semibold">Includes: </span>
                <span className="text-gray-800">{service.includes}</span>
              </div>
              {canManageServices && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="btn-info px-2 py-1 rounded flex-1 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem('services', service.id)}
                    className="btn-danger px-2 py-1 rounded flex-1 text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;