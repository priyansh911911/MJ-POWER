import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const CustomerPortal = () => {
  const { currentUser, logout, data, addItem } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    type: 'product',
    itemId: '',
    quantity: 1,
    description: '',
    preferredDate: ''
  });
  const [ticketForm, setTicketForm] = useState({
    type: 'product',
    itemId: '',
    issue: '',
    notes: ''
  });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const selectedItem = (orderForm.type === 'product' ? data.products : data.services)
      ?.find(item => item.id == orderForm.itemId);
    const totalPrice = orderForm.type === 'product' 
      ? (selectedItem?.price || 0) * orderForm.quantity
      : selectedItem?.price || 0;
    
    const newOrder = {
      ...orderForm,
      customerId: currentUser.id,
      customerName: currentUser.name,
      itemName: selectedItem?.name,
      itemPrice: selectedItem?.price,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    addItem('orders', newOrder);
    setOrderForm({ type: 'product', itemId: '', quantity: 1, description: '', preferredDate: '' });
    alert('Order placed successfully!');
  };

  const handleRaiseTicket = (e) => {
    e.preventDefault();
    const newTicket = {
      ...ticketForm,
      customerId: currentUser.id,
      customerName: currentUser.name,
      status: 'open',
      assignedTo: '',
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    };
    addItem('tickets', newTicket);
    setTicketForm({ type: 'product', itemId: '', issue: '', notes: '' });
    alert('Ticket raised successfully!');
  };

  const myOrders = data.orders?.filter(order => order.customerId === currentUser.id) || [];
  const myTickets = data.tickets?.filter(ticket => ticket.customerId === currentUser.id) || [];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'place-order', label: 'Place Order', icon: '🛒' },
    { id: 'raise-ticket', label: 'Raise Ticket', icon: '🎫' },
    { id: 'my-orders', label: 'My Orders', icon: '📦' },
    { id: 'my-tickets', label: 'My Tickets', icon: '🎟️' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-green-100 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-green-600 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-green-600">
          <h1 className="text-lg font-bold text-green-400">Customer Portal</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-green-300 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <nav className="mt-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 ${
                activeTab === item.id ? 'bg-green-600 text-white' : 'text-green-300'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-sm text-green-300 mb-2">Welcome, {currentUser.name}</div>
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gray-800 border-b border-green-600 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-green-300 hover:text-white"
            >
              ☰
            </button>
            <h1 className="text-lg font-bold text-green-400">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-green-600">
              <h3 className="text-green-400 font-semibold">Total Orders</h3>
              <p className="text-2xl font-bold">{myOrders.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-green-600">
              <h3 className="text-green-400 font-semibold">Open Tickets</h3>
              <p className="text-2xl font-bold">{myTickets.filter(t => t.status === 'open').length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-green-600">
              <h3 className="text-green-400 font-semibold">Pending Orders</h3>
              <p className="text-2xl font-bold">{myOrders.filter(o => o.status === 'pending').length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-green-600">
              <h3 className="text-green-400 font-semibold">Completed Orders</h3>
              <p className="text-2xl font-bold">{myOrders.filter(o => o.status === 'completed').length}</p>
            </div>
          </div>
        )}

        {activeTab === 'place-order' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-green-400">Products & Services</h2>
              <select
                value={orderForm.type}
                onChange={(e) => setOrderForm({...orderForm, type: e.target.value})}
                className="p-2 bg-gray-700 text-green-100 rounded border border-green-600"
              >
                <option value="product">Products ({data.products?.length || 0})</option>
                <option value="service">Services ({data.services?.length || 0})</option>
              </select>
            </div>
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(orderForm.type === 'product' ? data.products : data.services)?.map(item => (
                <div key={item.id} className="bg-gray-800 p-4 rounded-lg border border-green-600">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">{item.name}</h3>
                  <p className="text-green-100 mb-2">Category: {item.category}</p>
                  <p className="text-xl font-bold text-green-400 mb-4">₹{item.price}</p>
                  
                  <div className="space-y-2">
                    {orderForm.type === 'product' && (
                      <input
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        className="w-full p-2 bg-gray-700 text-green-100 rounded border border-green-600"
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value) || 1;
                          setOrderForm({...orderForm, quantity, itemId: item.id});
                        }}
                      />
                    )}
                    
                    <input
                      type="date"
                      placeholder="Preferred Date"
                      className="w-full p-2 bg-gray-700 text-green-100 rounded border border-green-600"
                      onChange={(e) => setOrderForm({...orderForm, preferredDate: e.target.value, itemId: item.id})}
                    />
                    
                    <textarea
                      placeholder="Notes (optional)"
                      className="w-full p-2 bg-gray-700 text-green-100 rounded border border-green-600"
                      rows="2"
                      onChange={(e) => setOrderForm({...orderForm, description: e.target.value, itemId: item.id})}
                    />
                    
                    <button
                      onClick={() => {
                        if (!orderForm.preferredDate) {
                          alert('Please select a preferred date');
                          return;
                        }
                        
                        const totalPrice = orderForm.type === 'product' 
                          ? item.price * (orderForm.quantity || 1)
                          : item.price;
                        
                        const newOrder = {
                          type: orderForm.type,
                          itemId: item.id,
                          quantity: orderForm.quantity || 1,
                          description: orderForm.description || '',
                          preferredDate: orderForm.preferredDate,
                          customerId: currentUser.id,
                          customerName: currentUser.name,
                          itemName: item.name,
                          itemPrice: item.price,
                          totalPrice,
                          status: 'pending',
                          createdAt: new Date().toISOString().split('T')[0]
                        };
                        
                        addItem('orders', newOrder);
                        alert('Order placed successfully!');
                        setOrderForm({ type: 'product', itemId: '', quantity: 1, description: '', preferredDate: '' });
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {(!data.products || data.products.length === 0) && orderForm.type === 'product' && (
              <div className="text-center text-gray-400 py-8">
                No products available. Please add products from admin panel.
              </div>
            )}
            
            {(!data.services || data.services.length === 0) && orderForm.type === 'service' && (
              <div className="text-center text-gray-400 py-8">
                No services available. Please add services from admin panel.
              </div>
            )}
          </div>
        )}

        {activeTab === 'raise-ticket' && (
          <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg border border-green-600">
            <h2 className="text-xl font-bold text-green-400 mb-4">Raise Ticket</h2>
            <form onSubmit={handleRaiseTicket} className="space-y-4">
              <select
                value={ticketForm.type}
                onChange={(e) => setTicketForm({...ticketForm, type: e.target.value, itemId: ''})}
                className="w-full p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
              <select
                value={ticketForm.itemId}
                onChange={(e) => setTicketForm({...ticketForm, itemId: e.target.value})}
                className="w-full p-3 bg-gray-700 text-green-100 rounded border border-green-600"
                required
              >
                <option value="">Select {ticketForm.type}</option>
                {(ticketForm.type === 'product' ? data.products : data.services)?.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <textarea
                placeholder="Issue Description"
                value={ticketForm.issue}
                onChange={(e) => setTicketForm({...ticketForm, issue: e.target.value})}
                className="w-full p-3 bg-gray-700 text-green-100 rounded border border-green-600"
                rows="3"
                required
              />
              <textarea
                placeholder="Additional Notes"
                value={ticketForm.notes}
                onChange={(e) => setTicketForm({...ticketForm, notes: e.target.value})}
                className="w-full p-3 bg-gray-700 text-green-100 rounded border border-green-600"
                rows="2"
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded text-white font-semibold"
              >
                Raise Ticket
              </button>
            </form>
          </div>
        )}

        {activeTab === 'my-orders' && (
          <div className="bg-gray-800 rounded-lg border border-green-600">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-green-400">My Orders</h2>
            </div>
            <div className="p-4">
              {myOrders.length === 0 ? (
                <p className="text-gray-400">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {myOrders.map(order => (
                    <div key={order.id} className="bg-gray-700 p-4 rounded border border-green-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-green-300">{order.itemName} ({order.type})</h3>
                          {order.type === 'product' && <p className="text-sm text-gray-300">Qty: {order.quantity}</p>}
                          <p className="text-sm text-gray-300">₹{order.totalPrice || order.itemPrice}</p>
                          {order.description && <p className="text-sm text-gray-300">{order.description}</p>}
                          <p className="text-sm text-gray-400">Date: {order.preferredDate}</p>
                          <p className="text-sm text-gray-400">Ordered: {order.createdAt}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          order.status === 'completed' ? 'bg-green-600' :
                          order.status === 'in-progress' ? 'bg-blue-600' :
                          'bg-yellow-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'my-tickets' && (
          <div className="bg-gray-800 rounded-lg border border-green-600">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-green-400">My Tickets</h2>
            </div>
            <div className="p-4">
              {myTickets.length === 0 ? (
                <p className="text-gray-400">No tickets found</p>
              ) : (
                <div className="space-y-4">
                  {myTickets.map(ticket => {
                    const item = (ticket.type === 'product' ? data.products : data.services)
                      ?.find(i => i.id == ticket.itemId);
                    return (
                      <div key={ticket.id} className="bg-gray-700 p-4 rounded border border-green-600">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-green-300">#{ticket.id}</h3>
                            <p className="text-sm text-gray-300">{item?.name} ({ticket.type})</p>
                            <p className="text-sm text-gray-300">{ticket.issue}</p>
                            {ticket.notes && <p className="text-sm text-gray-400">Notes: {ticket.notes}</p>}
                            <p className="text-sm text-gray-400">Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${
                            ticket.status === 'closed' ? 'bg-gray-600' :
                            ticket.status === 'completed' ? 'bg-green-600' :
                            ticket.status === 'in-progress' ? 'bg-blue-600' :
                            'bg-yellow-600'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;