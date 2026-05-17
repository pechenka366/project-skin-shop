export interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  img: string;
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

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
  id: number;
}