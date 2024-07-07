import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedInUser: User | null = null;
  cartCount: number = 0;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.checkUserStatus();
    this.userService.userStatus$.subscribe(user => {
      this.loggedInUser = user;
      this.cartCount = user ? user.cart.length : 0;
      this.cdr.detectChanges();
    });
  }

  checkUserStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('loggedInUser');
      if (userData) {
        const user = JSON.parse(userData) as User;
        this.authService.getUserProfile(user.uid).subscribe(userProfile => {
          if (userProfile) {
            this.loggedInUser = userProfile;
            this.userService.setUserStatus(this.loggedInUser);
          } else {
            console.warn('User profile not found in Firestore');
          }
        }, error => {
          console.error('Error fetching user profile from Firestore:', error);
        });
      } else {
        console.warn('No user data found in localStorage');
      }
    } else {
      console.warn('localStorage is not available');
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loggedInUser');
      this.loggedInUser = null;
      this.userService.setUserStatus(null);
      this.router.navigate(['/']);
    }
  }
}
