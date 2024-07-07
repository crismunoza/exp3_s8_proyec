import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { MockAuthService } from '../../../testing/mock-firebase';  // Asegúrate de importar el mock

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth())
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar un mensaje de alerta', () => {
    component.showAlert('Test message', 'success');
    expect(component.alertMessage).toBe('Test message');
    expect(component.alertType).toBe('success');
  });

  it('debería editar un usuario correctamente', fakeAsync(() => {
    const testUser = {
      uid: '1',
      fullName: 'Jose Pérez Edited',
      username: 'joseperez',
      email: 'joseperez@example.com',
      password: 'Joseperez12345!',
      confirmPassword: 'Joseperez12345!',
      birthdate: '1990-01-01',
      address: '123 Test St',
      role: 'client',
      purchaseHistory: [],
      cart: []
    };

    component.users = [testUser];
    component.editUser(0);

    component.editUserForm.setValue({
      fullName: 'Jose Pérez Edited',
      username: 'joseperez',
      email: 'joseperez@example.com',
      birthdate: '1990-01-01',
      address: '123 Test St'
    });

    component.onSubmit();
    tick(); // Avanza el temporizador

    expect(component.users[0].fullName).toBe('Jose Pérez Edited');

    flush(); // Limpia todos los temporizadores pendientes
  }));

  afterEach(() => {
    localStorage.clear();
  });
});
