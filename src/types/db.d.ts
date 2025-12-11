export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
}

export interface Ticket {
  id: number;
  title: string;
  description?: string;
  status: string;
  customer_id: number;
}

export interface Order {
  id: number;
  customer_id: number;
  total: number;
  status: string;
  created_at: string;
}