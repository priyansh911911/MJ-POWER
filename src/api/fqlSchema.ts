export interface BaseRecord {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Customers extends BaseRecord {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  assignedTo: string;
  assignedType: string;
}

export interface Orders extends BaseRecord {
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
}

export interface Products extends BaseRecord {
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

export interface Services extends BaseRecord {
  name: string;
  category: string;
  price: number;
  description: string;
  duration: string;
  includes: string;
}

export interface Tickets extends BaseRecord {
  type: string;
  itemId: number;
  customerId: number;
  customerName: string;
  issue: string;
  notes: string;
  status: string;
  assignedTo: string;
}

export interface Users extends BaseRecord {
  username: string;
  password: string;
  role: string;
  name: string;
}

export interface Quotes extends BaseRecord {
  name: string;
  phone: string;
  email: string;
  address: string;
  propertyType: string;
  roofArea: string;
  monthlyBill: string;
  requirements: string;
  customerId?: number;
  customerName: string;
  status: string;
  estimatedCost: number;
  estimatedSavings: number;
  type: string;
  items?: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal?: number;
  tax?: number;
  totalAmount?: number;
}