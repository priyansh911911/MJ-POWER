import { useState } from 'react';
import { useApp } from '../context/AppContext';

const Orders = () => {
  const { data, updateItem, deleteItem, currentUser } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');

  const canManageOrders = ['admin', 'manager'].includes(currentUser?.role);

  const filteredOrders = data.quotes?.filter((order: any) => 
    statusFilter === 'all' || order.status === statusFilter
  ) || [];

  const handleStatusUpdate = (orderId: any, newStatus: string) => {
    updateItem('orders', orderId, { status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">📋</span> Customer Quotes
        </h2>
        <select
          value={statusFilter}
          onChange={(e: any) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
        >
          <option value="all">All Quotes</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-gray-900 font-semibold">Quote ID</th>
              <th className="p-3 text-left text-gray-900 font-semibold">Customer</th>
              <th className="p-3 text-left text-gray-900 font-semibold">Email</th>
              <th className="p-3 text-left text-gray-900 font-semibold">Phone</th>
              <th className="p-3 text-left text-gray-900 font-semibold">Address</th>
              <th className="p-3 text-left text-gray-900 font-semibold">Items</th>
              <th className="p-3 text-left text-gray-900 font-semibold">Subtotal</th>
              <th className="p-3 text-left text-gray-900 font-semibold">Tax</th>
              <th className="p-3 text-left text-gray-900 font-semibold">Total</th>
              <th className="p-3 text-left text-gray-900 font-semibold">Date</th>
              {canManageOrders && <th className="p-3 text-left text-gray-900 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order: any) => (
                <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50 transition-all">
                  <td className="p-3 text-gray-900 font-medium">#{order.id}</td>
                  <td className="p-3 text-gray-700">{order.name}</td>
                  <td className="p-3 text-gray-700">{order.email}</td>
                  <td className="p-3 text-gray-700">{order.phone}</td>
                  <td className="p-3 text-gray-700 max-w-xs truncate" title={order.address}>{order.address}</td>
                  <td className="p-3 text-gray-700">
                    <div className="max-w-xs">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          {item.name} - ₹{item.price} x {item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-gray-700">₹{order.subtotal}</td>
                  <td className="p-3 text-gray-700">₹{order.tax}</td>
                  <td className="p-3 text-green-600 font-semibold">₹{order.totalAmount}</td>
                  <td className="p-3 text-gray-700">{new Date(order.created_at || Date.now()).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">{order.createdAt}</td>
                  {canManageOrders && (
                    <td className="p-3 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e: any) => handleStatusUpdate(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 mr-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => deleteItem('quotes', order.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canManageOrders ? 11 : 10} className="p-6 text-center text-gray-500">
                  No quotes found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-gray-700 font-semibold">Order #{order.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 font-semibold">Customer: </span>
                  <span className="text-gray-900">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-700 font-semibold">Item: </span>
                  <span className="text-gray-900">{order.itemName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-700 font-semibold">Type: </span>
                    <span className="text-gray-800 capitalize">{order.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-semibold">Qty: </span>
                    <span className="text-gray-800">{order.quantity || 1}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-700 font-semibold">Total: </span>
                  <span className="text-green-600 font-bold">₹{order.totalPrice || order.itemPrice}</span>
                </div>
                <div>
                  <span className="text-gray-700 font-semibold">Date: </span>
                  <span className="text-gray-800">{order.createdAt}</span>
                </div>
                {canManageOrders && (
                  <div className="flex gap-2 pt-2">
                    <select
                      value={order.status}
                      onChange={(e: any) => handleStatusUpdate(order.id, e.target.value)}
                      className="flex-1 text-sm border border-gray-300 rounded px-2 py-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => deleteItem('quotes', order.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-all"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 p-6 rounded-xl text-center text-gray-500">
            No quotes found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;