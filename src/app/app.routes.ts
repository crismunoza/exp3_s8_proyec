import { Routes } from '@angular/router';
import { ArticleComponent } from './features/article/article.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ResetpassComponent } from './features/resetpass/resetpass.component';
import { CarComponent } from './features/car/car.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AdminComponent } from './features/admin/admin.component';
import { PayComponent } from './features/pay/pay.component';
import { RecordComponent } from './features/record/record.component';

/**
 * Rutas de la aplicación.
 */
export const routes: Routes = [
  { path: '', redirectTo: '/Home', pathMatch: 'full' }, // Redirecciona a Home
  { path: 'Home', component: HomeComponent }, // Ruta para el componente HomeComponent
  { path: 'Article', component: ArticleComponent }, // Ruta para el componente ArticleComponent
  { path: 'Login', component: LoginComponent }, // Ruta para el componente LoginComponent
  { path: 'Register', component: RegisterComponent }, // Ruta para el componente RegisterComponent
  { path: 'ResetPass', component: ResetpassComponent }, // Ruta para el componente ResetpassComponent
  { path: 'Car', component: CarComponent }, // Ruta para el componente CarComponent
  { path: 'Profile', component: ProfileComponent }, // Ruta para el componente ProfileComponent
  { path: 'Admin', component: AdminComponent }, // Ruta para el componente AdminComponent
  { path: 'Pay', component: PayComponent }, // Ruta para el componente PayComponent
  { path: 'Record', component: RecordComponent }, // Ruta para el componente RecordComponent
  { path: '**', redirectTo: '/Home', pathMatch: 'full' } // Ruta para manejar todas las rutas no definidas, redirige a Home
];
