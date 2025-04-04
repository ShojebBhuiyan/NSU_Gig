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
  userId: string;
  items: any[]; // Will handle the specific item structure in the component
  amount: number;
  status: string;
  date: string;
  address: any; // Will handle the specific address structure in the component
  payment: boolean;
  __v: number;
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