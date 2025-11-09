import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Login />;
  }

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