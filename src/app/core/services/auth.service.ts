import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, updatePassword, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider, verifyBeforeUpdateEmail } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc, DocumentSnapshot, DocumentData, deleteDoc } from '@angular/fire/firestore';
import { User } from '../../core/models/user.model';
import { from, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from './user.service';

/**
 * Servicio de autenticación que maneja el registro, inicio de sesión y gestión de usuarios en Firebase.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private userService: UserService
  ) {}

  /**
   * Actualiza el perfil de usuario en Firestore.
   * @param user El objeto de usuario a actualizar.
   * @returns Una promesa que se resuelve cuando la actualización se completa.
   */
  updateUserProfileInFirestore(user: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return updateDoc(userDoc, { ...user });
  }

  /**
   * Elimina un usuario de Firestore.
   * @param uid El ID del usuario a eliminar.
   * @returns Una promesa que se resuelve cuando el usuario es eliminado.
   */
  deleteUserFromFirestore(uid: string): Promise<void> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return deleteDoc(userDoc);
  }

  /**
   * Registra un nuevo usuario con correo electrónico y contraseña.
   * @param email El correo electrónico del nuevo usuario.
   * @param password La contraseña del nuevo usuario.
   * @returns Un observable que emite el resultado del registro.
   */
  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Inicia sesión con correo electrónico y contraseña.
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns Un observable que emite el resultado del inicio de sesión.
   */
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Guarda el perfil de usuario en Firestore.
   * @param user El objeto de usuario a guardar.
   * @returns Una promesa que se resuelve cuando el perfil se guarda.
   */
  saveUserProfile(user: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userDoc, user);
  }

  /**
   * Obtiene el perfil de usuario desde Firestore.
   * @param uid El ID del usuario.
   * @returns Un observable que emite el perfil del usuario o null si no se encuentra.
   */
  getUserProfile(uid: string): Observable<User | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      switchMap((snapshot: DocumentSnapshot<DocumentData>) => {
        const data = snapshot.data();
        if (data) {
          const userProfile: User = {
            uid: snapshot.id,
            fullName: data['fullName'],
            username: data['username'],
            email: data['email'],
            password: data['password'],
            confirmPassword: data['confirmPassword'],
            birthdate: data['birthdate'],
            address: data['address'],
            role: data['role'],
            purchaseHistory: data['purchaseHistory'] || [],
            cart: data['cart'] || []
          } as User;
          return of(userProfile);
        } else {
          return of(null);
        }
      })
    );
  }

  /**
   * Actualiza el perfil de usuario.
   * @param user El objeto de usuario a actualizar.
   * @returns Un observable que emite cuando la actualización se completa.
   */
  updateUserProfile(user: User): Observable<void> {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return from(updateDoc(userDoc, { ...user }));
  }

  /**
   * Actualiza el correo electrónico del usuario.
   * @param newEmail El nuevo correo electrónico.
   * @returns Un observable que emite cuando el correo se actualiza.
   */
  updateEmail(newEmail: string): Observable<void> {
    const user = this.auth.currentUser;
    if (user) {
      return from(verifyBeforeUpdateEmail(user, newEmail)).pipe(map(() => {}));
    } else {
      return of(undefined);
    }
  }

  /**
   * Actualiza la contraseña del usuario.
   * @param newPassword La nueva contraseña.
   * @returns Un observable que emite cuando la contraseña se actualiza.
   */
  updatePassword(newPassword: string): Observable<void> {
    const user = this.auth.currentUser;
    if (user) {
      return from(updatePassword(user, newPassword)).pipe(map(() => {}));
    } else {
      return of(undefined);
    }
  }

  /**
   * Envía un correo de verificación al usuario.
   * @returns Un observable que emite cuando el correo se envía.
   */
  sendEmailVerification(): Observable<void> {
    const user = this.auth.currentUser;
    if (user) {
      return from(sendEmailVerification(user)).pipe(map(() => {}));
    } else {
      return of(undefined);
    }
  }

  /**
   * Reautentica al usuario.
   * @param password La contraseña del usuario.
   * @returns Un observable que emite cuando la reautenticación se completa.
   */
  reauthenticate(password: string): Observable<void> {
    const user = this.auth.currentUser;
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      return from(reauthenticateWithCredential(user, credential)).pipe(map(() => {}));
    } else {
      return of(undefined);
    }
  }

  /**
   * Establece el estado del usuario en el UserService.
   * @param user El objeto de usuario o null.
   */
  setUserStatus(user: User | null) {
    this.userService.setUserStatus(user);
  }
}
