import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Firestore } from '@angular/fire/firestore';
import { MockAuthService } from '../../../testing/mock-firebase';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAuthService: MockAuthService;
  let mockFirestore: jasmine.SpyObj<Firestore>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserService = jasmine.createSpyObj('UserService', ['setUserStatus']);
    mockAuthService = new MockAuthService();
    mockFirestore = jasmine.createSpyObj('Firestore', ['collection', 'doc']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ProfileComponent // Importar directamente el componente standalone
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Firestore, useValue: mockFirestore } // Proveer el mock de Firestore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cambiar el nombre completo del usuario logueado', () => {
    const mockUser = {
      uid: '1',
      fullName: 'Jose Pérez',
      username: 'joseperez',
      email: 'nuevo@example.com',
      password: 'Joseperez12345!',
      confirmPassword: 'Joseperez12345!',
      birthdate: '1995-05-15',
      address: 'Calle Falsa 123',
      role: 'client',
      purchaseHistory: [],
      cart: []
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'loggedInUser') {
        return JSON.stringify(mockUser);
      }
      return null;
    });

    component.ngOnInit();
    fixture.detectChanges();

    const newFullName = 'Juan Pérez';
    component.profileForm.controls['fullName'].setValue(newFullName);
    expect(component.profileForm.value.fullName).toBe(newFullName);
  });
});
