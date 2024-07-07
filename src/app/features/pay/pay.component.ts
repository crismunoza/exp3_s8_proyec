import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';
import { Product } from '../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

/**
 * Componente para el proceso de pago.
 */
@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  loggedInUser: User | null = null;
  alertMessage: string = '';
  alertType: string = '';

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: any, private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('loggedInUser');
      if (userData) {
        this.loggedInUser = JSON.parse(userData);
      } else {
        this.showAlert('Por favor, inicia sesión para proceder con el pago.', 'danger');
        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 1500);
      }
    }
  }

  /**
   * Maneja el envío del formulario de pago.
   * @param form El formulario de pago.
   */
  onSubmit(form: NgForm) {
    if (!this.loggedInUser) {
      this.showAlert('Por favor, inicia sesión para proceder con el pago.', 'danger');
      setTimeout(() => {
        this.router.navigate(['/Login']);
      }, 1500);
      return;
    }

    const { cardNumber, expiryDate, cvv } = form.value;
    if (cardNumber && expiryDate && cvv) {
      const cart = this.loggedInUser.cart || [];
      const purchaseDate = new Date().toISOString();

      this.loggedInUser.purchaseHistory = this.loggedInUser.purchaseHistory || [];
      cart.forEach((item: Product) => {
        this.loggedInUser!.purchaseHistory.push({
          ...item,
          date: purchaseDate
        });
      });

      // Vaciar el carrito
      this.loggedInUser.cart = [];
      localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));

      let users: User[] = (JSON.parse(localStorage.getItem('users') || '[]') as (User | null)[])
        .reduce((acc: User[], user: User | null) => {
          if (user !== null) acc.push(user);
          return acc;
        }, []);

      // Actualizar la información del usuario
      users = users.map(user => {
        if (user.email === this.loggedInUser!.email) {
          return this.loggedInUser!;
        }
        return user;
      });

      localStorage.setItem('users', JSON.stringify(users));

      // Validar UID antes de actualizar el perfil del usuario en Firestore
      if (this.loggedInUser.uid) {
        console.log('Actualizando perfil de usuario con UID:', this.loggedInUser.uid);
        this.authService.updateUserProfile(this.loggedInUser).subscribe(
          () => {
            this.userService.setUserStatus(this.loggedInUser); // Emitir estado del usuario actualizado
            this.showAlert('Pago realizado con éxito. Gracias por tu compra.', 'success');
            setTimeout(() => {
              this.router.navigate(['/Record']);
            }, 1500);
          },
          (err: any) => {
            console.error('Error actualizando el perfil del usuario en Firestore:', err);
            this.showAlert('Error al realizar el pago. Por favor, intente nuevamente.', 'danger');
          }
        );
      } else {
        console.error('Error: UID del usuario no válido', this.loggedInUser);
        this.showAlert('Error al realizar el pago. Por favor, intente nuevamente.', 'danger');
      }
    } else {
      this.showAlert('Por favor, completa todos los campos para proceder con el pago.', 'danger');
    }
  }

  /**
   * Muestra un mensaje de alerta.
   * @param message El mensaje de la alerta.
   * @param type El tipo de alerta (success, danger, etc.).
   */
  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000);
  }
}
