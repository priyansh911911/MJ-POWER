import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './widgets/App';
import Layout from './widgets/AppStore';
import Dashboard from './widgets/index';
import CustomerPortal from './widgets/bottom-sheet/index';

function AppContent() {
  const { currentUser } = useApp();
  const [mounted, setMounted] = useState(false);
  const [showStaffLogin, setShowStaffLogin] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  // Show staff login when requested
  if (showStaffLogin && !currentUser) {
    return <Login onBackToCustomer={() => setShowStaffLogin(false)} />;
  }

  // Show customer portal for customers or guest users
  if (!currentUser || currentUser.role === 'customer') {
    return <CustomerPortal onStaffLogin={() => setShowStaffLogin(true)} />;
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