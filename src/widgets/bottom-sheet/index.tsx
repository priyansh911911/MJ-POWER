import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getImageUrl } from '../../lib/images';
import logo from '../../assets/images/Logo.png';

const CustomerPortal = ({ onStaffLogin }) => {
  const { currentUser, logout, data, addItem, login } = useApp();
  
  const refreshData = () => {
    localStorage.removeItem('mjpower-data');
    window.location.reload();
  };
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginAction, setLoginAction] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  React.useEffect(() => {
    if (!currentUser && (activeTab === 'my-orders' || activeTab === 'my-tickets')) {
      setActiveTab('home');
    }
  }, [currentUser, activeTab]);

  const handleRaiseTicket = (e: any) => {
    e.preventDefault();
    if (!currentUser) {
      setLoginAction('ticket');
      setShowLoginPrompt(true);
      return;
    }
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

  const myOrders = currentUser ? data.orders?.filter((order: any) => order.customerId === currentUser.id) || [] : [];
  const myTickets = currentUser ? data.tickets?.filter((ticket: any) => ticket.customerId === currentUser.id) || [] : [];

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'products', label: 'Products', icon: '🛒' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'raise-ticket', label: 'Support', icon: '🎫' },
    ...(currentUser ? [
      { id: 'my-orders', label: 'My Orders', icon: '📦' },
      { id: 'my-tickets', label: 'My Tickets', icon: '🎟️' }
    ] : [])
  ];

  const categories = [
    { name: 'Solar Panels', icon: '☀️', color: 'bg-yellow-400' },
    { name: 'Inverters', icon: '⚡', color: 'bg-yellow-400' },
    { name: 'Batteries', icon: '🔋', color: 'bg-yellow-400' },
    { name: 'Installation', icon: '🔧', color: 'bg-yellow-400' },
    { name: 'Maintenance', icon: '⚙️', color: 'bg-yellow-400' },
    { name: 'Monitoring', icon: '📊', color: 'bg-yellow-400' },
    { name: 'Support', icon: '🛠️', color: 'bg-yellow-400' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b backdrop-blur-sm bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">MJ</span>
              </div>
              <div className="ml-3">
                <div className="text-teal-600 text-sm font-medium">SOLAR SOLUTIONS</div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!currentUser && (item.id === 'my-orders' || item.id === 'my-tickets')) {
                      setLoginAction('login');
                      setShowLoginPrompt(true);
                      return;
                    }
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-teal-600 text-white'
                      : isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
              </button>
              
              <button
                onClick={() => setActiveTab('cart')}
                className={`relative p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <span className="text-lg">🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium max-w-32 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`} title={currentUser.name}>{currentUser.name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setLoginAction('login');
                      setShowLoginPrompt(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={onStaffLogin}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Staff
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'home' && (
            <div>
              {/* Hero Section */}
              <div className={`relative rounded-3xl overflow-hidden mb-16 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700'}`}>
                <div className="relative px-8 py-16 lg:px-16 lg:py-24">
                  <div className="max-w-3xl">
                    <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                      Powering Tomorrow with
                      <span className="block text-yellow-400">Clean Energy</span>
                    </h1>
                    <p className="text-xl text-teal-100 mb-8 leading-relaxed">
                      Transform your home or business with our premium solar solutions. 
                      Professional installation, maintenance, and support included.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => setActiveTab('products')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        Explore Products
                      </button>
                      <button 
                        onClick={() => setActiveTab('services')}
                        className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                      >
                        Our Services
                      </button>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
                    <div className="w-full h-full bg-gradient-to-l from-yellow-400/30 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Services Overview */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Our Solar Solutions</h2>
                  <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                    Comprehensive solar energy solutions tailored to your needs
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {categories.slice(0, 4).map((category: any) => (
                    <button
                      key={category.name}
                      onClick={() => setActiveTab('products')}
                      className={`group p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${
                        isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-teal-200 transition-colors">
                        <span className="text-3xl">{category.icon}</span>
                      </div>
                      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{category.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Professional {category.name.toLowerCase()} solutions</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Products */}
              <div className="mb-16">
                <div className="flex justify-between items-center mb-8">
                  <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Featured Products</h3>
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="text-teal-600 hover:text-teal-700 font-semibold flex items-center"
                  >
                    View All Products →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.products?.slice(0, 3).map((product: any) => (
                    <div key={product.id} className={`group rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${
                      isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`h-48 flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <span className="text-6xl">⚡</span>
                      </div>
                      <div className="p-6">
                        <h4 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h4>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{product.category}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-teal-600">₹{product.price?.toLocaleString()}</span>
                          <button 
                            onClick={() => setActiveTab('products')}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className={`rounded-3xl p-8 lg:p-12 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="text-center mb-12">
                  <h3 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Why Choose MJPOWER Solar?</h3>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Leading the way in sustainable energy solutions</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expert Installation</h4>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Professional installation by certified technicians</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Premium Quality</h4>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>High-efficiency solar panels and components</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🛠️</span>
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>24/7 Support</h4>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Round-the-clock maintenance and support</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Solar Services</h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                  Professional solar services to maximize your energy efficiency
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.services?.map((service: any) => (
                  <div key={service.id} className={`group rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}>
                    <div className={`h-48 flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'
                    }`}>
                      <span className="text-6xl">🔧</span>
                    </div>
                    <div className="p-6">
                      <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{service.name}</h3>
                      <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{service.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-teal-600">₹{service.price?.toLocaleString()}</span>
                        <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Service</span>
                      </div>
                      <button
                        onClick={() => {
                          const existingItem = cart.find((cartItem: any) => cartItem.id === service.id);
                          if (!existingItem) {
                            setCart([...cart, { ...service, quantity: 1 }]);
                            alert('Added to cart!');
                          }
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Book Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Products & Services</h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                  Complete solar solutions for your energy needs
                </p>
              </div>
              
              {/* Products Section */}
              <div className="mb-16">
                <h3 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Solar Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {data.products?.map((item: any) => (
                    <div key={item.id} className={`group rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${
                      isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`h-48 flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-teal-50 to-teal-100'
                      }`}>
                        {item.image ? (
                          <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-6xl">⚡</span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>{item.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-teal-600">₹{item.price?.toLocaleString()}</span>
                          <select 
                            className={`rounded-lg px-3 py-1 text-sm border ${
                              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'
                            }`}
                            onChange={(e: any) => setOrderForm({...orderForm, quantity: parseInt(e.target.value), itemId: item.id})}
                          >
                            <option value="1">Qty: 1</option>
                            <option value="2">Qty: 2</option>
                            <option value="3">Qty: 3</option>
                            <option value="5">Qty: 5</option>
                            <option value="10">Qty: 10</option>
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            const existingItem = cart.find((cartItem: any) => cartItem.id === item.id);
                            if (existingItem) {
                              setActiveTab('cart');
                            } else {
                              const quantity = orderForm.quantity || 1;
                              setCart([...cart, { ...item, quantity }]);
                              alert('Added to cart!');
                            }
                          }}
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                            cart.find((cartItem: any) => cartItem.id === item.id)
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-teal-600 hover:bg-teal-700 text-white'
                          }`}
                        >
                          {cart.find((cartItem: any) => cartItem.id === item.id) ? '✓ In Cart' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Section */}
              <div>
                <h3 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Solar Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.services?.map((item: any) => (
                    <div key={item.id} className={`group rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${
                      isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`h-48 flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-orange-50 to-orange-100'
                      }`}>
                        <span className="text-6xl">🔧</span>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            Service
                          </span>
                        </div>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>{item.description}</p>
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-teal-600">₹{item.price?.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => {
                            const existingItem = cart.find((cartItem: any) => cartItem.id === item.id);
                            if (!existingItem) {
                              setCart([...cart, { ...item, quantity: 1 }]);
                              alert('Service added to cart!');
                            } else {
                              setActiveTab('cart');
                            }
                          }}
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                            cart.find((cartItem: any) => cartItem.id === item.id)
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-orange-500 hover:bg-orange-600 text-white'
                          }`}
                        >
                          {cart.find((cartItem: any) => cartItem.id === item.id) ? '✓ In Cart' : 'Book Service'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cart' && (
            <div>
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shopping Cart</h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Review your selected items</p>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6">🛒</div>
                  <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your cart is empty</h3>
                  <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add some solar products to get started!</p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className={`rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cart Items ({cart.length})</h3>
                      </div>
                      <div className="p-6 space-y-6">
                        {cart.map((item: any) => (
                          <div key={item.id} className={`flex items-center space-x-6 p-6 border rounded-2xl transition-all hover:shadow-md ${
                            isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'
                          }`}>
                            <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              {item.image ? (
                                <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <span className="text-2xl">⚡</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h4>
                              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.category}</p>
                              <p className="text-xl font-bold text-teal-600">₹{item.price?.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => {
                                  setCart(cart.map((cartItem: any) => 
                                    cartItem.id === item.id && cartItem.quantity > 1
                                      ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                      : cartItem
                                  ));
                                }}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all ${
                                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                }`}
                              >
                                -
                              </button>
                              <span className={`w-12 text-center font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                              <button
                                onClick={() => {
                                  setCart(cart.map((cartItem: any) => 
                                    cartItem.id === item.id
                                      ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                      : cartItem
                                  ));
                                }}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all ${
                                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                }`}
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                setCart(cart.filter((cartItem: any) => cartItem.id !== item.id));
                              }}
                              className={`p-3 rounded-lg transition-all ${isDarkMode ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' : 'text-red-500 hover:text-red-700 hover:bg-red-50'}`}
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <div className={`rounded-2xl sticky top-24 ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className={`flex justify-between text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>Subtotal:</span>
                          <span>₹{cart.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0).toLocaleString()}</span>
                        </div>
                        <div className={`flex justify-between text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>Tax (18%):</span>
                          <span>₹{Math.round(cart.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0) * 0.18).toLocaleString()}</span>
                        </div>
                        <div className={`border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className={`flex justify-between text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            <span>Total:</span>
                            <span>₹{Math.round(cart.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0) * 1.18).toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (!currentUser) {
                              setLoginAction('checkout');
                              setShowLoginPrompt(true);
                              return;
                            }
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
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                        >
                          💳 Proceed to Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'raise-ticket' && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Support Center</h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get help with your solar solutions</p>
              </div>
              
              <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                {!currentUser ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-6">🔒</div>
                    <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Login Required</h3>
                    <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please login to raise a support ticket</p>
                    <button
                      onClick={() => {
                        setLoginAction('ticket');
                        setShowLoginPrompt(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                    >
                      Login to Continue
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Support Ticket</h3>
                    <form onSubmit={handleRaiseTicket} className="space-y-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                        <select
                          value={ticketForm.type}
                          onChange={(e: any) => setTicketForm({...ticketForm, type: e.target.value, itemId: ''})}
                          className={`w-full p-4 rounded-xl border transition-all ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          }`}
                        >
                          <option value="product">Solar Product</option>
                          <option value="service">Solar Service</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Item</label>
                        <select
                          value={ticketForm.itemId}
                          onChange={(e: any) => setTicketForm({...ticketForm, itemId: e.target.value})}
                          className={`w-full p-4 rounded-xl border transition-all ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          }`}
                          required
                        >
                          <option value="">Select {ticketForm.type}</option>
                          {(ticketForm.type === 'product' ? data.products : data.services)?.map((item: any) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Issue Description</label>
                        <textarea
                          placeholder="Describe your issue in detail..."
                          value={ticketForm.issue}
                          onChange={(e: any) => setTicketForm({...ticketForm, issue: e.target.value})}
                          className={`w-full p-4 rounded-xl border transition-all ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          }`}
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Additional Notes (Optional)</label>
                        <textarea
                          placeholder="Any additional information..."
                          value={ticketForm.notes}
                          onChange={(e: any) => setTicketForm({...ticketForm, notes: e.target.value})}
                          className={`w-full p-4 rounded-xl border transition-all ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          }`}
                          rows={3}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                      >
                        Submit Support Ticket
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'my-orders' && (
            <div>
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Orders</h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track your solar product orders</p>
              </div>
              
              <div className={`rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Order History</h3>
                </div>
                <div className="p-6">
                  {!currentUser ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-6">🔒</div>
                      <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Login Required</h3>
                      <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please login to view your orders</p>
                      <button
                        onClick={() => {
                          setLoginAction('login');
                          setShowLoginPrompt(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                      >
                        Login to Continue
                      </button>
                    </div>
                  ) : myOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-6">📦</div>
                      <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Orders Yet</h3>
                      <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start shopping for solar products</p>
                      <button
                        onClick={() => setActiveTab('products')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                      >
                        Browse Products
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {myOrders.map((order: any) => (
                        <div key={order.id} className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.itemName}</h4>
                              <div className="flex items-center space-x-4 mb-3">
                                <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                  {order.type}
                                </span>
                                {order.type === 'product' && (
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Qty: {order.quantity}</span>
                                )}
                              </div>
                              <p className="text-xl font-bold text-teal-600 mb-2">₹{(order.totalPrice || order.itemPrice)?.toLocaleString()}</p>
                              {order.description && <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{order.description}</p>}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Preferred: {order.preferredDate}</span>
                                <span>Ordered: {order.createdAt}</span>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                              order.status === 'completed' ? 'bg-green-500' :
                              order.status === 'in-progress' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-tickets' && (
            <div>
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Support Tickets</h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track your support requests</p>
              </div>
              
              <div className={`rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ticket History</h3>
                </div>
                <div className="p-6">
                  {!currentUser ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-6">🔒</div>
                      <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Login Required</h3>
                      <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please login to view your support tickets</p>
                      <button
                        onClick={() => {
                          setLoginAction('login');
                          setShowLoginPrompt(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                      >
                        Login to Continue
                      </button>
                    </div>
                  ) : myTickets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-6">🎟️</div>
                      <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Support Tickets</h3>
                      <p className={`text-lg mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Need help? Create a support ticket</p>
                      <button
                        onClick={() => setActiveTab('raise-ticket')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                      >
                        Create Ticket
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {myTickets.map((ticket: any) => {
                        const item = (ticket.type === 'product' ? data.products : data.services)
                          ?.find((i: any) => i.id == ticket.itemId);
                        return (
                          <div key={ticket.id} className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ticket #{ticket.id}</h4>
                                  <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                    {ticket.type}
                                  </span>
                                </div>
                                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Related to: {item?.name}
                                </p>
                                <p className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{ticket.issue}</p>
                                {ticket.notes && (
                                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <span className="font-medium">Notes:</span> {ticket.notes}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500">
                                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                                ticket.status === 'closed' ? 'bg-gray-500' :
                                ticket.status === 'completed' ? 'bg-green-500' :
                                ticket.status === 'in-progress' ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`rounded-2xl p-8 max-w-md w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Customer Login
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {loginAction === 'checkout' ? 'Please login to complete your purchase.' :
                   loginAction === 'ticket' ? 'Please login to raise a support ticket.' :
                   'Please login to access your account.'}
                </p>
                <form onSubmit={(e: any) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const email = formData.get('email');
                  const password = formData.get('password');
                  const customer = data.customers?.find((c: any) => c.email === email && c.password === password);
                  if (customer) {
                    const customerUser = { ...customer, role: 'customer' };
                    login(email, password, customerUser);
                    setShowLoginPrompt(false);
                  } else {
                    alert('Invalid credentials');
                  }
                }} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className={`w-full p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      className={`w-full p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginPrompt(false);
                        setActiveTab('home');
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-semibold"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      onStaffLogin();
                    }}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Staff Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerPortal;