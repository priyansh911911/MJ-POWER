import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Tickets = () => {
  const { data, addItem, updateItem, deleteItem, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    assignedTo: '',
    customerId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticketData = {
      ...formData,
      createdBy: currentUser?.id,
      createdAt: new Date().toISOString()
    };
    
    if (editingTicket) {
      updateItem('tickets', editingTicket.id, ticketData);
    } else {
      addItem('tickets', ticketData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'open',
      assignedTo: '',
      customerId: ''
    });
    setShowForm(false);
    setEditingTicket(null);
  };

  const handleEdit = (ticket) => {
    setFormData(ticket);
    setEditingTicket(ticket);
    setShowForm(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Create Ticket
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingTicket ? 'Edit Ticket' : 'Create Ticket'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ticket Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg"
              required
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Customer</option>
              {data.customers?.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="md:col-span-2 p-3 border border-gray-300 rounded-lg"
              rows="4"
              required
            />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                {editingTicket ? 'Update' : 'Create'} Ticket
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
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.tickets?.map(ticket => {
              const customer = data.customers?.find(c => c.id == ticket.customerId);
              return (
                <tr key={ticket.id} className="border-t">
                  <td className="p-3">{ticket.title}</td>
                  <td className="p-3">{customer?.name || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(ticket)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem('tickets', ticket.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tickets;