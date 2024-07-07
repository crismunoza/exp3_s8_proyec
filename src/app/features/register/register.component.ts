import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AbstractControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

/**
 * Componente de registro para crear nuevos usuarios.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  /**
   * Formulario de registro.
   */
  registerForm: FormGroup;

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
   * @param authService Servicio de autenticación para manejar los datos del usuario.
   */
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        Validators.pattern(/(?=.*[A-Z])/), // Al menos una letra mayúscula
        Validators.pattern(/(?=.*\d)/), // Al menos un número
        Validators.pattern(/(?=.*[!@#$%^&*.])/), // Al menos un carácter especial
      ]],
      confirmPassword: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['']
    }, { 
      validators: this.passwordMatchValidator 
    } as AbstractControlOptions);
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit() {}

  /**
   * Validador para comprobar que las contraseñas coincidan.
   * @param control Formulario de registro.
   * @returns ValidationErrors si las contraseñas no coinciden, null de lo contrario.
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmPassword) {
      confirmPassword.setErrors(null);
    }
    return null;
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
   * Maneja el envío del formulario de registro.
   */
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.registerForm.value;

    this.authService.register(email, password).subscribe(
      (userCredential) => {
        const newUser: User = {
          uid: userCredential.user.uid, // Asegúrate de guardar el uid aquí
          fullName: this.registerForm.value.fullName,
          username: this.registerForm.value.username,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password,
          confirmPassword: this.registerForm.value.confirmPassword,
          birthdate: this.registerForm.value.birthdate,
          address: this.registerForm.value.address,
          role: 'client',
          purchaseHistory: [],
          cart: []
        };

        this.authService.saveUserProfile(newUser).then(() => {
          this.showAlert("Registro exitoso. Ahora puedes iniciar sesión.", "success");
          setTimeout(() => {
            this.router.navigate(['/Login']);
          }, 2000);
        }).catch((error) => {
          console.error('Error al guardar en Firestore', error);
          this.showAlert("Error al registrar el usuario. Por favor, intente nuevamente.", "danger");
        });
      },
      (error) => {
        console.error('Error al registrar usuario', error);
        this.showAlert("Error al registrar el usuario. Por favor, intente nuevamente.", "danger");
      }
    );
  }

  /**
   * Acceso rápido a los controles del formulario de registro.
   */
  get f() {
    return this.registerForm.controls;
  }
}
