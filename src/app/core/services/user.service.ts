import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

/**
 * Servicio para manejar el estado del usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userStatusSubject = new BehaviorSubject<User | null>(null);
  userStatus$ = this.userStatusSubject.asObservable();

  /**
   * Establece el estado del usuario.
   * @param user El objeto de usuario o null.
   */
  setUserStatus(user: User | null) {
    this.userStatusSubject.next(user);
  }
}
