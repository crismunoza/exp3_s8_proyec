import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { MockAuthService } from '../../../../testing/mock-firebase';
import { MockAuth } from '../../../../testing/MockAuth';
import { Auth } from '@angular/fire/auth';

/**
 * Pruebas unitarias para el componente NavbarComponent.
 */
describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  /**
   * Configuración inicial del módulo de pruebas.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent, // Importa directamente el componente standalone
        RouterTestingModule // Importa RouterTestingModule para proporcionar ActivatedRoute
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Auth, useClass: MockAuth } // Proveer el mock de Auth
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Prueba para verificar que el componente se haya creado correctamente.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
