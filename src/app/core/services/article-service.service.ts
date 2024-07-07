import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';

/**
 * Servicio para manejar los artículos (productos).
 */
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private firestore: Firestore) {}

  /**
   * Obtiene una lista de productos desde Firestore.
   * @returns Un observable que emite una lista de productos.
   */
  getProducts(): Observable<Product[]> {
    const productCollection = collection(this.firestore, 'article');
    return collectionData(productCollection, { idField: 'id' }) as Observable<Product[]>;
  }
}
