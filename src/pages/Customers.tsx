import { useState } from 'react';
import { useApp } from '../context/AppContext';

const Customers = () => {
  const { data, addItem, updateItem, deleteItem, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    assignedTo: '',
    assignedType: 'partner'
  });

  const canManageCustomers = ['admin', 'partner'].includes(currentUser?.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await updateItem('customers', editingCustomer.id, formData);
      } else {
        await addItem('customers', formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      assignedTo: '',
      assignedType: 'partner'
    });
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer: any) => {
    setFormData(customer);
    setEditingCustomer(customer);
    setShowForm(true);
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customers</h2>
        {canManageCustomers && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base"
          >
            Add Customer
          </button>
        )}
      </div>

      {showForm && canManageCustomers && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCustomer ? 'Edit Customer' : 'Add Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.name}
              onChange={(e: any) => setFormData({...formData, name: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e: any) => setFormData({...formData, email: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
            <select
              value={formData.assignedType}
              onChange={(e: any) => setFormData({...formData, assignedType: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="partner">Partner</option>
              <option value="technician">Technician</option>
            </select>
            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e: any) => setFormData({...formData, address: e.target.value})}
              className="md:col-span-2 p-3 border border-gray-300 rounded-lg"
              rows={3}
            />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {editingCustomer ? 'Update Customer' : 'Add Customer'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="block sm:hidden space-y-3">
        {data.customers?.map((customer: any) => (
          <div key={customer.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{customer.name}</h3>
              {canManageCustomers && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem('customers', customer.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
            <p className="text-sm text-gray-600 mb-1">{customer.phone}</p>
            <p className="text-xs text-gray-500">{customer.assignedTo} ({customer.assignedType})</p>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium">Name</th>
              <th className="p-3 text-left text-sm font-medium">Email</th>
              <th className="p-3 text-left text-sm font-medium">Phone</th>
              <th className="p-3 text-left text-sm font-medium">Assigned To</th>
              {canManageCustomers && <th className="p-3 text-left text-sm font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.customers?.map((customer: any) => (
              <tr key={customer.id} className="border-t">
                <td className="p-3 text-sm">{customer.name}</td>
                <td className="p-3 text-sm">{customer.email}</td>
                <td className="p-3 text-sm">{customer.phone}</td>
                <td className="p-3 text-sm">{customer.assignedTo} ({customer.assignedType})</td>
                {canManageCustomers && (
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('customers', customer.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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

export default Customers;