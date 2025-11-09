import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/Logo.png';

const Layout = ({ children }) => {
  const { currentUser, logout, currentPage, setCurrentPage } = useApp();
  const [activeItem, setActiveItem] = useState('Dashboard');

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
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-green-600 flex flex-col h-screen overflow-y-auto scrollbar-hide">
        <div className="flex-1 p-6">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="MJ POWER" className="h-32 w-32 rounded" />
          </div>
          <nav>
            <ul className="space-y-3">
              {menuItems[currentUser?.role]?.map(item => (
                <li key={item.name}>
                  <button
                    onClick={() => { setActiveItem(item.name); setCurrentPage(item.name.toLowerCase()); }}
                    className={`w-full flex items-center gap-4 px-6 py-5 rounded-lg transition-all duration-200 ${
                      activeItem === item.name
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-green-100 hover:bg-green-700/50 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* User Info */}
        <div className="p-4 border-t border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-300">{currentUser?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto scrollbar-hide">
        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;