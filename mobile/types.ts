import { ImageSourcePropType } from 'react-native';

export interface Food {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: ImageSourcePropType;
  category: string;
}

export interface CartItem extends Food {
  quantity: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

export interface Order {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
} 