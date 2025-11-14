import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Tickets = () => {
  const { data, addItem, updateItem, deleteItem, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    customerId: '',
    type: 'product',
    itemId: '',
    issue: '',
    assignedTo: '',
    status: 'open',
    notes: ''
  });

  const canCreateTickets = ['admin', 'manager', 'partner'].includes(currentUser?.role);
  const canManageTickets = ['admin', 'manager'].includes(currentUser?.role);
  const canUpdateTickets = ['admin', 'manager', 'technician'].includes(currentUser?.role);

  const getFilteredTickets = () => {
    if (currentUser?.role === 'technician') {
      return data.tickets.filter(ticket => ticket.assignedTo == currentUser.id);
    }
    if (currentUser?.role === 'partner') {
      const myCustomers = data.customers.filter(c => c.assignedTo == currentUser.id);
      return data.tickets.filter(ticket => 
        myCustomers.some(c => c.id == ticket.customerId)
      );
    }
    return data.tickets;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticketData = {
      ...formData,
      createdBy: currentUser.id,
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
      customerId: '',
      type: 'product',
      itemId: '',
      issue: '',
      assignedTo: '',
      status: 'open',
      notes: ''
    });
    setShowForm(false);
    setEditingTicket(null);
  };

  const handleEdit = (ticket) => {
    setFormData(ticket);
    setEditingTicket(ticket);
    setShowForm(true);
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    updateItem('tickets', ticketId, { status: newStatus });
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-yellow-600',
      'in-progress': 'bg-blue-600',
      completed: 'bg-green-600',
      closed: 'bg-gray-600'
    };
    return colors[status] || 'bg-gray-600';
  };

  const filteredTickets = getFilteredTickets();

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-green-400">
          {currentUser?.role === 'technician' ? 'My Tickets' : 'Tickets'}
        </h2>
        {canCreateTickets && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-3 py-1.5 rounded w-full sm:w-auto text-sm"
          >
            Raise Ticket
          </button>
        )}
      </div>

      {showForm && canCreateTickets && (
        <div className="glass-form p-3 sm:p-4 rounded-lg mb-4">
          <h3 className="text-base font-semibold text-green-400 mb-3">
            {editingTicket ? 'Edit Ticket' : 'Raise Ticket'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 focus:bg-gray-600 transition-all duration-200 rounded border border-green-600 outline-none text-sm"
              required
            >
              <option value="" className="bg-gray-700 text-green-100">Select Customer</option>
              {data.customers.map(customer => (
                <option key={customer.id} value={customer.id} className="bg-gray-700 text-green-100">{customer.name}</option>
              ))}
            </select>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value, itemId: ''})}
              className="p-2 bg-gray-700 text-green-100 focus:bg-gray-600 transition-all duration-200 rounded border border-green-600 outline-none text-sm"
            >
              <option value="product" className="bg-gray-700 text-green-100">Product</option>
              <option value="service" className="bg-gray-700 text-green-100">Service</option>
            </select>
            <select
              value={formData.itemId}
              onChange={(e) => setFormData({...formData, itemId: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 focus:bg-gray-600 transition-all duration-200 rounded border border-green-600 outline-none text-sm"
              required
            >
              <option value="" className="bg-gray-700 text-green-100">Select {formData.type}</option>
              {(formData.type === 'product' ? data.products : data.services).map(item => (
                <option key={item.id} value={item.id} className="bg-gray-700 text-green-100">{item.name}</option>
              ))}
            </select>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 focus:bg-gray-600 transition-all duration-200 rounded border border-green-600 outline-none text-sm"
              required
            >
              <option value="" className="bg-gray-700 text-green-100">Assign Technician</option>
              {data.users.filter(u => u.role === 'technician').map(tech => (
                <option key={tech.id} value={tech.id} className="bg-gray-700 text-green-100">{tech.name}</option>
              ))}
            </select>
            <textarea
              placeholder="Issue Description"
              value={formData.issue}
              onChange={(e) => setFormData({...formData, issue: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 focus:bg-gray-600 transition-all duration-200 rounded border border-green-600 outline-none text-sm sm:col-span-2"
              rows="3"
              required
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="p-2 bg-gray-700 text-green-100 focus:bg-gray-600 transition-all duration-200 rounded border border-green-600 outline-none text-sm sm:col-span-2"
              rows="2"
            />
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
              <button type="submit" className="btn-primary px-4 py-2 rounded">
                {editingTicket ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block glass-table rounded-lg">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="p-2 text-left text-green-400 text-sm">ID</th>
              <th className="p-2 text-left text-green-400 text-sm">Customer</th>
              <th className="p-2 text-left text-green-400 text-sm">Item</th>
              <th className="p-2 text-left text-green-400 text-sm">Issue</th>
              <th className="p-2 text-left text-green-400 text-sm">Assigned To</th>
              <th className="p-2 text-left text-green-400 text-sm">Status</th>
              <th className="p-2 text-left text-green-400 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => {
              const customer = data.customers.find(c => c.id == ticket.customerId);
              const item = (ticket.type === 'product' ? data.products : data.services)
                .find(i => i.id == ticket.itemId);
              const assignedUser = data.users.find(u => u.id == ticket.assignedTo);
              
              return (
                <tr key={ticket.id} className="border-t border-gray-700">
                  <td className="p-2 text-green-100 text-sm">#{ticket.id}</td>
                  <td className="p-2 text-green-100 text-sm">{customer?.name}</td>
                  <td className="p-2 text-green-100 text-sm">{item?.name} ({ticket.type})</td>
                  <td className="p-2 text-green-100 text-sm">{ticket.issue}</td>
                  <td className="p-2 text-green-100 text-sm">{assignedUser?.name}</td>
                  <td className="p-2">
                    <span className={`px-1.5 py-0.5 rounded text-white text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {canUpdateTickets && (
                      <select
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                        className="bg-gray-700 text-green-100 rounded border border-green-600 p-1 mr-1 text-xs"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                      </select>
                    )}
                    {canManageTickets && (
                      <>
                        <button
                          onClick={() => handleEdit(ticket)}
                          className="btn-info px-2 py-1 rounded mr-1 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem('tickets', ticket.id)}
                          className="btn-danger px-2 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-2">
        {filteredTickets.map(ticket => {
          const customer = data.customers.find(c => c.id == ticket.customerId);
          const item = (ticket.type === 'product' ? data.products : data.services)
            .find(i => i.id == ticket.itemId);
          const assignedUser = data.users.find(u => u.id == ticket.assignedTo);
          
          return (
            <div key={ticket.id} className="mobile-card p-3 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-green-400 font-semibold">#{ticket.id}</span>
                  <span className={`px-2 py-1 rounded text-white text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Customer: </span>
                  <span className="text-green-100">{customer?.name}</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Item: </span>
                  <span className="text-green-100">{item?.name} ({ticket.type})</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Issue: </span>
                  <span className="text-green-100">{ticket.issue}</span>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Assigned To: </span>
                  <span className="text-green-100">{assignedUser?.name}</span>
                </div>
                
                <div className="pt-2 space-y-2">
                  {canUpdateTickets && (
                    <select
                      value={ticket.status}
                      onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                      className="w-full bg-gray-700 text-green-100 rounded border border-green-600 p-1.5 text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="closed">Closed</option>
                    </select>
                  )}
                  {canManageTickets && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(ticket)}
                        className="btn-info px-2 py-1 rounded flex-1 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem('tickets', ticket.id)}
                        className="btn-danger px-2 py-1 rounded flex-1 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tickets;