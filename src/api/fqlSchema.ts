interface Customer {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  assignedTo: string;
  assignedType: string;
  created_at: Date;
  updated_at: Date;
}

interface Order {
  type: string;
  itemId: number;
  quantity: number;
  customerId: number;
  customerName: string;
  itemName: string;
  itemPrice: number;
  totalPrice: number;
  status: string;
  preferredDate: string;
  description: string;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  specifications: string;
  image: string;
  created_at: Date;
  updated_at: Date;
  technicianCommissionPercent: number;
  partnerCommissionPercent: number;
  gstPercent: number;
}

interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  duration: string;
  includes: string;
  created_at: Date;
  updated_at: Date;
}

interface Ticket {
  type: string;
  itemId: number;
  customerId: number;
  customerName: string;
  issue: string;
  notes: string;
  status: string;
  assignedTo: string;
  createdBy: number;
  createdAt: string;
}

interface User {
  username: string;
  password: string;
  role: string;
  name: string;
}