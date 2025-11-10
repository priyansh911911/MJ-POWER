import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CustomerPortal from './components/CustomerPortal';

function AppContent() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  // Show customer portal for customers
  if (currentUser.role === 'customer') {
    return <CustomerPortal />;
  }

  // Show admin/staff dashboard for other users
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;