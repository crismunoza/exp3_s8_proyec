import { Component, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';
import { Product } from '../../core/models/product.model';

/**
 * CarComponent es el componente encargado de mostrar y gestionar el carrito de compras.
 */
@Component({
  selector: 'app-car',
  standalone: true,
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  /**
   * Lista de productos en el carrito.
   */
  cart: Product[] = [];

  /**
   * Total del carrito.
   */
  cartTotal: number = 0;

  /**
   * Cantidad de productos en el carrito.
   */
  cartCount: number = 0;

  /**
   * Constructor del componente.
   * @param renderer Renderer2 para manipular el DOM.
   * @param router Router para la navegación.
   * @param platformId Identificador de la plataforma (browser o server).
   */
  constructor(private renderer: Renderer2, private router: Router, @Inject(PLATFORM_ID) private platformId: any) {}

  /**
   * Método de inicialización del componente.
   * Carga el carrito desde localStorage y actualiza la vista.
   */
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCart();
      this.updateCart();
    }
  }

  /**
   * Inicializa el carrito cargando los datos del usuario desde localStorage.
   */
  initializeCart() {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      const loggedInUser: User = JSON.parse(userData);
      this.cart = loggedInUser.cart || [];
    } else {
      alert('Por favor, inicia sesión para ver tu carrito.');
      this.router.navigate(['/Login']);
    }
  }

  /**
   * Actualiza la vista del carrito.
   */
  updateCart() {
    const cartItems = this.renderer.selectRootElement('#cart-items', true);
    const cartTotal = this.renderer.selectRootElement('#cart-total', true);
    const cartCount = this.renderer.selectRootElement('#cart-count', true);

    this.renderer.setProperty(cartItems, 'innerHTML', '');
    this.cartTotal = 0;

    this.cart.forEach((item, index) => {
      const itemElement = this.renderer.createElement('div');
      this.renderer.addClass(itemElement, 'list-group-item');
      this.renderer.addClass(itemElement, 'd-flex');
      this.renderer.addClass(itemElement, 'justify-content-between');
      this.renderer.addClass(itemElement, 'align-items-center');

      const itemContent = `
        <div>
          <h5 class="mb-1">${item.name}</h5>
          <p class="mb-1">$${item.price}</p>
        </div>
        <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
      `;

      this.renderer.setProperty(itemElement, 'innerHTML', itemContent);
      this.renderer.appendChild(cartItems, itemElement);
      this.cartTotal += item.price;
    });

    this.renderer.setProperty(cartTotal, 'textContent', this.cartTotal.toString());
    this.renderer.setProperty(cartCount, 'textContent', this.cart.length.toString());

    const buttons = Array.from(cartItems.getElementsByClassName('btn-danger')) as HTMLButtonElement[];
    buttons.forEach((button: HTMLButtonElement) => {
      this.renderer.listen(button, 'click', (event: Event) => {
        const target = event.target as HTMLButtonElement;
        const index = target.getAttribute('data-index');
        if (index !== null) {
          this.cart.splice(parseInt(index), 1);
          this.updateCart();
          this.saveCart();
        }
      });
    });
  }

  /**
   * Guarda el carrito en localStorage.
   */
  saveCart() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('loggedInUser');
      if (userData) {
        const loggedInUser: User = JSON.parse(userData);
        loggedInUser.cart = this.cart;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        let users: User[] = JSON.parse(localStorage.getItem('users') ?? '[]');
        users = users.map((user: User) => user.email === loggedInUser.email ? loggedInUser : user);
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  }

  /**
   * Navega a la página de pago.
   */
  onProceedPayment() {
    this.router.navigate(['/Pay']);
    // Aquí puedes agregar lógica adicional para manejar el pago
  }

  /**
   * Navega a la página de historial.
   */
  onHistory() {
    this.router.navigate(['/Record']);
    // Aquí puedes agregar lógica adicional para manejar el historial
  }
}
