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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        {canManageCustomers && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Assigned To</th>
              {canManageCustomers && <th className="p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.customers?.map((customer: any) => (
              <tr key={customer.id} className="border-t">
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer.phone}</td>
                <td className="p-3">{customer.assignedTo} ({customer.assignedType})</td>
                {canManageCustomers && (
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('customers', customer.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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