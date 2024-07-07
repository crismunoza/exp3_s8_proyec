import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Firestore } from '@angular/fire/firestore';
import { doc, updateDoc } from '@angular/fire/firestore';

/**
 * Componente para la gestión del perfil del usuario.
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loggedInUser: User | null = null;
  alertMessage: string = '';
  alertType: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService,
    private userService: UserService,
    private firestore: Firestore
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      currentPassword: ['', Validators.required], // Campo para la contraseña actual
      newPassword: ['', [
        Validators.minLength(6),
        Validators.maxLength(18),
        Validators.pattern(/(?=.*[A-Z])/), // Al menos una letra mayúscula
        Validators.pattern(/(?=.*\d)/), // Al menos un número
        Validators.pattern(/(?=.*[!@#$%^&*.])/), // Al menos un carácter especial
      ]],
      address: ['']
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('loggedInUser');
      if (userData) {
        this.loggedInUser = JSON.parse(userData);
        this.profileForm.patchValue({
          fullName: this.loggedInUser?.fullName,
          username: this.loggedInUser?.username,
          email: this.loggedInUser?.email,
          birthdate: this.loggedInUser?.birthdate,
          address: this.loggedInUser?.address
        });

        if (this.loggedInUser?.role === 'admin') {
          const adminButton = document.getElementById('adminButton');
          if (adminButton) {
            adminButton.classList.remove('d-none');
          }
        }
      } else {
        this.showAlert("No has iniciado sesión. Por favor, inicia sesión primero.", "danger");
        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 1500);
      }
    }
  }

  /**
   * Maneja el envío del formulario de perfil.
   */
  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      console.error('El formulario es inválido.', this.profileForm.errors, this.profileForm.controls);
      return;
    }
  
    const newEmail = this.profileForm.get('email')?.value;
    const currentPassword = this.profileForm.get('currentPassword')?.value;
    const newPassword = this.profileForm.get('newPassword')?.value;
    const updatedUser: User = {
      ...this.loggedInUser!,
      fullName: this.profileForm.get('fullName')?.value,
      username: this.profileForm.get('username')?.value,
      email: this.profileForm.get('email')?.value,
      birthdate: this.profileForm.get('birthdate')?.value,
      address: this.profileForm.get('address')?.value,
      ...(newPassword ? { password: newPassword } : {})
    };
  
    const updateTasks: Promise<void>[] = [];
  
    if (newEmail !== this.loggedInUser?.email) {
      this.authService.updateEmail(newEmail).subscribe({
        next: () => {
          this.authService.sendEmailVerification().subscribe({
            next: () => {
              this.showAlert('Se ha enviado un correo de verificación. Por favor, verifica tu nuevo correo antes de continuar.', 'info');
              this.logout(); // Cerrar sesión después de enviar el correo de verificación
              this.updateFirestoreEmail(this.loggedInUser!.uid, newEmail);
            },
            error: (error: any) => {
              console.error('Error enviando correo de verificación:', error);
              this.showAlert('Error al enviar el correo de verificación.', 'danger');
            }
          });
        },
        error: (error: any) => {
          console.error('Error actualizando el correo electrónico:', error);
          this.showAlert('Error al actualizar el correo electrónico.', 'danger');
        }
      });
      return;
    }
  
    if (newPassword) {
      this.authService.reauthenticate(currentPassword).subscribe({
        next: () => {
          updateTasks.push(this.authService.updatePassword(newPassword).toPromise());
          this.finalizeUpdate(updatedUser, updateTasks);
        },
        error: (error: any) => {
          console.error('Error reautenticando al usuario:', error);
          this.showAlert('Error al reautenticar al usuario. Por favor, verifica tu contraseña actual.', 'danger');
        }
      });
    } else {
      this.finalizeUpdate(updatedUser, updateTasks);
    }
  }
  
  /**
   * Finaliza la actualización del perfil.
   * @param updatedUser El usuario actualizado.
   * @param updateTasks Las tareas de actualización pendientes.
   */
  finalizeUpdate(updatedUser: User, updateTasks: Promise<void>[]) {
    console.log('Iniciando tareas de actualización...');
    Promise.all(updateTasks).then(() => {
      console.log('Tareas de actualización completadas. Actualizando perfil en Firestore...');
      this.updateUserProfile(updatedUser);
    }).catch((error: any) => {
      console.error('Error durante la actualización de email/contraseña:', error);
      this.showAlert("Error al actualizar el perfil.", "danger");
    });
  }
  
  /**
   * Actualiza el perfil del usuario en Firestore.
   * @param updatedUser El usuario actualizado.
   */
  updateUserProfile(updatedUser: User) {
    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  
    const userIndex = users.findIndex(user => user.uid === this.loggedInUser?.uid);
  
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
    } else {
      users.push(updatedUser);
    }
  
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
  
    console.log('Actualizando perfil en Firestore...');
    this.authService.updateUserProfile(updatedUser).subscribe(
      () => {
        console.log('Perfil actualizado en Firestore.');
        this.userService.setUserStatus(updatedUser); // Actualizar el estado del usuario
        this.showAlert("Perfil actualizado correctamente.", "success");
      },
      (error: any) => {
        console.error('Error actualizando el perfil del usuario en Firestore:', error);
        this.showAlert("Error al actualizar el perfil en Firestore.", "danger");
      }
    );
  }
  
  /**
   * Actualiza el correo electrónico del usuario en Firestore.
   * @param uid El UID del usuario.
   * @param newEmail El nuevo correo electrónico.
   */
  updateFirestoreEmail(uid: string, newEmail: string) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    updateDoc(userDoc, { email: newEmail })
      .then(() => {
        console.log('Correo electrónico actualizado en Firestore.');
      })
      .catch((error: any) => {
        console.error('Error actualizando el correo electrónico en Firestore:', error);
      });
  }
  
  /**
   * Cierra la sesión del usuario.
   */
  logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/Login']);
  }
  
  /**
   * Navega a la página de administración.
   */
  navigateToAdmin() {
    this.router.navigate(['/Admin']);
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
  
  /**
   * Obtiene los controles del formulario de perfil.
   */
  get f() {
    return this.profileForm.controls;
  }
}
