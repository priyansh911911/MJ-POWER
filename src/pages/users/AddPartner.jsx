import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const AddPartner = () => {
  const { addItem } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    company: '',
    territory: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem('users', { ...formData, role: 'partner' });
    setFormData({ name: '', email: '', phone: '', username: '', password: '', company: '', territory: '' });
    alert('Partner added successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-6">Add New Partner</h2>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-green-600 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 text-green-100"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 text-green-100"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 text-green-100"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 text-green-100"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 text-green-100"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 text-green-100"
              placeholder="Partner company name"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-green-300 text-sm font-medium mb-2">Territory</label>
            <input
              type="text"
              value={formData.territory}
              onChange={(e) => setFormData({...formData, territory: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-green-500 text-green-100"
              placeholder="Assigned territory or region"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 rounded transition-colors"
        >
          Add Partner
        </button>
      </form>
    </div>
  );
};

export default AddPartner;