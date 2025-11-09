import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Reports = () => {
  const { data, currentUser, addItem } = useApp();
  const [showBonusForm, setShowBonusForm] = useState(false);
  const [bonusData, setBonusData] = useState({
    userId: '',
    amount: '',
    reason: ''
  });

  const canManageBonuses = ['admin', 'manager'].includes(currentUser?.role);

  const calculateCommissions = () => {
    const commissions = {};
    
    data.tickets.filter(t => t.status === 'completed').forEach(ticket => {
      const item = (ticket.type === 'product' ? data.products : data.services)
        .find(i => i.id == ticket.itemId);
      
      if (item) {
        const customer = data.customers.find(c => c.id == ticket.customerId);
        const partner = customer ? data.users.find(u => u.id == customer.assignedTo && u.role === 'partner') : null;
        const technician = data.users.find(u => u.id == ticket.assignedTo);
        
        if (partner) {
          if (!commissions[partner.id]) {
            commissions[partner.id] = { user: partner, total: 0, items: [] };
          }
          const commission = (item.price * item.partnerCommissionPercent) / 100;
          commissions[partner.id].total += commission;
          commissions[partner.id].items.push({ item: item.name, commission });
        }
        
        if (technician) {
          if (!commissions[technician.id]) {
            commissions[technician.id] = { user: technician, total: 0, items: [] };
          }
          const commission = (item.price * item.technicianCommissionPercent) / 100;
          commissions[technician.id].total += commission;
          commissions[technician.id].items.push({ item: item.name, commission });
        }
      }
    });
    
    return commissions;
  };

  const getBonuses = () => {
    return data.bonuses || [];
  };

  const handleBonusSubmit = (e) => {
    e.preventDefault();
    addItem('bonuses', {
      ...bonusData,
      amount: parseFloat(bonusData.amount),
      addedBy: currentUser.id,
      addedAt: new Date().toISOString()
    });
    setBonusData({ userId: '', amount: '', reason: '' });
    setShowBonusForm(false);
  };

  const commissions = calculateCommissions();
  const bonuses = getBonuses();

  const getMyData = () => {
    if (currentUser?.role === 'partner') {
      const myCustomers = data.customers.filter(c => c.assignedTo == currentUser.id);
      const myTickets = data.tickets.filter(t => 
        myCustomers.some(c => c.id == t.customerId)
      );
      const myCommission = commissions[currentUser.id]?.total || 0;
      const myBonuses = bonuses.filter(b => b.userId == currentUser.id);
      const totalBonuses = myBonuses.reduce((sum, b) => sum + b.amount, 0);
      
      return {
        customers: myCustomers.length,
        tickets: myTickets.length,
        commission: myCommission,
        bonuses: totalBonuses,
        totalEarnings: myCommission + totalBonuses
      };
    }
    
    if (currentUser?.role === 'technician') {
      const myTickets = data.tickets.filter(t => t.assignedTo == currentUser.id);
      const completedTickets = myTickets.filter(t => t.status === 'completed');
      const myCommission = commissions[currentUser.id]?.total || 0;
      const myBonuses = bonuses.filter(b => b.userId == currentUser.id);
      const totalBonuses = myBonuses.reduce((sum, b) => sum + b.amount, 0);
      
      return {
        assignedTickets: myTickets.length,
        completedTickets: completedTickets.length,
        commission: myCommission,
        bonuses: totalBonuses,
        totalEarnings: myCommission + totalBonuses
      };
    }
    
    return null;
  };

  const myData = getMyData();

  if (currentUser?.role === 'partner' || currentUser?.role === 'technician') {
    return (
      <div className="p-4">
        <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-6">My Reports</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {currentUser.role === 'partner' && (
            <>
              <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
                <h3 className="text-green-400 text-sm lg:text-lg font-semibold">My Customers</h3>
                <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">{myData.customers}</p>
              </div>
              <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
                <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Tickets Raised</h3>
                <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">{myData.tickets}</p>
              </div>
            </>
          )}
          
          {currentUser.role === 'technician' && (
            <>
              <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
                <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Assigned Tickets</h3>
                <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">{myData.assignedTickets}</p>
              </div>
              <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
                <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Completed Tickets</h3>
                <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">{myData.completedTickets}</p>
              </div>
            </>
          )}
          
          <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
            <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Commission</h3>
            <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">₹{myData.commission.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
            <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Bonuses</h3>
            <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">₹{myData.bonuses.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
            <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Total Earnings</h3>
            <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">₹{myData.totalEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-green-400">Reports & Analytics</h2>
        {canManageBonuses && (
          <button
            onClick={() => setShowBonusForm(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white w-full sm:w-auto"
          >
            Add Bonus
          </button>
        )}
      </div>

      {showBonusForm && (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg mb-6 border border-green-600">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Add Bonus</h3>
          <form onSubmit={handleBonusSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={bonusData.userId}
              onChange={(e) => setBonusData({...bonusData, userId: e.target.value})}
              className="p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              required
            >
              <option value="">Select User</option>
              {data.users.filter(u => ['partner', 'technician'].includes(u.role)).map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Bonus Amount"
              value={bonusData.amount}
              onChange={(e) => setBonusData({...bonusData, amount: e.target.value})}
              className="p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              required
            />
            <input
              type="text"
              placeholder="Reason"
              value={bonusData.reason}
              onChange={(e) => setBonusData({...bonusData, reason: e.target.value})}
              className="p-3 bg-gray-700 text-green-100 rounded border border-green-600"
              required
            />
            <div className="sm:col-span-3 flex flex-col sm:flex-row gap-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">
                Add Bonus
              </button>
              <button type="button" onClick={() => setShowBonusForm(false)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
          <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Total Customers</h3>
          <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">{data.customers.length}</p>
        </div>
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
          <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Total Tickets</h3>
          <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">{data.tickets.length}</p>
        </div>
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
          <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Completed Tickets</h3>
          <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">
            {data.tickets.filter(t => t.status === 'completed').length}
          </p>
        </div>
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg border border-green-600">
          <h3 className="text-green-400 text-sm lg:text-lg font-semibold">Total Commissions</h3>
          <p className="text-xl lg:text-3xl font-bold text-green-100 mt-1 lg:mt-2">
            ₹{Object.values(commissions).reduce((sum, c) => sum + c.total, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-gray-800 rounded-lg border border-green-600">
          <h3 className="text-base lg:text-lg font-semibold text-green-400 p-4 border-b border-gray-700">
            Commission Summary
          </h3>
          <div className="p-4">
            {Object.values(commissions).map(({ user, total }) => (
              <div key={user.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-green-100 text-sm lg:text-base">{user.name} ({user.role})</span>
                <span className="text-green-400 font-semibold text-sm lg:text-base">₹{total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-green-600">
          <h3 className="text-base lg:text-lg font-semibold text-green-400 p-4 border-b border-gray-700">
            Recent Bonuses
          </h3>
          <div className="p-4">
            {bonuses.slice(-10).map(bonus => {
              const user = data.users.find(u => u.id == bonus.userId);
              return (
                <div key={bonus.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <div>
                    <span className="text-green-100 text-sm lg:text-base">{user?.name}</span>
                    <p className="text-xs lg:text-sm text-gray-400">{bonus.reason}</p>
                  </div>
                  <span className="text-green-400 font-semibold text-sm lg:text-base">₹{bonus.amount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;