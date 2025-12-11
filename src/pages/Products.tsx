import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { uploadImage, getImageUrl } from '../services/Api';

const Products = () => {
  const { data, addItem, updateItem, deleteItem, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    specifications: '',
    image: '',
    gstPercent: '18',
    partnerCommissionPercent: '10',
    technicianCommissionPercent: '5'
  });
  const [uploading, setUploading] = useState(false);

  const canManageProducts = ['admin', 'manager'].includes(currentUser?.role);
  const productCategories = data.categories?.filter(c => c.type === 'product') || [];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData({...formData, image: imageUrl});
    } catch (error) {
      alert('Image upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description || '',
      specifications: formData.specifications || '',
      image: formData.image || '',
      gstPercent: parseFloat(formData.gstPercent),
      partnerCommissionPercent: parseFloat(formData.partnerCommissionPercent),
      technicianCommissionPercent: parseFloat(formData.technicianCommissionPercent)
    };
    
    console.log('Submitting product data:', productData);
    
    try {
      if (editingProduct) {
        await updateItem('products', editingProduct.id, productData);
        console.log('Product updated successfully');
      } else {
        const result = await addItem('products', productData);
        console.log('Product added successfully:', result);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Check console for details.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      specifications: '',
      image: '',
      gstPercent: '18',
      partnerCommissionPercent: '10',
      technicianCommissionPercent: '5'
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-yellow-300 flex items-center">
          <span className="mr-2">🔋</span> Solar Products
        </h2>
        {canManageProducts && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all w-full sm:w-auto whitespace-nowrap"
          >
            + Add Product
          </button>
        )}
      </div>

      {showForm && canManageProducts && (
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 p-4 sm:p-6 rounded-xl mb-4 shadow-lg relative z-10">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">
            {editingProduct ? 'Edit Solar Product' : 'Add Solar Product'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name (e.g., Solar Panel 500W)"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              required
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 outline-none transition-all"
              />
              {uploading && <p className="text-yellow-300 text-sm mt-1">Uploading...</p>}
              {formData.image && <img src={getImageUrl(formData.image)} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />}
            </div>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              required
            >
              <option value="">Select Category</option>
              {productCategories.map((cat, index) => (
                <option key={cat.id || index} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Price (₹)"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              required
            />
            <textarea
              placeholder="Product Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              rows="3"
            />
            <textarea
              placeholder="Technical Specifications"
              value={formData.specifications}
              onChange={(e) => setFormData({...formData, specifications: e.target.value})}
              className="p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              rows="2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="GST %"
              value={formData.gstPercent}
              onChange={(e) => setFormData({...formData, gstPercent: e.target.value})}
              className="p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Partner Commission %"
              value={formData.partnerCommissionPercent}
              onChange={(e) => setFormData({...formData, partnerCommissionPercent: e.target.value})}
              className="p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Technician Commission %"
              value={formData.technicianCommissionPercent}
              onChange={(e) => setFormData({...formData, technicianCommissionPercent: e.target.value})}
              className="p-3 bg-white/10 text-white rounded-lg border border-blue-300/30 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
            />
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
              <button type="submit" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white/10 backdrop-blur-xl border border-yellow-400/30 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3 text-left text-yellow-300 font-semibold">Product Name</th>
              <th className="p-3 text-left text-yellow-300 font-semibold">Category</th>
              <th className="p-3 text-left text-yellow-300 font-semibold">Price</th>
              <th className="p-3 text-left text-yellow-300 font-semibold">GST %</th>
              <th className="p-3 text-left text-yellow-300 font-semibold">Partner %</th>
              <th className="p-3 text-left text-yellow-300 font-semibold">Tech %</th>
              {canManageProducts && <th className="p-3 text-left text-yellow-300 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.products?.length > 0 ? (
              data.products.map(product => (
                <tr key={product.id} className="border-t border-blue-300/20 hover:bg-white/5 transition-all">
                  <td className="p-3 text-white">
                    <div className="flex items-center gap-2">
                      {product.image && <img src={getImageUrl(product.image)} alt={product.name} className="h-10 w-10 object-cover rounded" />}
                      {product.name}
                    </div>
                  </td>
                  <td className="p-3 text-blue-100">{product.category}</td>
                  <td className="p-3 text-green-300 font-semibold">₹{product.price}</td>
                  <td className="p-3 text-blue-100">{product.gstPercent}%</td>
                  <td className="p-3 text-blue-100">{product.partnerCommissionPercent}%</td>
                  <td className="p-3 text-blue-100">{product.technicianCommissionPercent}%</td>
                  {canManageProducts && (
                    <td className="p-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg mr-2 text-sm transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem('products', product.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-blue-200">
                  No solar products added yet. Click "Add Product" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.products?.length > 0 ? (
          data.products.map(product => (
            <div key={product.id} className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 p-4 rounded-xl shadow-lg">
              <div className="space-y-2">
                {product.image && <img src={getImageUrl(product.image)} alt={product.name} className="h-32 w-full object-cover rounded" />}
                <div>
                  <span className="text-yellow-300 font-semibold">Product: </span>
                  <span className="text-white">{product.name}</span>
                </div>
                <div>
                  <span className="text-yellow-300 font-semibold">Category: </span>
                  <span className="text-blue-100">{product.category}</span>
                </div>
                <div>
                  <span className="text-yellow-300 font-semibold">Price: </span>
                  <span className="text-green-300 font-bold">₹{product.price}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-yellow-300 font-semibold">GST: </span>
                    <span className="text-blue-100">{product.gstPercent}%</span>
                  </div>
                  <div>
                    <span className="text-yellow-300 font-semibold">Partner: </span>
                    <span className="text-blue-100">{product.partnerCommissionPercent}%</span>
                  </div>
                  <div>
                    <span className="text-yellow-300 font-semibold">Tech: </span>
                    <span className="text-blue-100">{product.technicianCommissionPercent}%</span>
                  </div>
                </div>
                {canManageProducts && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex-1 text-sm transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('products', product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex-1 text-sm transition-all"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 p-6 rounded-xl text-center text-blue-200">
            No solar products added yet. Click "Add Product" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
