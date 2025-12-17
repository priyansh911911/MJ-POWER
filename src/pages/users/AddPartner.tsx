import { useState } from 'react';
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addItem('users', { ...formData, role: 'partner' });
    setFormData({ name: '', email: '', phone: '', username: '', password: '', company: '', territory: '' });
    alert('Partner added successfully!');
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
        <h2 className="text-xl sm:text-2xl font-bold text-green-400">Add New Partner</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="glass-form p-4 sm:p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e: any) => setFormData({...formData, name: e.target.value})}
              className="glass-input w-full px-3 py-2 rounded placeholder-green-300/50"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e: any) => setFormData({...formData, email: e.target.value})}
              className="glass-input w-full px-3 py-2 rounded placeholder-green-300/50"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
              className="glass-input w-full px-3 py-2 rounded placeholder-green-300/50"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e: any) => setFormData({...formData, username: e.target.value})}
              className="glass-input w-full px-3 py-2 rounded placeholder-green-300/50"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e: any) => setFormData({...formData, password: e.target.value})}
              className="glass-input w-full px-3 py-2 rounded placeholder-green-300/50"
              required
            />
          </div>
          
          <div>
            <label className="block text-green-300 text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e: any) => setFormData({...formData, company: e.target.value})}
              className="glass-input w-full px-3 py-2 rounded placeholder-green-300/50"
              placeholder="Partner company name"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-green-300 text-sm font-medium mb-2">Territory</label>
            <input
              type="text"
              value={formData.territory}
              onChange={(e: any) => setFormData({...formData, territory: e.target.value})}
              className="glass-input w-full px-3 py-2 rounded placeholder-green-300/50"
              placeholder="Assigned territory or region"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full btn-primary font-bold py-2 sm:py-3 px-4 rounded"
        >
          Add Partner
        </button>
      </form>
    </div>
  );
};

export default AddPartner;