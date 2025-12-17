import { useState } from 'react';
import { useApp } from '../context/AppContext';
// import logo from '../assets/images/Logo.png';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, logout, setCurrentPage } = useApp();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = {
    admin: [
      { name: 'Dashboard', icon: '☀️' },
      { name: 'Customers', icon: '👥' },
      { name: 'Products', icon: '🔋' },
      { name: 'Services', icon: '⚡' },
      { name: 'Orders', icon: '📦' },
      { name: 'Tickets', icon: '🎫' },
      { name: 'Add Technician', icon: '👨🔧' },
      { name: 'Add Partner', icon: '🤝' },
      { name: 'Reports', icon: '📊' }
    ],
    manager: [
      { name: 'Dashboard', icon: '☀️' },
      { name: 'Tickets', icon: '🎫' },
      { name: 'Reports', icon: '📊' }
    ],
    partner: [
      { name: 'Dashboard', icon: '☀️' },
      { name: 'Customers', icon: '👥' },
      { name: 'Tickets', icon: '🎫' }
    ],
    technician: [
      { name: 'Dashboard', icon: '☀️' },
      { name: 'Tickets', icon: '🎫' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex relative">


      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-2 shadow-sm">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-yellow-400 hover:bg-white/20 transition-all"
        >
          <span className="text-yellow-300 text-xl">☰</span>
        </button>
      </div>

      {/* Desktop Hamburger */}
      <div className="hidden lg:block fixed top-2 left-2 z-50">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-yellow-400 hover:bg-white/20 transition-all"
        >
          <span className="text-yellow-300 text-lg">☰</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${'Fixed Text'} ${'Fixed Text'} fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col h-screen overflow-y-auto transition-transform duration-300 ease-in-out shadow-lg`}>
        <div className="flex-1 p-1 lg:p-2">
          <div className="flex justify-center mb-2">
            <div className="bg-orange-500 p-2 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">MJ</span>
            </div>
          </div>
          <nav>
            <ul className="space-y-0.5 lg:space-y-1">
              {(menuItems as any)[currentUser?.role]?.map((item: any) => (
                <li key={item.name}>
                  <button
                    onClick={() => { 
                      setActiveItem(item.name); 
                      setCurrentPage(item.name.toLowerCase()); 
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-all duration-200 ${
                      activeItem === item.name
                        ? 'bg-orange-200 text-orange-800 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm lg:text-base">{item.icon}</span>
                    <span className="font-medium text-xs">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* User Info */}
        <div className="p-1.5 lg:p-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-900">{currentUser?.name}</p>
              <p className="text-xs text-gray-600 capitalize">{currentUser?.role}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-1.5 py-0.5 rounded text-xs transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`overflow-y-auto scrollbar-hide pt-12 lg:pt-0 lg:h-screen transition-all duration-300 ${'Fixed Text'}`}>
        <main className={`p-4 lg:p-8 transition-all duration-300 ${'Fixed Text'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
