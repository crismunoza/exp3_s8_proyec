import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

/**
 * Componente para mostrar el historial de compras del usuario.
 */
@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule], // Asegúrate de importar CommonModule
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  /**
   * Usuario actualmente logueado.
   */
  loggedInUser: User | null = null;

  /**
   * Historial de compras del usuario.
   */
  purchaseHistory: any[] = [];

  /**
   * Constructor del componente.
   * @param platformId Identificador de la plataforma (browser o server).
   * @param authService Servicio de autenticación para manejar los datos del usuario.
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService
  ) {}

  /**
   * Método de inicialización del componente.
   * Carga los datos del usuario y su historial de compras desde Firestore si está en el navegador.
   */
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('loggedInUser');
      if (userData) {
        const user = JSON.parse(userData);
        const uid = user.uid;
        this.authService.getUserProfile(uid).subscribe(userProfile => {
          if (userProfile) {
            this.loggedInUser = userProfile;
            this.purchaseHistory = this.loggedInUser?.purchaseHistory || [];
          }
        });
      }
    }
  }
}
