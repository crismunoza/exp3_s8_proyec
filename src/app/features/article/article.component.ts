import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { User } from '../../core/models/user.model';
import { ArticleService } from '../../core/services/article-service.service';
import { UserService } from '../../core/services/user.service';

/**
 * Componente para la visualización y gestión de artículos (productos).
 */
@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  filters: any = {
    price: [],
    brand: [],
    type: []
  };
  alertMessage: string = '';

  constructor(private router: Router, private articleService: ArticleService, private userService: UserService) {}

  ngOnInit() {
    this.articleService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      console.log(this.products);
      this.filterProducts();
    });
  }

  /**
   * Muestra más información sobre un producto.
   * @param product El producto seleccionado.
   */
  toggleMoreInfo(product: Product) {
    this.selectedProduct = product;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra la vista de más información sobre el producto.
   */
  closeMoreInfo() {
    this.selectedProduct = null;
    document.body.style.overflow = 'auto';
  }

  /**
   * Actualiza los filtros de productos según el tipo y valor seleccionados.
   * @param type El tipo de filtro.
   * @param value El valor del filtro.
   * @param event El evento de selección.
   */
  updateFilters(type: string, value: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.filters[type].push(value);
    } else {
      const index = this.filters[type].indexOf(value);
      if (index > -1) {
        this.filters[type].splice(index, 1);
      }
    }
    this.filterProducts();
  }

  /**
   * Filtra los productos según los filtros seleccionados.
   */
  filterProducts() {
    this.products.forEach(product => {
      const matchesPrice = this.filters.price.length === 0 || this.filters.price.some((priceRange: string) => this.checkPriceRange(product.price, priceRange));
      const matchesBrand = this.filters.brand.length === 0 || this.filters.brand.includes(product.brand);
      const matchesType = this.filters.type.length === 0 || this.filters.type.includes(product.type);

      product.hidden = !(matchesPrice && matchesBrand && matchesType);
    });
  }

  /**
   * Verifica si el precio de un producto está dentro de un rango determinado.
   * @param price El precio del producto.
   * @param range El rango de precios.
   * @returns Verdadero si el precio está dentro del rango, falso en caso contrario.
   */
  checkPriceRange(price: number, range: string): boolean {
    switch(range) {
      case '$0 - $9.990':
        return price >= 0 && price <= 9990;
      case '$10.000 - $19.990':
        return price >= 10000 && price <= 19990;
      case '$50.000 - $99.990':
        return price >= 50000 && price <= 99990;
      case 'Sobre $100.000':
        return price >= 100000;
      default:
        return false;
    }
  }

  /**
   * Agrega un producto al carrito de compras del usuario.
   * @param product El producto a agregar.
   */
  addToCart(product: Product) {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      const loggedInUser: User = JSON.parse(userData);
      loggedInUser.cart = loggedInUser.cart || [];
      loggedInUser.cart.push(product);
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

      let users: User[] = JSON.parse(localStorage.getItem('users') ?? '[]');
      users = users.map((user: User) => user.email === loggedInUser.email ? loggedInUser : user);
      localStorage.setItem('users', JSON.stringify(users));

      this.userService.setUserStatus(loggedInUser); 
      this.showAlert('Producto añadido al carrito');
    } else {
      alert('Por favor, inicia sesión para agregar productos al carrito.');
      this.router.navigate(['/Login']);
    }
  }

  /**
   * Muestra un mensaje de alerta.
   * @param message El mensaje de la alerta.
   */
  showAlert(message: string) {
    this.alertMessage = message;
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000);
  }
}
