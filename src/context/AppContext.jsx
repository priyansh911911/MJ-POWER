import React, { createContext, useContext, useState, useEffect } from 'react';
import storageData from '../data/storage.json';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('mjpower-data');
    return saved ? JSON.parse(saved) : storageData;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mjpower-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('mjpower-data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mjpower-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mjpower-user');
    }
  }, [currentUser]);

  const login = (username, password, customUser = null) => {
    if (customUser) {
      // For customer login
      setCurrentUser(customUser);
      return true;
    }
    
    const user = data.users?.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const updateData = (key, newData) => {
    setData(prev => ({
      ...prev,
      [key]: newData
    }));
  };

  const addItem = (key, item) => {
    const newItem = { ...item, id: Date.now() };
    setData(prev => ({
      ...prev,
      [key]: [...prev[key], newItem]
    }));
    return newItem;
  };

  const updateItem = (key, id, updatedItem) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].map(item => item.id === id ? { ...item, ...updatedItem } : item)
    }));
  };

  const deleteItem = (key, id) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].filter(item => item.id !== id)
    }));
  };

  return (
    <AppContext.Provider value={{
      data,
      currentUser,
      currentPage,
      setCurrentPage,
      login,
      logout,
      updateData,
      addItem,
      updateItem,
      deleteItem
    }}>
      {children}
    </AppContext.Provider>
  );
};