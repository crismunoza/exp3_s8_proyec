import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('debería establecer el estado del usuario', () => {
    const mockUser: User = {
      uid: '1',
      fullName: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      birthdate: '1990-01-01',
      address: '123 Main St',
      role: 'client',
      purchaseHistory: [],
      cart: []
    };

    service.setUserStatus(mockUser);
    service.userStatus$.subscribe(userStatus => {
      expect(userStatus).toEqual(mockUser);
    });
  });
});
