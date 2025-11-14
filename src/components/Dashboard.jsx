import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Customers from '../pages/Customers';
import Products from '../pages/Products';
import Services from '../pages/Services';
import Tickets from '../pages/Tickets';
import Reports from '../pages/Reports';
import AddTechnician from '../pages/users/AddTechnician';
import AddPartner from '../pages/users/AddPartner';

const Dashboard = () => {
  const { currentUser, data, currentPage, setCurrentPage } = useApp();

  const getMenuItems = () => {
    const baseItems = [
      { key: 'dashboard', label: 'Dashboard', roles: ['admin', 'manager', 'partner', 'technician'] }
    ];

    const roleItems = {
      admin: [
        { key: 'products', label: 'Products' },
        { key: 'services', label: 'Services' },
        { key: 'tickets', label: 'Tickets' },
        { key: 'reports', label: 'Reports' }
      ],
      manager: [
        { key: 'products', label: 'Products' },
        { key: 'services', label: 'Services' },
        { key: 'tickets', label: 'Tickets' },
        { key: 'reports', label: 'Reports' }
      ],
      partner: [
        { key: 'customers', label: 'Customers' },
        { key: 'tickets', label: 'Tickets' }
      ],
      technician: [
        { key: 'tickets', label: 'My Tickets' },
        { key: 'reports', label: 'My Reports' }
      ]
    };

    return [...baseItems, ...(roleItems[currentUser?.role] || [])];
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'customers': return <Customers />;
      case 'products': return <Products />;
      case 'services': return <Services />;
      case 'tickets': return <Tickets />;
      case 'reports': return <Reports />;
      case 'add technician': return <AddTechnician />;
      case 'add partner': return <AddPartner />;
      default: return (
        <div className="space-y-4">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-3 rounded-lg border border-green-600">
            <h1 className="text-lg font-bold text-green-400 mb-1">Welcome back, {currentUser?.name}!</h1>
            <p className="text-green-100 text-sm">Here's your {currentUser?.role} dashboard overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
            <div className="bg-gray-800 p-2 lg:p-3 rounded-lg border border-green-600 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-400 text-xs lg:text-sm font-semibold">Customers</h3>
                  <p className="text-lg lg:text-xl font-bold text-green-100 mt-1">{data.customers.length}</p>
                </div>
                <span className="text-lg lg:text-xl">👥</span>
              </div>
            </div>
            <div className="bg-gray-800 p-2 lg:p-3 rounded-lg border border-green-600 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-400 text-xs lg:text-sm font-semibold">Products</h3>
                  <p className="text-lg lg:text-xl font-bold text-green-100 mt-1">{data.products.length}</p>
                </div>
                <span className="text-lg lg:text-xl">📦</span>
              </div>
            </div>
            <div className="bg-gray-800 p-2 lg:p-3 rounded-lg border border-green-600 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-400 text-xs lg:text-sm font-semibold">Services</h3>
                  <p className="text-lg lg:text-xl font-bold text-green-100 mt-1">{data.services.length}</p>
                </div>
                <span className="text-lg lg:text-xl">🔧</span>
              </div>
            </div>
            <div className="bg-gray-800 p-2 lg:p-3 rounded-lg border border-green-600 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-400 text-xs lg:text-sm font-semibold">Tickets</h3>
                  <p className="text-lg lg:text-xl font-bold text-green-100 mt-1">{data.tickets.length}</p>
                </div>
                <span className="text-lg lg:text-xl">🎫</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
            <div className="bg-gray-800 p-2 lg:p-3 rounded-lg border border-green-600">
              <h3 className="text-green-400 text-sm font-semibold mb-2">Recent Tickets</h3>
              <div className="space-y-1">
                {data.tickets.slice(0, 3).map((ticket, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <span className="text-green-100 text-xs">Ticket #{index + 1}</span>
                    <span className="text-green-400 text-xs">Open</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800 p-2 lg:p-3 rounded-lg border border-green-600">
              <h3 className="text-green-400 text-sm font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-1">
                {(currentUser?.role === 'admin' || currentUser?.role === 'partner') && (
                  <button 
                    onClick={() => setCurrentPage('customers')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-1.5 rounded transition-colors text-xs"
                  >
                    + Add New Customer
                  </button>
                )}
                {currentUser?.role === 'admin' && (
                  <>
                    <button 
                      onClick={() => setCurrentPage('add partner')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white p-1.5 rounded transition-colors text-xs"
                    >
                      + Add Partner
                    </button>
                    <button 
                      onClick={() => setCurrentPage('add technician')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white p-1.5 rounded transition-colors text-xs"
                    >
                      + Add Technician
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setCurrentPage('tickets')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-1.5 rounded transition-colors text-xs"
                >
                  + Create Ticket
                </button>
                <button 
                  onClick={() => setCurrentPage('reports')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-1.5 rounded transition-colors text-xs"
                >
                  📊 View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default Dashboard;