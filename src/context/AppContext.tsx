import React, { createContext, useContext, useState, useEffect } from 'react';
import storageData from '../assets/data/storage.json';
import Api from '../services/Api';
import { fql } from '../api/fqlClient';

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
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mjpower-data');
      return saved ? JSON.parse(saved) : storageData;
    }
    return storageData;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mjpower-user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [useCloud, setUseCloud] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mjpower-data', JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    loadFromDatabase();
  }, []);

  const loadFromDatabase = async () => {
    try {
      const [customers, products, services, tickets, orders] = await Promise.all([
        Api.get('/customers'),
        Api.get('/products'),
        Api.get('/services'),
        Api.get('/tickets'),
        Api.get('/orders')
      ]);

      setData({
        ...storageData,
        customers: customers?.data || [],
        products: products?.data || [],
        services: services?.data || [],
        tickets: tickets?.data || [],
        orders: orders?.data || []
      });
    } catch (error) {
      console.error('Failed to load from database:', error);
      // Keep using localStorage data as fallback
    }
  };

  const syncToCloud = async () => {
    try {
      await Api.post('/mjpower_data', { body: data });
    } catch (error) {
      console.error('Cloud sync failed:', error);
    }
  };

  const loadFromCloud = async () => {
    try {
      const cloudData = await Api.get('/mjpower_data');
      if (cloudData) {
        setData(cloudData);
      }
    } catch (error) {
      console.error('Cloud load failed:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('mjpower-user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('mjpower-user');
      }
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

  const fetchData = async (key: keyof typeof data, query: string) => {
    try {
      if (!query?.trim()) {
        setData(prev => ({
          ...prev,
          [key]: [],
        }));
        return;
      }

      const products = await fql.products.findAll();

      const filtered = products.result?.filter((item: any) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ) || [];

      setData(prev => ({
        ...prev,
        [key]: filtered,
      }));
    } catch (error) {
      console.error("fetchData error:", error);
      setData(prev => ({
        ...prev,
        [key]: [],
      }));
    }
  };




  const updateData = (key, newData) => {
    setData(prev => ({
      ...prev,
      [key]: newData
    }));
  };

  const addItem = async (key, item) => {
    console.log(`Attempting to add ${key}:`, item);
    // console.log('Base URL:', _BASE_URL);

    try {
      console.log(`Making API call to: POST /${key}`);
      const response = await Api.post(`/${key}`, { body: item });
      console.log('API Response:', response);

      const newItem = response.data?.[0] || { ...item, id: Date.now() };

      setData(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), newItem]
      }));

      console.log('Item added to local state:', newItem);
      return newItem;
    } catch (error) {
      console.error('Database add failed:', error);
      console.error('Error details:', error.response?.data || error.message);

      // Fallback to local storage
      const newItem = { ...item, id: Date.now() };
      setData(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), newItem]
      }));
      console.log('Using fallback - item added locally:', newItem);
      return newItem;
    }
  };

  const updateItem = async (key, id, updatedItem) => {
    try {
      await Api.put(`/${key}/${id}`, { body: updatedItem });

      setData(prev => ({
        ...prev,
        [key]: prev[key].map(item => item.id === id ? { ...item, ...updatedItem } : item)
      }));
    } catch (error) {
      console.error('Database update failed:', error);
      // Fallback to local update
      setData(prev => ({
        ...prev,
        [key]: prev[key].map(item => item.id === id ? { ...item, ...updatedItem } : item)
      }));
    }
  };

  const deleteItem = async (key, id) => {
    try {
      await Api.delete(`/${key}/${id}`);

      setData(prev => ({
        ...prev,
        [key]: prev[key].filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Database delete failed:', error);
      // Fallback to local delete
      setData(prev => ({
        ...prev,
        [key]: prev[key].filter(item => item.id !== id)
      }));
    }
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
      deleteItem,
      useCloud,
      setUseCloud,
      syncToCloud,
      loadFromCloud,
      fetchData
    }}>
      {children}
    </AppContext.Provider>
  );
};