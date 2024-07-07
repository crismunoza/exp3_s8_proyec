import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';

/**
 * Componente principal de la aplicación.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /**
   * Título de la aplicación.
   */
  title = 'proyecto';

  /**
   * Indica si el footer debe mostrarse.
   */
  showFooter: boolean = true;

  /**
   * Constructor del componente.
   * @param router Router para la navegación.
   */
  constructor(private router: Router) {}

  /**
   * Método de inicialización del componente.
   * Muestra u oculta el footer basado en la ruta actual.
   */
  ngOnInit() {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showFooter = event.url !== '/Login' && event.url !== '/Register' && event.url !== '/ResetPass' && event.url !== '/Car' && event.url !== '/Profile' && event.url !== '/Admin' && event.url !== '/Pay' && event.url !== '/Record';
      });
  }
}
