import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './widgets/App';
import Layout from './widgets/AppStore';
import Dashboard from './widgets/index';
import CustomerPortal from './widgets/bottom-sheet/index';

function AppContent() {
  const { currentUser } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

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
    <div className="min-h-screen bg-white">
      <AppProvider>
        <AppContent />
      </AppProvider>
    </div>
  );
}

export default App;