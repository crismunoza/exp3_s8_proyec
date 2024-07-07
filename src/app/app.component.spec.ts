import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../src/app/core/services/auth.service';
import { MockAuthService } from '../testing/mock-firebase';
import { MockAuth } from '../testing/MockAuth';
import { Auth } from '@angular/fire/auth';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent  // Importa el componente directamente
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Auth, useClass: MockAuth }, // Proveer el mock de Auth
        provideRouter([])  // Provee el enrutador con rutas vacías para evitar el error de enrutador
      ]
    }).compileComponents();
  });

  it('debería ser creado', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debería tener el título "proyecto"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('proyecto');
  });

});
