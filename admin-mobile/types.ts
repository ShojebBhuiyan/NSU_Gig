import { ImageSourcePropType } from 'react-native';

export interface Food {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: ImageSourcePropType | string;
  category: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    food: Food;
    quantity: number;
    _id: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
  address: string;
  phone: string;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface FoodFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string | null;
} 