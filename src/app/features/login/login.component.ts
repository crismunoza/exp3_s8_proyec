import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

/**
 * Componente para el inicio de sesión de los usuarios.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  alertMessage: string = '';
  alertType: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      adminMode: [false]
    });
  }

  ngOnInit() {}

  /**
   * Muestra un mensaje de alerta.
   * @param message Mensaje de la alerta.
   * @param type Tipo de alerta (success, danger, etc.).
   */
  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000);
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   */
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const adminMode = this.loginForm.value.adminMode;

    // Manejo especial para el administrador
    if (adminMode && email === 'admin@gmail.com' && password === 'admin1234') {
      this.authService.login(email, password).subscribe({
        next: (result) => {
          const adminUser: User = { 
            email, 
            role: 'admin', 
            username: 'Admin', 
            uid: result.user.uid, 
            fullName: 'Admin', 
            purchaseHistory: [], 
            cart: [], 
            password: '',
            confirmPassword: '',
            birthdate: '',
            address: ''
          };
          localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
          this.userService.setUserStatus(adminUser); // Actualizar el estado del usuario
          this.showAlert('Inicio de sesión como administrador exitoso.', 'success');
          setTimeout(() => {
            this.router.navigate(['/Article']);
          }, 1500);
          setTimeout(() => {
            window.location.reload();
          }, 1900);
        },
        error: (error) => {
          this.showAlert('Correo electrónico o contraseña incorrectos.', 'danger');
        }
      });
      return;
    }

    // Manejo para otros usuarios
    this.authService.login(email, password).subscribe({
      next: (result) => {
        this.authService.getUserProfile(result.user.uid).subscribe({
          next: (userProfile) => {
            if (userProfile) {
              localStorage.setItem('loggedInUser', JSON.stringify(userProfile));
              this.userService.setUserStatus(userProfile); // Actualizar el estado del usuario
              this.showAlert('Inicio de sesión exitoso.', 'success');
              setTimeout(() => {
                this.router.navigate(['/Article']);
              }, 1500);
            } else {
              this.showAlert('No se pudo obtener el perfil del usuario.', 'danger');
            }
          },
          error: (error) => {
            this.showAlert('Error al obtener el perfil del usuario.', 'danger');
          }
        });
      },
      error: (error) => {
        this.showAlert('Correo electrónico o contraseña incorrectos.', 'danger');
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }
}
