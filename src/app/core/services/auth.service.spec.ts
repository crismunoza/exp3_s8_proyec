import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { of, from } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

/**
 * Mock de AuthService para simular las llamadas a métodos de autenticación.
 */
class AuthServiceMock {
  getUserProfile(uid: string) {
    const mockUser = {
      uid: 'testUid',
      fullName: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      birthdate: '1990-01-01',
      address: '123 Main St',
      role: 'client',
      purchaseHistory: [
        { name: 'Product 1', brand: 'Brand A', type: 'Type 1', price: 100, imageUrl: 'url1', showMoreInfo: false, moreInfo: 'Info 1', hidden: false, date: '2023-01-01' },
        { name: 'Product 2', brand: 'Brand B', type: 'Type 2', price: 200, imageUrl: 'url2', showMoreInfo: false, moreInfo: 'Info 2', hidden: false, date: '2023-02-01' }
      ],
      cart: []
    };
    return of(mockUser);
  }
}

/**
 * Mock de Firestore para simular las llamadas a Firestore.
 */
class FirestoreMock {
  doc() {
    return {};
  }
  setDoc() {
    return Promise.resolve();
  }
}

/**
 * Mock de UserService para simular las llamadas a métodos de usuario.
 */
class UserServiceMock {
  setUserStatus(user: any) {}
}

/**
 * Pruebas unitarias para el servicio AuthService.
 */
describe('AuthService', () => {
  let service: AuthService;
  let authMock: AuthServiceMock;
  let firestoreMock: FirestoreMock;
  let userServiceMock: UserServiceMock;

  beforeEach(() => {
    authMock = new AuthServiceMock();
    firestoreMock = new FirestoreMock();
    userServiceMock = new UserServiceMock();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: authMock },
        { provide: Firestore, useValue: firestoreMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  /**
   * Prueba para verificar que el servicio se crea correctamente.
   */
  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Prueba para verificar que el método getUserProfile obtiene el perfil de usuario.
   */
});
