import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import logo from '../../assets/images/Logo.png';

const CustomerPortal = () => {
  const { currentUser, logout, data, addItem } = useApp();
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
  const [cart, setCart] = useState([]);

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
    { id: 'products', label: 'Products', icon: '🛒' },
    { id: 'raise-ticket', label: 'Raise Ticket', icon: '🎫' },
    { id: 'my-orders', label: 'My Orders', icon: '📦' },
    { id: 'my-tickets', label: 'My Tickets', icon: '🎟️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-lg">
                <img src={logo} alt="MJ POWER Solar" className="h-8 w-8" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">MJ POWER</span>
            </div>
            
            {/* Navigation Menu */}
            <div className="hidden md:flex space-x-8">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <button
                onClick={() => setActiveTab('cart')}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-all"
              >
                <span className="text-2xl">🛍️</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-600">Customer</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-all"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden pb-3">
            <div className="flex space-x-1 overflow-x-auto">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">🔋</span> Solar Products & Services
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    localStorage.removeItem('mjpower-data');
                    window.location.reload();
                  }}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  Reset Data (Load Products)
                </button>
                <select
                  value={orderForm.type}
                  onChange={(e) => setOrderForm({...orderForm, type: e.target.value})}
                  className="p-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="product">Solar Products ({data.products?.length || 0})</option>
                  <option value="service">Solar Services ({data.services?.length || 0})</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(orderForm.type === 'product' ? data.products : data.services)?.map(item => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
                  {orderForm.type === 'product' && item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">{item.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-green-600">₹{item.price.toLocaleString()}</span>
                      {orderForm.type === 'product' && (
                        <select 
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value), itemId: item.id})}
                        >
                          <option value="1">Qty: 1</option>
                          <option value="2">Qty: 2</option>
                          <option value="3">Qty: 3</option>
                          <option value="4">Qty: 4</option>
                          <option value="5">Qty: 5</option>
                        </select>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const existingItem = cart.find(cartItem => cartItem.id === item.id);
                        
                        if (existingItem) {
                          setActiveTab('cart');
                        } else {
                          const quantity = orderForm.quantity || 1;
                          setCart([...cart, { ...item, quantity }]);
                          alert('Added to cart successfully!');
                        }
                      }}
                      className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-200 mt-auto ${
                        cart.find(cartItem => cartItem.id === item.id)
                          ? 'bg-green-100 hover:bg-green-200 text-green-700'
                          : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                      }`}
                    >
                      {cart.find(cartItem => cartItem.id === item.id) ? '✓ In Cart' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {(!data.products || data.products.length === 0) && orderForm.type === 'product' && (
              <div className="text-center text-gray-600 py-8">
                No solar products available yet.
              </div>
            )}
            
            {(!data.services || data.services.length === 0) && orderForm.type === 'service' && (
              <div className="text-center text-gray-600 py-8">
                No solar services available yet.
              </div>
            )}
          </div>
        )}

        {activeTab === 'cart' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">🛍️</span> Shopping Cart
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some solar products to get started!</p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-md">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Cart Items ({cart.length})</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.category}</p>
                            <p className="text-lg font-bold text-green-600">₹{item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setCart(cart.map(cartItem => 
                                  cartItem.id === item.id && cartItem.quantity > 1
                                    ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                    : cartItem
                                ));
                              }}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => {
                                setCart(cart.map(cartItem => 
                                  cartItem.id === item.id
                                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                    : cartItem
                                ));
                              }}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setCart(cart.filter(cartItem => cartItem.id !== item.id));
                            }}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-md sticky top-24">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (18%):</span>
                        <span>₹{Math.round(cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.18).toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>₹{Math.round(cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 1.18).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          cart.forEach(item => {
                            const newOrder = {
                              type: 'product',
                              itemId: item.id,
                              quantity: item.quantity,
                              description: '',
                              preferredDate: new Date().toISOString().split('T')[0],
                              customerId: currentUser.id,
                              customerName: currentUser.name,
                              itemName: item.name,
                              itemPrice: item.price,
                              totalPrice: item.price * item.quantity,
                              status: 'pending',
                              createdAt: new Date().toISOString().split('T')[0]
                            };
                            addItem('orders', newOrder);
                          });
                          setCart([]);
                          alert('Order placed successfully!');
                          setActiveTab('my-orders');
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
                      >
                        💳 Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'raise-ticket' && (
          <div className="max-w-md mx-auto p-6 rounded-lg bg-white border border-gray-200 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎫</span> Raise Support Ticket
            </h2>
            <form onSubmit={handleRaiseTicket} className="space-y-4">
              <select
                value={ticketForm.type}
                onChange={(e) => setTicketForm({...ticketForm, type: e.target.value, itemId: ''})}
                className="w-full p-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="product">Solar Product</option>
                <option value="service">Solar Service</option>
              </select>
              <select
                value={ticketForm.itemId}
                onChange={(e) => setTicketForm({...ticketForm, itemId: e.target.value})}
                className="w-full p-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                className="w-full p-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows="3"
                required
              />
              <textarea
                placeholder="Additional Notes"
                value={ticketForm.notes}
                onChange={(e) => setTicketForm({...ticketForm, notes: e.target.value})}
                className="w-full p-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows="2"
              />
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-200"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        {activeTab === 'my-orders' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">My Solar Orders</h2>
            </div>
            <div className="p-4">
              {myOrders.length === 0 ? (
                <p className="text-gray-600">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {myOrders.map(order => (
                    <div key={order.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.itemName} ({order.type})</h3>
                          {order.type === 'product' && <p className="text-sm text-gray-600">Qty: {order.quantity}</p>}
                          <p className="text-sm text-green-600">₹{order.totalPrice || order.itemPrice}</p>
                          {order.description && <p className="text-sm text-gray-600">{order.description}</p>}
                          <p className="text-sm text-gray-500">Date: {order.preferredDate}</p>
                          <p className="text-sm text-gray-500">Ordered: {order.createdAt}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm text-white ${
                          order.status === 'completed' ? 'bg-green-500' :
                          order.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-yellow-500'
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
          <div className="bg-white rounded-lg border border-gray-200 shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">My Support Tickets</h2>
            </div>
            <div className="p-4">
              {myTickets.length === 0 ? (
                <p className="text-gray-600">No tickets found</p>
              ) : (
                <div className="space-y-4">
                  {myTickets.map(ticket => {
                    const item = (ticket.type === 'product' ? data.products : data.services)
                      ?.find(i => i.id == ticket.itemId);
                    return (
                      <div key={ticket.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">#{ticket.id}</h3>
                            <p className="text-sm text-gray-600">{item?.name} ({ticket.type})</p>
                            <p className="text-sm text-gray-900">{ticket.issue}</p>
                            {ticket.notes && <p className="text-sm text-gray-600">Notes: {ticket.notes}</p>}
                            <p className="text-sm text-gray-500">Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm text-white ${
                            ticket.status === 'closed' ? 'bg-gray-500' :
                            ticket.status === 'completed' ? 'bg-green-500' :
                            ticket.status === 'in-progress' ? 'bg-blue-500' :
                            'bg-yellow-500'
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
        </main>
    </div>
  );
};

export default CustomerPortal;
