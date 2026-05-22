export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: "user" | "admin";
}

export interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  img?: string;
  images?: string[];
  description?: string;
  category?: string;
  stock?: number;
  features?: string[];
  materials?: string[];
  size?: string;
}

export interface CartItem {
  _id: string;
  productId: string;
  userId: string;
  name: string;
  title: string;
  price: number;
  img: string;
  quantity: number;
}

export interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  id: number;
}
