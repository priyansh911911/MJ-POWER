import { createContext, useContext, useState, useEffect } from 'react';
import storageData from '../assets/data/storage.json';
import Api from '../services/Api';
import { fql } from '../events/fqlClient';

const AppContext = createContext<any>({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
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
        fql.customers.findMany({}),
        fql.products.findMany({}),
        fql.services.findMany({}),
        fql.tickets.findMany({}),
        fql.orders.findMany({})
      ]);

      console.log('Setting data from FQL:', {
        customers: customers?.result || [],
        products: products?.result || [],
        services: services?.result || [],
        tickets: tickets?.result || [],
        orders: orders?.result || []
      });
      
      setData({
        ...storageData,
        customers: customers?.result || [],
        products: products?.result || [],
        services: services?.result || [],
        tickets: tickets?.result || [],
        orders: orders?.result || []
      });
    } catch (error) {
      console.error('Failed to load from database:', error);
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

  const login = (username: string, password: string, customUser: any = null) => {
    if (customUser) {
      setCurrentUser(customUser);
      return true;
    }

    const user = data.users?.find((u: any) => u.username === username && u.password === password);
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
        setData((prev: any) => ({
          ...prev,
          [key]: [],
        }));
        return;
      }

      const products = await fql.products.findMany({});

      const filtered = products.result?.filter((item: any) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ) || [];

      setData((prev: any) => ({
        ...prev,
        [key]: filtered,
      }));
    } catch (error) {
      console.error("fetchData error:", error);
      setData((prev: any) => ({
        ...prev,
        [key]: [],
      }));
    }
  };

  const updateData = (key: string, newData: any) => {
    setData((prev: any) => ({
      ...prev,
      [key]: newData
    }));
  };

  const addItem = async (key: string, item: any) => {
    try {
      console.log(`=== Adding item to ${key} ===`);
      console.log('Item data:', item);
      console.log('FQL collection exists:', !!(fql as any)[key]);
      
      const response = await (fql as any)[key].createOne(item, {});
      console.log('FQL response:', response);
      
      if (response.err) {
        console.log('API returned error, falling back to local storage');
        throw new Error(response.err.message || response.result);
      }

      const newItem = { ...item, id: response.result.id };
      setData((prev: any) => ({
        ...prev,
        [key]: [...(prev[key] || []), newItem]
      }));
      
      console.log(`Successfully added to ${key}:`, newItem);
      
      if (key === 'products') {
        setTimeout(async () => {
          const currentProducts = await fql.products.findMany({});
          console.log('=== Current Products in Database ===', currentProducts);
        }, 1000);
      }
      
      return newItem;
    } catch (error) {
      console.error(`Database add failed for ${key}:`, error);
      const newItem = { ...item, id: Date.now() };
      setData((prev: any) => ({
        ...prev,
        [key]: [...(prev[key] || []), newItem]
      }));
      return newItem;
    }
  };

  const updateItem = async (key: string, id: any, updatedItem: any) => {
    try {
      await (fql as any)[key].updateById(id, updatedItem, { useSession: true });
      setData((prev: any) => ({
        ...prev,
        [key]: prev[key].map((item: any) => item.id === id ? { ...item, ...updatedItem } : item)
      }));
    } catch (error) {
      console.error('Database update failed:', error);
      setData((prev: any) => ({
        ...prev,
        [key]: prev[key].map((item: any) => item.id === id ? { ...item, ...updatedItem } : item)
      }));
    }
  };

  const deleteItem = async (key: string, id: any) => {
    try {
      await (fql as any)[key].softDeleteById(id, { useSession: true });
      setData((prev: any) => ({
        ...prev,
        [key]: prev[key].filter((item: any) => item.id !== id)
      }));
    } catch (error) {
      console.error('Database delete failed:', error);
      setData((prev: any) => ({
        ...prev,
        [key]: prev[key].filter((item: any) => item.id !== id)
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