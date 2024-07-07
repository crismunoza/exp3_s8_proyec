/**
 * Interfaz que representa el producto.
 */
export interface Product {
  name: string;
  brand: string;
  type: string;
  price: number;
  imageUrl: string;
  showMoreInfo: boolean;
  moreInfo: string;
  hidden: boolean;
  date?: string; 
}
