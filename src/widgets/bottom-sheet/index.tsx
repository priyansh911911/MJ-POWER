import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getImageUrl } from '../../lib/images';
import { fql } from '../../api/fqlClient';
// import logo from '../../assets/images/Logo.png';

const CustomerPortal = ({ onStaffLogin }: { onStaffLogin: () => void }) => {
  const { currentUser, logout, data, addItem, login } = useApp();
  
  // const refreshData = () => {
  //   localStorage.removeItem('mjpower-data');
  //   window.location.reload();
  // };
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [orderForm, setOrderForm] = useState({
    type: 'product',
    itemId: '',
    quantity: 1,
    description: '',
    preferredDate: ''
  });
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    propertyType: 'residential',
    roofArea: '',
    monthlyBill: '',
    requirements: ''
  });
  const [ticketForm, setTicketForm] = useState({
    type: 'product',
    itemId: '',
    issue: '',
    notes: ''
  });
  const [cart, setCart] = useState<any>([]);
  const [quotes, setQuotes] = useState<any>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginAction, setLoginAction] = useState<string>('');
  // const [, setSearchQuery] = useState('');
  
  useEffect(() => {
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
  
  // Fetch quotes when user logs in or tab changes to my-quotes
  useEffect(() => {
    if (currentUser && activeTab === 'my-quotes') {
      fetchQuotes();
    }
  }, [currentUser, activeTab]);
  
  const fetchQuotes = async () => {
    if (!currentUser) return;
    try {
      const response = await fql.quotes.findMany({
        filter: `customerId=${currentUser.id}`,
        sort: '-created_at'
      });
      if (!response.err && response.result) {
        setQuotes(response.result);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

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
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-gray-700/60 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <a href="#" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center ring-1 ring-white/10">
              <span className="text-white font-bold text-lg">MJ</span>
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="font-semibold tracking-wide">MJ Power</div>
              <div className="text-xs text-slate-400">Products • Services • Support</div>
            </div>
          </a>

          <div className="hidden lg:flex w-full max-w-xl items-center gap-2">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search products (Inverters, Batteries, Panels...)"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            </div>
            <a onClick={() => setActiveTab('get-quote')} className="rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110 cursor-pointer whitespace-nowrap">
              Get Quote
            </a>
          </div>

          <div className="flex items-center gap-2">
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
                className="hidden lg:inline rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}

            <button 
              onClick={() => setActiveTab('cart')}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10" 
              type="button"
            >
              🛒 <span className="ml-1 text-slate-300">({cart.length})</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-gray-700/60 lg:hidden">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {menuItems.slice(0, 4).map((item: any) => (
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
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-colors ${
                activeTab === item.id ? 'text-green-500 bg-white/10' : 'text-slate-400'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveTab('get-quote')}
            className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-colors ${
              activeTab === 'get-quote' ? 'text-green-500 bg-white/10' : 'text-slate-400'
            }`}
          >
            <span className="text-lg mb-1">💰</span>
            <span className="truncate">Quote</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20 lg:pb-0">
        {/* Content Area */}
        <main className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
          {activeTab === 'home' && (
            <div>
              {/* Hero Section */}
              <div className="relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 via-transparent to-white/5"></div>
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-200">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Power solutions for homes, businesses & industry
                    </div>

                    <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                      Reliable <span className="text-green-500">Electrical</span> Products
                      <br className="hidden sm:block" />
                      + Expert Services
                    </h1>

                    <p className="mt-4 max-w-xl text-slate-300">
                      Buy authentic power products (inverters, batteries, solar, wiring) and book installation,
                      maintenance, AMC, and audits — all in one place.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button 
                        onClick={() => setActiveTab('products')}
                        className="rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-black hover:brightness-110"
                      >
                        Shop Products
                      </button>
                      <button 
                        onClick={() => setActiveTab('services')}
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
                      >
                        Explore Services
                      </button>
                      <button 
                        onClick={() => setActiveTab('get-quote')}
                        className="rounded-2xl border border-green-500/40 bg-black/20 px-5 py-3 text-sm font-semibold text-green-500 hover:border-green-500/70"
                      >
                        Request a Quote
                      </button>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold">Warranty-backed</div>
                        <div className="mt-1 text-xs text-slate-400">Genuine products only</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold">Fast Support</div>
                        <div className="mt-1 text-xs text-slate-400">Phone + onsite</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-sm font-semibold">Professional Install</div>
                        <div className="mt-1 text-xs text-slate-400">Certified team</div>
                      </div>
                    </div>
                  </div>

                  {/* Hero card */}
                  <div className="relative">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl shadow-black/40">
                      {(() => {
                        let maxDiscountProduct = data.products?.reduce((max: any, product: any) => {
                          const discount = product.originalPrice ? ((product.originalPrice - product.price) / product.originalPrice) * 100 : 0;
                          const maxDiscount = max?.originalPrice ? ((max.originalPrice - max.price) / max.originalPrice) * 100 : 0;
                          return discount > maxDiscount ? product : max;
                        }, null);
                        
                        // Fallback to first product if no discounted products
                        if (!maxDiscountProduct || !maxDiscountProduct.originalPrice) {
                          maxDiscountProduct = data.products?.[0];
                        }
                        
                        if (!maxDiscountProduct) return null;
                        
                        const discountPercent = maxDiscountProduct.originalPrice ? 
                          Math.round(((maxDiscountProduct.originalPrice - maxDiscountProduct.price) / maxDiscountProduct.originalPrice) * 100) : 15;
                        
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-semibold text-slate-100">Today's Deal</div>
                                <div className="mt-1 text-xs text-slate-400">Limited stock • Best price</div>
                              </div>
                              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-500">-{discountPercent}%</span>
                            </div>

                            <div className="mt-6 space-y-3">
                              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="text-sm font-semibold">{maxDiscountProduct.name}</div>
                                    <div className="mt-1 text-xs text-slate-400">{maxDiscountProduct.category} • {maxDiscountProduct.description}</div>
                                    <div className="mt-3 flex items-center gap-2">
                                      <span className="text-lg font-semibold text-green-500">₹{maxDiscountProduct.price?.toLocaleString()}</span>
                                      {maxDiscountProduct.originalPrice && (
                                        <span className="text-sm text-slate-500 line-through">₹{maxDiscountProduct.originalPrice?.toLocaleString()}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="h-14 w-14 rounded-2xl bg-green-500/15 ring-1 ring-green-500/20 grid place-items-center">
                                    ⚡
                                  </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                  <button 
                                    onClick={() => {
                                      const existingItem = cart.find((cartItem: any) => cartItem.id === maxDiscountProduct.id);
                                      if (!existingItem) {
                                        setCart([...cart, { ...maxDiscountProduct, quantity: 1 }]);
                                      }
                                    }}
                                    className="w-full rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110" 
                                    type="button"
                                  >
                                    Add to Cart
                                  </button>
                                  <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold hover:bg-white/10">
                                    Install +
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                  <div className="text-xs text-slate-400">Avg dispatch</div>
                                  <div className="mt-1 text-lg font-semibold">24–48 hrs</div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                  <div className="text-xs text-slate-400">Service coverage</div>
                                  <div className="mt-1 text-lg font-semibold">Onsite</div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">Shop by Category</h2>
                    <p className="mt-1 text-sm text-slate-400">Quickly find what you need.</p>
                  </div>
                  <button onClick={() => setActiveTab('products')} className="text-sm font-semibold text-green-500 hover:underline">View all →</button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {categories.slice(0, 4).map((category: any) => (
                    <button
                      key={category.name}
                      onClick={() => setActiveTab('products')}
                      className="group rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{category.name}</div>
                        <div className="rounded-2xl bg-green-500/15 px-3 py-2 text-green-500 ring-1 ring-green-500/20">
                          {category.icon}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-400">Professional {category.name.toLowerCase()} solutions</p>
                      <p className="mt-4 text-xs text-slate-500 group-hover:text-slate-300">Explore →</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Products */}
              <div className="mb-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Featured Products</h2>
                    <p className="mt-1 text-sm text-slate-400">Add to cart or request installation.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" type="button">All</button>
                    <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" type="button">Inverters</button>
                    <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" type="button">Batteries</button>
                    <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" type="button">Solar</button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.products?.slice(0, 3).map((product: any) => (
                    <article key={product.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold">{product.name}</h3>
                          <p className="mt-1 text-sm text-slate-400">{product.category}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-lg font-semibold text-green-500">₹{product.price?.toLocaleString()}</span>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">⭐ 4.5 • Reviews</p>
                        </div>
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-500/15 ring-1 ring-green-500/20">
                          ⚡
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => {
                            const existingItem = cart.find((cartItem: any) => cartItem.id === product.id);
                            if (!existingItem) {
                              setCart([...cart, { ...product, quantity: 1 }]);
                            }
                          }}
                          className="w-full rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110" 
                          type="button"
                        >
                          Add to Cart
                        </button>
                        <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold hover:bg-white/10">
                          Install +
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="rounded-3xl p-8 lg:p-12 text-white">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold mb-4 text-white">Why Choose MJPOWER Solar?</h3>
                  <p className="text-lg text-gray-300">Leading the way in sustainable energy solutions</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-white">Expert Installation</h4>
                    <p className="text-gray-300">Professional installation by certified technicians</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-white">Premium Quality</h4>
                    <p className="text-gray-300">High-efficiency solar panels and components</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🛠️</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-white">24/7 Support</h4>
                    <p className="text-gray-300">Round-the-clock maintenance and support</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Services</h2>
                  <p className="mt-1 text-sm text-slate-400">Book onsite work, AMC, and audits.</p>
                </div>
                <button className="text-sm font-semibold text-green-500 hover:underline">Request service →</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.services?.map((service: any) => (
                  <article key={service.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{service.name}</h3>
                      <span className="rounded-2xl bg-green-500/15 px-3 py-2 text-green-500 ring-1 ring-green-500/20">🔧</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{service.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-semibold text-green-500">₹{service.price?.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => {
                        const existingItem = cart.find((cartItem: any) => cartItem.id === service.id);
                        if (!existingItem) {
                          setCart([...cart, { ...service, quantity: 1 }]);
                        }
                      }}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110"
                    >
                      Book Service
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Featured Products</h2>
                  <p className="mt-1 text-sm text-slate-400">Add to cart or request installation.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" type="button">All</button>
                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" type="button">Inverters</button>
                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" type="button">Batteries</button>
                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10" type="button">Solar</button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.products?.map((item: any) => (
                  <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold">{item.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-lg font-semibold text-green-500">₹{item.price?.toLocaleString()}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">⭐ 4.5 • Reviews</p>
                      </div>
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-500/15 ring-1 ring-green-500/20">
                        ⚡
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          const existingItem = cart.find((cartItem: any) => cartItem.id === item.id);
                          if (existingItem) {
                            setActiveTab('cart');
                          } else {
                            const quantity = orderForm.quantity || 1;
                            setCart([...cart, { ...item, quantity }]);
                          }
                        }}
                        className="w-full rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110"
                      >
                        {cart.find((cartItem: any) => cartItem.id === item.id) ? '✓ In Cart' : 'Add to Cart'}
                      </button>
                      <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold hover:bg-white/10">
                        Install +
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'get-quote' && (
            <div>
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Get Solar Quote</h2>
                  <p className="mt-1 text-sm text-slate-400">Get a personalized solar solution estimate</p>
                </div>
              </div>
              
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-base font-semibold mb-4">Request Quote</h3>
                  <form onSubmit={async (e: any) => {
                    e.preventDefault();
                    const newQuote = {
                      ...quoteForm,
                      customerId: currentUser?.id,
                      customerName: currentUser?.name || quoteForm.name,
                      status: 'pending',
                      estimatedCost: Math.round((parseInt(quoteForm.monthlyBill) || 0) * 12 * 8),
                      estimatedSavings: Math.round((parseInt(quoteForm.monthlyBill) || 0) * 12 * 0.8),
                      type: cart.length > 0 ? 'cart-quote' : 'form-quote',
                      ...(cart.length > 0 && {
                        items: cart.map((item: any) => ({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          quantity: item.quantity,
                          total: item.price * item.quantity
                        })),
                        subtotal: cart.reduce((total: number, item: any) => total + ((item.price || 0) * item.quantity), 0),
                        tax: Math.round(cart.reduce((total: number, item: any) => total + ((item.price || 0) * item.quantity), 0) * 0.18),
                        totalAmount: Math.round(cart.reduce((total: number, item: any) => total + ((item.price || 0) * item.quantity), 0) * 1.18)
                      })
                    };
                    
                    try {
                      const response = await fql.quotes.createOne(newQuote);
                      if (response.err) {
                        alert('Error submitting quote: ' + response.message);
                      } else {
                        alert('Quote request submitted successfully! We will contact you soon.');
                        setQuoteForm({ name: '', phone: '', email: '', address: '', propertyType: 'residential', roofArea: '', monthlyBill: '', requirements: '' });
                        setCart([]);
                        setActiveTab('my-quotes');
                      }
                    } catch (error: any) {
                      console.error('Error submitting quote:', error);
                      if (error.message.includes('Network error')) {
                        alert('Connection failed. Please check if the server is running and try again.');
                      } else {
                        alert('Error submitting quote: ' + error.message);
                      }
                    }
                  }} className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={quoteForm.name}
                        onChange={(e: any) => setQuoteForm({...quoteForm, name: e.target.value})}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={quoteForm.phone}
                        onChange={(e: any) => setQuoteForm({...quoteForm, phone: e.target.value})}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                        required
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={quoteForm.email}
                      onChange={(e: any) => setQuoteForm({...quoteForm, email: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                      required
                    />
                    <textarea
                      placeholder="Installation Address"
                      value={quoteForm.address}
                      onChange={(e: any) => setQuoteForm({...quoteForm, address: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                      rows={2}
                      required
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        value={quoteForm.propertyType}
                        onChange={(e: any) => setQuoteForm({...quoteForm, propertyType: e.target.value})}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Roof Area (sq ft)"
                        value={quoteForm.roofArea}
                        onChange={(e: any) => setQuoteForm({...quoteForm, roofArea: e.target.value})}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Monthly Electricity Bill (₹)"
                      value={quoteForm.monthlyBill}
                      onChange={(e: any) => setQuoteForm({...quoteForm, monthlyBill: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                      required
                    />
                    <textarea
                      placeholder="Special Requirements or Questions"
                      value={quoteForm.requirements}
                      onChange={(e: any) => setQuoteForm({...quoteForm, requirements: e.target.value})}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                      rows={2}
                    />
                    
                    {cart.length > 0 && (
                      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
                        <h4 className="text-sm font-semibold text-green-500 mb-3">Selected Items</h4>
                        <div className="space-y-2">
                          {cart.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-green-500/20 mt-3 pt-3">
                          <div className="flex justify-between text-sm font-semibold text-green-500">
                            <span>Total (incl. tax):</span>
                            <span>₹{Math.round(cart.reduce((total: number, item: any) => total + ((item.price || 0) * item.quantity), 0) * 1.18).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110"
                    >
                      {cart.length > 0 ? 'Submit Quote Request' : 'Get Free Quote'}
                    </button>
                  </form>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-semibold mb-3">Why Choose Solar?</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs">
                          💰
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Save Money</div>
                          <div className="text-xs text-slate-400">Reduce electricity bills by 80%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs">
                          🌱
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Go Green</div>
                          <div className="text-xs text-slate-400">Reduce carbon footprint</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs">
                          📈
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Increase Value</div>
                          <div className="text-xs text-slate-400">Boost property value</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-semibold mb-3">Quick Estimate</h3>
                    {quoteForm.monthlyBill && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Annual Bill:</span>
                          <span>₹{(parseInt(quoteForm.monthlyBill) * 12).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Estimated System Cost:</span>
                          <span>₹{(parseInt(quoteForm.monthlyBill) * 12 * 8).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-green-500">
                          <span>Annual Savings:</span>
                          <span>₹{(parseInt(quoteForm.monthlyBill) * 12 * 0.8).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    {!quoteForm.monthlyBill && (
                      <p className="text-xs text-slate-400">Enter your monthly bill to see estimate</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cart' && (
            <div>
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Shopping Cart</h2>
                  <p className="mt-1 text-sm text-slate-400">Review your selected items</p>
                </div>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🛒</div>
                  <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-sm text-slate-400 mb-4">Add some solar products to get started!</p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cart.map((item: any) => (
                    <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold">{item.name}</h3>
                          <p className="mt-1 text-sm text-slate-400">{item.category}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-lg font-semibold text-green-500">₹{item.price?.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-500/15 ring-1 ring-green-500/20">
                          {item.image ? (
                            <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <span>⚡</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCart(cart.map((cartItem: any) => 
                                cartItem.id === item.id && cartItem.quantity > 1
                                  ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                  : cartItem
                              ));
                            }}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm font-semibold hover:bg-white/10 transition-all"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => {
                              setCart(cart.map((cartItem: any) => 
                                cartItem.id === item.id
                                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                  : cartItem
                              ));
                            }}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm font-semibold hover:bg-white/10 transition-all"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setCart(cart.filter((cartItem: any) => cartItem.id !== item.id));
                          }}
                          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              
              {cart.length > 0 && (
                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Order Summary</div>
                      <div className="mt-1 text-xs text-slate-400">{cart.length} items • Tax included</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-500">₹{Math.round(cart.reduce((total: number, item: any) => total + ((item.price || 0) * item.quantity), 0) * 1.18).toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Total with 18% tax</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Autofill quote form with user data if logged in
                      if (currentUser) {
                        setQuoteForm({
                          ...quoteForm,
                          name: currentUser.name || '',
                          email: currentUser.email || '',
                          phone: currentUser.phone || '',
                          address: currentUser.address || ''
                        });
                      }
                      setActiveTab('get-quote');
                    }}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110"
                  >
                    💰 Generate Quote
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'raise-ticket' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Support Center</h2>
                <p className="mt-1 text-sm text-slate-400">Get help with your solar solutions</p>
              </div>
              
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                {!currentUser ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-lg font-semibold mb-2">Login Required</h3>
                    <p className="text-sm mb-6 text-slate-400">Please login to raise a support ticket</p>
                    <button
                      onClick={() => {
                        setLoginAction('ticket');
                        setShowLoginPrompt(true);
                      }}
                      className="rounded-2xl bg-green-500 px-6 py-2.5 text-sm font-semibold text-black hover:brightness-110"
                    >
                      Login to Continue
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Create Support Ticket</h3>
                    <form onSubmit={handleRaiseTicket} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          value={ticketForm.type}
                          onChange={(e: any) => setTicketForm({...ticketForm, type: e.target.value, itemId: ''})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                        >
                          <option value="product">Solar Product</option>
                          <option value="service">Solar Service</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Item</label>
                        <select
                          value={ticketForm.itemId}
                          onChange={(e: any) => setTicketForm({...ticketForm, itemId: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                          required
                        >
                          <option value="">Select {ticketForm.type}</option>
                          {(ticketForm.type === 'product' ? data.products : data.services)?.map((item: any) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Issue Description</label>
                        <textarea
                          placeholder="Describe your issue in detail..."
                          value={ticketForm.issue}
                          onChange={(e: any) => setTicketForm({...ticketForm, issue: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                          rows={4}
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-black hover:brightness-110"
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
                <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Track your solar product orders</p>
              </div>
              
              <div className={`rounded-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className={`p-6 border-b ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Order History</h3>
                </div>
                <div className="p-6">
                  {!currentUser ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-6">🔒</div>
                      <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Login Required</h3>
                      <p className={`text-lg mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Please login to view your orders</p>
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
                      <p className={`text-lg mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Start shopping for solar products</p>
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
                                <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {order.type}
                                </span>
                                {order.type === 'product' && (
                                  <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Qty: {order.quantity}</span>
                                )}
                              </div>
                              <p className="text-xl font-bold text-teal-600 mb-2">₹{(order.totalPrice || order.itemPrice)?.toLocaleString()}</p>
                              {order.description && <p className={`text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{order.description}</p>}
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
                <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Track your support requests</p>
              </div>
              
              <div className={`rounded-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className={`p-6 border-b ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ticket History</h3>
                </div>
                <div className="p-6">
                  {!currentUser ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-6">🔒</div>
                      <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Login Required</h3>
                      <p className={`text-lg mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Please login to view your support tickets</p>
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
                      <p className={`text-lg mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Need help? Create a support ticket</p>
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
                                  <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {ticket.type}
                                  </span>
                                </div>
                                <p className={`text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Related to: {item?.name}
                                </p>
                                <p className={`mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{ticket.issue}</p>
                                {ticket.notes && (
                                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-4">Customer Login</h3>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowLoginPrompt(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerPortal;