import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/Logo.png';

const Layout = ({ children }) => {
  const { currentUser, logout, currentPage, setCurrentPage } = useApp();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = {
    admin: [
      { name: 'Dashboard', icon: '📊' },
      { name: 'Customers', icon: '👥' },
      { name: 'Products', icon: '📦' },
      { name: 'Services', icon: '🔧' },
      { name: 'Tickets', icon: '🎫' },
      { name: 'Add Technician', icon: '👨‍🔧' },
      { name: 'Add Partner', icon: '🤝' },
      { name: 'Reports', icon: '📈' }
    ],
    manager: [
      { name: 'Dashboard', icon: '📊' },
      { name: 'Tickets', icon: '🎫' },
      { name: 'Reports', icon: '📈' }
    ],
    partner: [
      { name: 'Dashboard', icon: '📊' },
      { name: 'Customers', icon: '👥' },
      { name: 'Tickets', icon: '🎫' }
    ],
    technician: [
      { name: 'Dashboard', icon: '📊' },
      { name: 'Tickets', icon: '🎫' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-green-100 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 p-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-800 p-2 rounded-lg border border-green-600"
        >
          <span className="text-green-400 text-xl">☰</span>
        </button>
      </div>

      {/* Desktop Hamburger */}
      <div className="hidden lg:block fixed top-2 left-2 z-50">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="bg-gray-800 p-2 rounded-lg border border-green-600 hover:bg-gray-700 transition-colors"
        >
          <span className="text-green-400 text-lg">☰</span>
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
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarCollapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0'} fixed inset-y-0 left-0 z-40 w-64 bg-white/10 backdrop-blur-md border-r border-green-600/50 flex flex-col h-screen overflow-y-auto scrollbar-hide transition-transform duration-300 ease-in-out shadow-2xl`}>
        <div className="flex-1 p-1 lg:p-2">
          <div className="flex justify-center mb-2">
            <img src={logo} alt="MJ POWER" className="h-12 w-12 lg:h-14 lg:w-14 rounded" />
          </div>
          <nav>
            <ul className="space-y-0.5 lg:space-y-1">
              {menuItems[currentUser?.role]?.map(item => (
                <li key={item.name}>
                  <button
                    onClick={() => { 
                      setActiveItem(item.name); 
                      setCurrentPage(item.name.toLowerCase()); 
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-all duration-200 ${
                      activeItem === item.name
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-green-100 hover:bg-green-700/50 hover:text-white'
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
        <div className="p-1.5 lg:p-2 border-t border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-300">{currentUser?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-1.5 py-0.5 rounded text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`overflow-y-auto scrollbar-hide pt-12 lg:pt-0 lg:h-screen transition-all duration-300 ${sidebarCollapsed ? 'w-full ml-0' : 'flex-1 lg:ml-64'}`}>
        <main className={`p-4 lg:p-8 transition-all duration-300 ${sidebarCollapsed ? 'max-w-none' : 'max-w-7xl mx-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;