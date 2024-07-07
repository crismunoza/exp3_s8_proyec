import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordComponent } from './record.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MockAuthService } from '../../../testing/mock-firebase'; // Importa el mock del servicio de autenticación
import { of } from 'rxjs';

describe('RecordComponent', () => {
  let component: RecordComponent;
  let fixture: ComponentFixture<RecordComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RecordComponent, // Importa el componente standalone
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cargar el historial de compras del usuario logueado', () => {
    const mockUser = {
      uid: '1',
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

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'loggedInUser') {
        return JSON.stringify(mockUser);
      }
      return null;
    });

    spyOn(authService, 'getUserProfile').and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.loggedInUser).toEqual(mockUser);
    expect(component.purchaseHistory.length).toBe(2);
  });
});
