import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { PayComponent } from './pay.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { of } from 'rxjs';

class AuthServiceMock {
  updateUserProfile(user: any) {
    return of(null);
  }
}

class UserServiceMock {
  setUserStatus(user: any) {}
}

describe('PayComponent', () => {
  let component: PayComponent;
  let fixture: ComponentFixture<PayComponent>;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        PayComponent // Importar el componente aquí porque es standalone
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: UserService, useClass: UserServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe completar el pago correctamente con datos válidos', fakeAsync(() => {
    const testUser = {
      uid: '1',
      fullName: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
      birthdate: '1990-01-01',
      address: 'Test Address',
      role: 'client',
      purchaseHistory: [],
      cart: [
        { name: 'Product 1', brand: 'Brand 1', type: 'Type 1', price: 100, imageUrl: '', showMoreInfo: false, moreInfo: '', hidden: false }
      ]
    };

    localStorage.setItem('loggedInUser', JSON.stringify(testUser));
    component.ngOnInit();
    fixture.detectChanges();

    component.loggedInUser = testUser;
    component.onSubmit({
      value: {
        cardNumber: '1234567890123456',
        expiryDate: '12/25',
        cvv: '123'
      }
    } as any);

    tick(1500); // Avanza el temporizador de 1500ms
    flush(); // Limpia cualquier temporizador restante

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/Record']);
    expect(component.loggedInUser.cart.length).toBe(0);
  }));
});
