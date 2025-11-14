import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const AddTechnician = () => {
  const { addItem } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    specialization: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem('users', { ...formData, role: 'technician' });
    setFormData({ name: '', email: '', phone: '', username: '', password: '', specialization: '' });
    alert('Technician added successfully!');
  };

  return (
    <div className="w-full p-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="btn-secondary px-3 py-2 rounded flex items-center gap-2"
        >
          ← Back
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-green-400">Add New Technician</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="glass-form p-4 sm:p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Specialization</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              placeholder="e.g., Electrical, Plumbing"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full btn-primary font-bold py-2 sm:py-3 px-4 rounded"
        >
          Add Technician
        </button>
      </form>
    </div>
  );
};

export default AddTechnician;