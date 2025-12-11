import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Customers = () => {
  const { data, addItem, updateItem, deleteItem, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    assignedTo: '',
    assignedType: 'partner'
  });

  const partners = data.users.filter(u => u.role === 'partner');
  const technicians = data.users.filter(u => u.role === 'technician');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      updateItem('customers', editingCustomer.id, formData);
    } else {
      addItem('customers', formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', email: '', address: '', assignedTo: '', assignedType: 'partner' });
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const canManageCustomers = ['admin', 'manager', 'partner'].includes(currentUser?.role);

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 relative z-10">
        <h2 className="text-lg sm:text-xl font-bold text-green-400">Customers</h2>
        {canManageCustomers && (
          <button
            onClick={() => {
              console.log('Add Customer clicked');
              setShowForm(true);
            }}
            className="btn-primary px-4 py-2 rounded w-full sm:w-auto text-sm whitespace-nowrap"
          >
            Add Customer
          </button>
        )}
      </div>

      {showForm && canManageCustomers && (
        <div className="glass-form p-3 sm:p-4 rounded-lg mb-4 relative z-10">
          <h3 className="text-base font-semibold text-green-400 mb-3">
            {editingCustomer ? 'Edit Customer' : 'Add Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email (for customer login)"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              required
            />
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none sm:col-span-2"
              rows="3"
            />
            <div>
              <label className="block text-green-300 text-sm mb-1">Assign Type</label>
              <select
                value={formData.assignedType}
                onChange={(e) => setFormData({...formData, assignedType: e.target.value, assignedTo: ''})}
                className="w-full p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              >
                <option value="partner">Partner</option>
                <option value="technician">Technician</option>
              </select>
            </div>
            <div>
              <label className="block text-green-300 text-sm mb-1">Assign To</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                className="w-full p-3 bg-white/5 backdrop-blur-sm text-green-100 focus:bg-white/10 transition-all duration-200 rounded border-0 outline-none"
              >
                <option value="">Select {formData.assignedType}</option>
                {(formData.assignedType === 'partner' ? partners : technicians).map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
              <button type="submit" className="btn-primary px-4 py-2 rounded">
                {editingCustomer ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary px-4 py-2 rounded">
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
              <th className="p-2 text-left text-green-400 text-sm">Phone</th>
              <th className="p-2 text-left text-green-400 text-sm">Email</th>
              <th className="p-2 text-left text-green-400 text-sm">Address</th>
              <th className="p-2 text-left text-green-400 text-sm">Assigned To</th>
              {canManageCustomers && <th className="p-2 text-left text-green-400 text-sm">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.customers.map(customer => {
              const assignedUser = data.users.find(u => u.id == customer.assignedTo);
              return (
                <tr key={customer.id} className="border-t border-white/10">
                  <td className="p-2 text-green-100 text-sm">{customer.name}</td>
                  <td className="p-2 text-green-100 text-sm">{customer.phone}</td>
                  <td className="p-2 text-green-100 text-sm">{customer.email}</td>
                  <td className="p-2 text-green-100 text-sm">{customer.address}</td>
                  <td className="p-2 text-green-100 text-sm">
                    {assignedUser ? `${assignedUser.name} (${assignedUser.role})` : 'Unassigned'}
                  </td>
                  {canManageCustomers && (
                    <td className="p-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="btn-info px-2 py-1 rounded mr-1 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem('customers', customer.id)}
                        className="btn-danger px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {data.customers.map(customer => {
          const assignedUser = data.users.find(u => u.id == customer.assignedTo);
          return (
            <div key={customer.id} className="mobile-card p-3 rounded-lg">
              <div className="space-y-2">
                <div>
                  <span className="text-green-400 font-semibold">Name: </span>
                  <span className="text-green-100">{customer.name}</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Phone: </span>
                  <span className="text-green-100">{customer.phone}</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Email: </span>
                  <span className="text-green-100">{customer.email}</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Address: </span>
                  <span className="text-green-100">{customer.address}</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Assigned To: </span>
                  <span className="text-green-100">
                    {assignedUser ? `${assignedUser.name} (${assignedUser.role})` : 'Unassigned'}
                  </span>
                </div>
                {canManageCustomers && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="btn-info px-2 py-1 rounded flex-1 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('customers', customer.id)}
                      className="btn-danger px-2 py-1 rounded flex-1 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Customers;