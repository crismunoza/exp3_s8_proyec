import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ResetpassComponent } from './resetpass.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { MockAuthService } from '../../../testing/mock-firebase';
import { getAuth } from '@angular/fire/auth';

describe('ResetpassComponent', () => {
  let component: ResetpassComponent;
  let fixture: ComponentFixture<ResetpassComponent>;
  let mockAuthService: MockAuthService;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = new MockAuthService();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        ResetpassComponent  // Importa el componente directamente
      ],
      providers: [
        { provide: getAuth, useValue: {} },  // Proveer un valor simulado para getAuth
        { provide: 'sendPasswordResetEmail', useValue: mockAuthService.sendPasswordResetEmail },  // Proveer el mock para sendPasswordResetEmail
        { provide: Router, useValue: mockRouter },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
