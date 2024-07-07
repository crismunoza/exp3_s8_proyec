import { of } from 'rxjs';
import { User } from '../app/core/models/user.model';
export class MockAuthService {

  login(email: string, password: string) {
    return of({
      user: { uid: 'testUid' }
    });
  }

  getUserProfile(uid: string) {
    const mockUser: User = {
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
  
  register(email: string, password: string) {
    return of({
      user: { uid: '1' }
    });
  }

  saveUserProfile(user: any) {
    return Promise.resolve();
  }

  sendPasswordResetEmail(auth: any, email: string) {
    return Promise.resolve();
  }
}
