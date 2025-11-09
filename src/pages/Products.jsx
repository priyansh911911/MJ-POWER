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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-400">Products</h2>
        {canManageProducts && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Add Product
          </button>
        )}
      </div>

      {showForm && canManageProducts && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-green-600">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
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
              {productCategories.map(cat => (
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
                {editingProduct ? 'Update' : 'Add'}
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
              {canManageProducts && <th className="p-4 text-left text-green-400">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.products.map(product => (
              <tr key={product.id} className="border-t border-gray-700">
                <td className="p-4 text-green-100">{product.name}</td>
                <td className="p-4 text-green-100">{product.category}</td>
                <td className="p-4 text-green-100">₹{product.price}</td>
                <td className="p-4 text-green-100">{product.gstPercent}%</td>
                <td className="p-4 text-green-100">{product.partnerCommissionPercent}%</td>
                <td className="p-4 text-green-100">{product.technicianCommissionPercent}%</td>
                {canManageProducts && (
                  <td className="p-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('products', product.id)}
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

export default Products;