import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/Logo.png';

const Layout = ({ children }) => {
  const { currentUser, logout, currentPage, setCurrentPage } = useApp();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-900 text-green-100 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg border border-green-600"
      >
        <span className="text-green-400 text-xl">☰</span>
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-green-600 flex flex-col h-screen overflow-y-auto scrollbar-hide transition-transform duration-300 ease-in-out`}>
        <div className="flex-1 p-4 lg:p-6">
          <div className="flex justify-center mb-6 lg:mb-8">
            <img src={logo} alt="MJ POWER" className="h-24 w-24 lg:h-32 lg:w-32 rounded" />
          </div>
          <nav>
            <ul className="space-y-2 lg:space-y-3">
              {menuItems[currentUser?.role]?.map(item => (
                <li key={item.name}>
                  <button
                    onClick={() => { 
                      setActiveItem(item.name); 
                      setCurrentPage(item.name.toLowerCase()); 
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-5 rounded-lg transition-all duration-200 ${
                      activeItem === item.name
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-green-100 hover:bg-green-700/50 hover:text-white'
                    }`}
                  >
                    <span className="text-lg lg:text-xl">{item.icon}</span>
                    <span className="font-medium text-sm lg:text-base">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* User Info */}
        <div className="p-3 lg:p-4 border-t border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-green-300">{currentUser?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-2 lg:px-3 py-1 rounded text-xs lg:text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto scrollbar-hide lg:ml-0">
        <main className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;