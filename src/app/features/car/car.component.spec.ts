import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarComponent } from './car.component';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../core/models/product.model';
import { User } from '../../core/models/user.model';

/**
 * Pruebas unitarias para el componente CarComponent.
 */
describe('CarComponent', () => {
  let component: CarComponent;
  let fixture: ComponentFixture<CarComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  /**
   * Configuración inicial del módulo de pruebas.
   */
  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['selectRootElement', 'setProperty', 'createElement', 'addClass', 'appendChild', 'listen']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, CarComponent], // Importar el componente en lugar de declararlo
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Renderer2, useValue: mockRenderer }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarComponent);
    component = fixture.componentInstance;

    // Configurar el DOM simulado
    const nativeElement = fixture.nativeElement;
    const cartItems = nativeElement.querySelector('#cart-items') || document.createElement('div');
    cartItems.id = 'cart-items';
    nativeElement.appendChild(cartItems);

    const cartTotal = nativeElement.querySelector('#cart-total') || document.createElement('span');
    cartTotal.id = 'cart-total';
    nativeElement.appendChild(cartTotal);

    const cartCount = nativeElement.querySelector('#cart-count') || document.createElement('span');
    cartCount.id = 'cart-count';
    nativeElement.appendChild(cartCount);
  });

  /**
   * Limpieza del DOM después de cada prueba.
   */
  afterEach(() => {
    const nativeElement = fixture.nativeElement;
    const cartItems = nativeElement.querySelector('#cart-items');
    if (cartItems && cartItems.parentNode) {
      cartItems.parentNode.removeChild(cartItems);
    }

    const cartTotal = nativeElement.querySelector('#cart-total');
    if (cartTotal && cartTotal.parentNode) {
      cartTotal.parentNode.removeChild(cartTotal);
    }

    const cartCount = nativeElement.querySelector('#cart-count');
    if (cartCount && cartCount.parentNode) {
      cartCount.parentNode.removeChild(cartCount);
    }
  });

  /**
   * Prueba para verificar que el componente se crea correctamente.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Prueba para verificar que el carrito se inicializa correctamente cuando el usuario está logueado.
   */
  it('inicializar el carrito correctamente cuando el usuario está logueado', () => {
    const mockCart: Product[] = [
      { name: 'Producto 1', brand: 'Marca 1', type: 'Tipo 1', price: 100, imageUrl: '', showMoreInfo: false, moreInfo: '', hidden: false },
      { name: 'Producto 2', brand: 'Marca 2', type: 'Tipo 2', price: 200, imageUrl: '', showMoreInfo: false, moreInfo: '', hidden: false }
    ];

    const adminUser: User = {
      uid: 'asr',
      fullName: 'Admin User',
      username: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin1234',
      confirmPassword: 'admin1234',
      birthdate: '2000-01-01',
      address: 'Admin Address',
      role: 'admin',
      purchaseHistory: [],
      cart: mockCart
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'loggedInUser') {
        return JSON.stringify(adminUser);
      }
      return null;
    });

    fixture.detectChanges();

    expect(component.cart).toEqual(mockCart);
    expect(component.cart.length).toBe(2);
    expect(component.cartTotal).toBe(300);
  });
});
