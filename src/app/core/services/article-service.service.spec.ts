import { TestBed } from '@angular/core/testing';
import { ArticleService } from './article-service.service';
import { Firestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Product } from '../../core/models/product.model';

// Mock Firestore
const FirestoreMock = {
  collection: () => ({
    get: () => of({
      docs: [
        { uid: '1', data: () => ({ name: 'Producto 1', brand: 'Marca 1', type: 'Tipo 1', price: 100, imageUrl: '', showMoreInfo: false, moreInfo: '', hidden: false }) },
        { uid: '2', data: () => ({ name: 'Producto 2', brand: 'Marca 2', type: 'Tipo 2', price: 200, imageUrl: '', showMoreInfo: false, moreInfo: '', hidden: false }) }
      ]
    })
  })
};


