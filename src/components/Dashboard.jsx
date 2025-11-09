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
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg border border-green-600">
            <h1 className="text-2xl font-bold text-green-400 mb-2">Welcome back, {currentUser?.name}!</h1>
            <p className="text-green-100">Here's your {currentUser?.role} dashboard overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-green-600 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-400 text-lg font-semibold">Customers</h3>
                  <p className="text-3xl font-bold text-green-100 mt-2">{data.customers.length}</p>
                </div>
                <span className="text-4xl">👥</span>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-green-600 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-400 text-lg font-semibold">Products</h3>
                  <p className="text-3xl font-bold text-green-100 mt-2">{data.products.length}</p>
                </div>
                <span className="text-4xl">📦</span>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-green-600 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-400 text-lg font-semibold">Services</h3>
                  <p className="text-3xl font-bold text-green-100 mt-2">{data.services.length}</p>
                </div>
                <span className="text-4xl">🔧</span>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-green-600 hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-400 text-lg font-semibold">Tickets</h3>
                  <p className="text-3xl font-bold text-green-100 mt-2">{data.tickets.length}</p>
                </div>
                <span className="text-4xl">🎫</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-green-600">
              <h3 className="text-green-400 text-lg font-semibold mb-4">Recent Tickets</h3>
              <div className="space-y-3">
                {data.tickets.slice(0, 3).map((ticket, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <span className="text-green-100">Ticket #{index + 1}</span>
                    <span className="text-green-400 text-sm">Open</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-green-600">
              <h3 className="text-green-400 text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {(currentUser?.role === 'admin' || currentUser?.role === 'partner') && (
                  <button 
                    onClick={() => setCurrentPage('customers')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded transition-colors"
                  >
                    + Add New Customer
                  </button>
                )}
                {currentUser?.role === 'admin' && (
                  <>
                    <button 
                      onClick={() => setCurrentPage('add partner')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded transition-colors"
                    >
                      + Add Partner
                    </button>
                    <button 
                      onClick={() => setCurrentPage('add technician')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded transition-colors"
                    >
                      + Add Technician
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setCurrentPage('tickets')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded transition-colors"
                >
                  + Create Ticket
                </button>
                <button 
                  onClick={() => setCurrentPage('reports')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded transition-colors"
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