import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { Firestore, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../core/services/auth.service';
import { map } from 'rxjs/operators';

/**
 * Componente para la administración de usuarios.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  selectedUserIndex: number | null = null;
  editUserForm: FormGroup;
  alertMessage: string = '';
  alertType: string = '';

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.editUserForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      address: ['']
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchUsersFromFirestore();
    } else {
      console.warn('localStorage is not available');
    }
  }

  /**
   * Obtiene la lista de usuarios desde Firestore.
   */
  fetchUsersFromFirestore() {
    const usersCollection = collection(this.firestore, 'users');
    collectionData(usersCollection, { idField: 'uid' }).pipe(
      map(docs => docs.map(doc => this.mapToUser(doc)))
    ).subscribe((data: User[]) => {
      this.users = data;
      this.renderUserTable();
    });
  }

  /**
   * Mapea un documento de Firestore a un objeto User.
   * @param doc Documento de Firestore.
   * @returns Un objeto User.
   */
  mapToUser(doc: any): User {
    return {
      uid: doc.uid,
      fullName: doc.fullName,
      username: doc.username,
      email: doc.email,
      password: doc.password,
      confirmPassword: doc.confirmPassword,
      birthdate: doc.birthdate,
      address: doc.address,
      role: doc.role,
      purchaseHistory: doc.purchaseHistory || [],
      cart: doc.cart || []
    } as User;
  }

  renderUserTable() {
    // Implementa el código para renderizar la tabla de usuarios si es necesario
  }

  /**
   * Selecciona un usuario para editar.
   * @param index Índice del usuario en la lista.
   */
  editUser(index: number) {
    this.selectedUserIndex = index;
    const user = this.users[index];
    this.editUserForm.patchValue({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      birthdate: user.birthdate,
      address: user.address
    });
  }

  /**
   * Elimina un usuario.
   * @param index Índice del usuario en la lista.
   */
  deleteUser(index: number) {
    const user = this.users[index];
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    deleteDoc(userDoc).then(() => {
      this.users.splice(index, 1);
      this.showAlert('Usuario eliminado correctamente.', 'danger');
      this.renderUserTable();
    }).catch((error: any) => {
      console.error('Error eliminando el usuario:', error);
      this.showAlert('Error eliminando el usuario.', 'danger');
    });
  }

  /**
   * Maneja el envío del formulario de edición de usuario.
   */
  onSubmit() {
    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }

    const updatedUser = {
      ...this.users[this.selectedUserIndex!],
      ...this.editUserForm.value
    };

    const userDoc = doc(this.firestore, `users/${updatedUser.uid}`);
    updateDoc(userDoc, { ...updatedUser }).then(() => {
      this.users[this.selectedUserIndex!] = updatedUser;
      this.showAlert('Usuario actualizado correctamente.', 'success');
      this.renderUserTable();
      document.getElementById('editUserModal')?.click(); // Cerrar el modal
    }).catch((error: any) => {
      console.error('Error actualizando el usuario:', error);
      this.showAlert('Error actualizando el usuario.', 'danger');
    });
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

  get f() {
    return this.editUserForm.controls;
  }
}
