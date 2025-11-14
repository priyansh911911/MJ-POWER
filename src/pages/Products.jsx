import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Products = () => {
  const { data, addItem, updateItem, deleteItem, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    gstPercent: '',
    partnerCommissionPercent: '',
    technicianCommissionPercent: ''
  });

  const canManageProducts = ['admin', 'manager'].includes(currentUser?.role);
  const productCategories = data.categories.filter(c => c.type === 'product');

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      gstPercent: parseFloat(formData.gstPercent),
      partnerCommissionPercent: parseFloat(formData.partnerCommissionPercent),
      technicianCommissionPercent: parseFloat(formData.technicianCommissionPercent)
    };
    
    if (editingProduct) {
      updateItem('products', editingProduct.id, productData);
    } else {
      addItem('products', productData);
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
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-green-400">Products</h2>
        {canManageProducts && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-3 py-1.5 rounded w-full sm:w-auto text-sm"
          >
            Add Product
          </button>
        )}
      </div>

      {showForm && canManageProducts && (
        <div className="glass-form p-3 sm:p-4 rounded-lg mb-4">
          <h3 className="text-base font-semibold text-green-400 mb-3">
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 focus:bg-gray-600 transition-all duration-200 rounded border border-green-600 outline-none text-sm"
              required
            >
              <option value="" className="bg-gray-700 text-green-100">Select Category</option>
              {productCategories.map(cat => (
                <option key={cat.id} value={cat.name} className="bg-gray-700 text-green-100">{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="GST %"
              value={formData.gstPercent}
              onChange={(e) => setFormData({...formData, gstPercent: e.target.value})}
              className="p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Partner Commission %"
              value={formData.partnerCommissionPercent}
              onChange={(e) => setFormData({...formData, partnerCommissionPercent: e.target.value})}
              className="p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Technician Commission %"
              value={formData.technicianCommissionPercent}
              onChange={(e) => setFormData({...formData, technicianCommissionPercent: e.target.value})}
              className="p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
              <button type="submit" className="btn-primary px-3 py-1.5 rounded text-sm">
                {editingProduct ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary px-3 py-1.5 rounded text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block glass-table rounded-lg">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="p-2 text-left text-green-400 text-sm">Name</th>
              <th className="p-2 text-left text-green-400 text-sm">Category</th>
              <th className="p-2 text-left text-green-400 text-sm">Price</th>
              <th className="p-2 text-left text-green-400 text-sm">GST %</th>
              <th className="p-2 text-left text-green-400 text-sm">Partner %</th>
              <th className="p-2 text-left text-green-400 text-sm">Tech %</th>
              {canManageProducts && <th className="p-2 text-left text-green-400 text-sm">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.products.map(product => (
              <tr key={product.id} className="border-t border-white/10">
                <td className="p-2 text-green-100 text-sm">{product.name}</td>
                <td className="p-2 text-green-100 text-sm">{product.category}</td>
                <td className="p-2 text-green-100 text-sm">₹{product.price}</td>
                <td className="p-2 text-green-100 text-sm">{product.gstPercent}%</td>
                <td className="p-2 text-green-100 text-sm">{product.partnerCommissionPercent}%</td>
                <td className="p-2 text-green-100 text-sm">{product.technicianCommissionPercent}%</td>
                {canManageProducts && (
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn-info px-2 py-1 rounded mr-1 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('products', product.id)}
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
        {data.products.map(product => (
          <div key={product.id} className="mobile-card p-3 rounded-lg">
            <div className="space-y-2">
              <div>
                <span className="text-green-400 font-semibold">Name: </span>
                <span className="text-green-100">{product.name}</span>
              </div>
              <div>
                <span className="text-green-400 font-semibold">Category: </span>
                <span className="text-green-100">{product.category}</span>
              </div>
              <div>
                <span className="text-green-400 font-semibold">Price: </span>
                <span className="text-green-100">₹{product.price}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-green-400 font-semibold">GST: </span>
                  <span className="text-green-100">{product.gstPercent}%</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Partner: </span>
                  <span className="text-green-100">{product.partnerCommissionPercent}%</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Tech: </span>
                  <span className="text-green-100">{product.technicianCommissionPercent}%</span>
                </div>
              </div>
              {canManageProducts && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn-info px-2 py-1 rounded flex-1 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem('products', product.id)}
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

export default Products;