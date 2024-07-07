import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { getAuth, sendPasswordResetEmail } from '@angular/fire/auth';

/**
 * Componente para restablecer la contraseña del usuario.
 */
@Component({
  selector: 'app-resetpass',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.css']
})
export class ResetpassComponent implements OnInit {
  /**
   * Formulario de restablecimiento de contraseña.
   */
  resetForm: FormGroup;

  /**
   * Mensaje de alerta.
   */
  alertMessage: string = '';

  /**
   * Tipo de alerta (success, danger, etc.).
   */
  alertType: string = '';

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear el formulario reactivo.
   * @param router Router para la navegación.
   * @param platformId Identificador de la plataforma (browser o server).
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Método de inicialización del componente.
   * Desactiva los campos de contraseña inicialmente.
   */
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.togglePasswordFields(false);
    }
  }

  /**
   * Maneja el envío del formulario.
   */
  onSubmit() {
    this.sendPasswordResetEmail();
  }

  /**
   * Envía un correo electrónico para restablecer la contraseña.
   */
  sendPasswordResetEmail() {
    const email = this.resetForm.get('email')?.value;
    const auth = getAuth();

    sendPasswordResetEmail(auth, email).then(() => {
      this.showAlert('Se ha enviado un correo para restablecer su contraseña.', 'success');
      setTimeout(() => {
        this.router.navigate(['/Login']); // Redirigir a la página de inicio de sesión
      }, 3000);
    }).catch((error) => {
      console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
      this.showAlert('Error al enviar el correo de restablecimiento de contraseña.', 'danger');
    });
  }

  /**
   * Muestra u oculta los campos de contraseña.
   * @param show Indica si se deben mostrar los campos de contraseña.
   */
  togglePasswordFields(show: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      const emailSection = document.getElementById('email-section');
      const submitButton = document.getElementById('submit-button');

      if (show) {
        emailSection?.classList.add('d-none');
        if (submitButton) submitButton.textContent = 'Enviar';
      } else {
        emailSection?.classList.remove('d-none');
        if (submitButton) submitButton.textContent = 'Enviar';
      }
    }
  }

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
   * Acceso rápido a los controles del formulario de restablecimiento de contraseña.
   */
  get f() {
    return this.resetForm.controls;
  }
}
