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
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="mr-2">☀️</span> Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-gray-600">Solar Energy Management - {currentUser?.role} dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">Solar Customers</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{data.customers.length}</p>
                </div>
                <span className="text-3xl text-orange-500">👥</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">Solar Products</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{data.products.length}</p>
                </div>
                <span className="text-3xl text-orange-500">🔋</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">Services</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{data.services.length}</p>
                </div>
                <span className="text-3xl text-orange-500">⚡</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">Support Tickets</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{data.tickets.length}</p>
                </div>
                <span className="text-3xl text-orange-500">🎫</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🎫</span> Recent Support Tickets
              </h3>
              <div className="space-y-3">
                {data.tickets.slice(0, 3).map((ticket, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-900 text-sm font-medium">Ticket #{index + 1}</span>
                    <span className="text-orange-600 text-xs font-semibold bg-orange-100 px-2 py-1 rounded">Open</span>
                  </div>
                ))}
                {data.tickets.length === 0 && (
                  <p className="text-gray-500 text-sm">No tickets yet</p>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">⚡</span> Quick Actions
              </h3>
              <div className="space-y-2">
                {(currentUser?.role === 'admin' || currentUser?.role === 'partner') && (
                  <button 
                    onClick={() => setCurrentPage('customers')}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                  >
                    + Add Solar Customer
                  </button>
                )}
                {currentUser?.role === 'admin' && (
                  <>
                    <button 
                      onClick={() => setCurrentPage('add partner')}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                    >
                      + Add Partner
                    </button>
                    <button 
                      onClick={() => setCurrentPage('add technician')}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                    >
                      + Add Technician
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setCurrentPage('tickets')}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                >
                  + Create Support Ticket
                </button>
                <button 
                  onClick={() => setCurrentPage('reports')}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white p-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg"
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
