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
    gstPercent: '',
    partnerCommissionPercent: '',
    technicianCommissionPercent: ''
  });

  const canManageServices = ['admin', 'manager'].includes(currentUser?.role);
  const serviceCategories = data.categories.filter(c => c.type === 'service');

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      price: parseFloat(formData.price),
      gstPercent: parseFloat(formData.gstPercent),
      partnerCommissionPercent: parseFloat(formData.partnerCommissionPercent),
      technicianCommissionPercent: parseFloat(formData.technicianCommissionPercent)
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
      gstPercent: '',
      partnerCommissionPercent: '',
      technicianCommissionPercent: ''
    });
    setShowForm(false);
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setFormData(service);
    setEditingService(service);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-400">Services</h2>
        {canManageServices && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Add Service
          </button>
        )}
      </div>

      {showForm && canManageServices && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-green-600">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            {editingService ? 'Edit Service' : 'Add Service'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              required
            >
              <option value="">Select Category</option>
              {serviceCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="GST %"
              value={formData.gstPercent}
              onChange={(e) => setFormData({...formData, gstPercent: e.target.value})}
              className="p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Partner Commission %"
              value={formData.partnerCommissionPercent}
              onChange={(e) => setFormData({...formData, partnerCommissionPercent: e.target.value})}
              className="p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Technician Commission %"
              value={formData.technicianCommissionPercent}
              onChange={(e) => setFormData({...formData, technicianCommissionPercent: e.target.value})}
              className="p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              required
            />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">
                {editingService ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg border border-green-600">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-left text-green-400">Name</th>
              <th className="p-4 text-left text-green-400">Category</th>
              <th className="p-4 text-left text-green-400">Price</th>
              <th className="p-4 text-left text-green-400">GST %</th>
              <th className="p-4 text-left text-green-400">Partner %</th>
              <th className="p-4 text-left text-green-400">Tech %</th>
              {canManageServices && <th className="p-4 text-left text-green-400">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.services.map(service => (
              <tr key={service.id} className="border-t border-gray-700">
                <td className="p-4 text-green-100">{service.name}</td>
                <td className="p-4 text-green-100">{service.category}</td>
                <td className="p-4 text-green-100">₹{service.price}</td>
                <td className="p-4 text-green-100">{service.gstPercent}%</td>
                <td className="p-4 text-green-100">{service.partnerCommissionPercent}%</td>
                <td className="p-4 text-green-100">{service.technicianCommissionPercent}%</td>
                {canManageServices && (
                  <td className="p-4">
                    <button
                      onClick={() => handleEdit(service)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('services', service.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
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
    </div>
  );
};

export default Services;