import  { Product } from './product.model';
/**
 * Interfaz que representa al usuario.
 */
export interface User {
    uid: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    birthdate: string;
    address?: string;
    role: string; // "client" o "admin"
    purchaseHistory: Product[];
    cart: Product[];
  }
  