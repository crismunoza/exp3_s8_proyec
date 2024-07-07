import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MockAuthService } from '../../../testing/mock-firebase'; // Asegúrate de tener un MockAuthService definido

/**
 * Pruebas unitarias para el componente RegisterComponent.
 */
describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: jasmine.SpyObj<Router>;

  /**
   * Configuración inicial del módulo de pruebas.
   */
  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RegisterComponent // Importa directamente el componente standalone
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  /**
   * Prueba para verificar que un nuevo usuario se registre correctamente con datos válidos.
   */
  it('debería registrar un nuevo usuario con datos válidos', fakeAsync(() => {
    const nuevoUsuario = {
      uid: '1',
      fullName: 'Jose Pérez',
      username: 'joseperez',
      email: 'test@example.com',
      password: 'Joseperez12345!',
      confirmPassword: 'Joseperez12345!',
      birthdate: '1995-05-15',
      address: 'Calle Falsa 123',
      role: 'client',
      purchaseHistory: [],
      cart: []
    };

    component.registerForm.controls['fullName'].setValue(nuevoUsuario.fullName);
    component.registerForm.controls['username'].setValue(nuevoUsuario.username);
    component.registerForm.controls['email'].setValue(nuevoUsuario.email);
    component.registerForm.controls['password'].setValue(nuevoUsuario.password);
    component.registerForm.controls['confirmPassword'].setValue(nuevoUsuario.confirmPassword);
    component.registerForm.controls['birthdate'].setValue(nuevoUsuario.birthdate);
    component.registerForm.controls['address'].setValue(nuevoUsuario.address);

    component.onSubmit();
    tick(2000); // Simula el paso del tiempo para que el setTimeout en onSubmit se ejecute
    flush(); // Limpia cualquier temporizador restante

    // Verifica que la navegación se haya llamado correctamente
    expect(router.navigate).toHaveBeenCalledWith(['/Login']);
  }));
});
