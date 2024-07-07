import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

/**
 * Configuración de la aplicación.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Proporciona configuración de enrutamiento
    provideClientHydration(), // Proporciona configuración de hidratación del cliente
    provideFirebaseApp(() => initializeApp({
      "projectId":"angular-examn",
      "appId":"1:956918261341:web:463c74c4c2b86725b54fb4",
      "storageBucket":"angular-examn.appspot.com",
      "apiKey":"AIzaSyDSWeh4Wlz5qr5nkLTBGaHhvaQxwhNgnu8",
      "authDomain":"angular-examn.firebaseapp.com",
      "messagingSenderId":"956918261341"
    })), // Proporciona configuración de Firebase
    provideAuth(() => getAuth()), // Proporciona configuración de Auth
    provideFirestore(() => getFirestore()) // Proporciona configuración de Firestore
  ]
};
