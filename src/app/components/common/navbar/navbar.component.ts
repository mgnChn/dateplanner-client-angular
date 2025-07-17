import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgClass, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuCollapsed = true;
  isLoggedIn = false;
  isAdmin = false;

  private loginSubscriptions: Subscription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Subscribe to login state changes
    this.loginSubscriptions.add(
      this.authService.isLoggedIn$.subscribe(
        (loggedIn) => {
          this.isLoggedIn = loggedIn;
        }
      ));

    this.loginSubscriptions.add(
      this.authService.userData$.subscribe(
        (userData) => {
          if (userData?.roles.includes('ROLE_ADMIN')) {
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
          }
        }

      )
    );

  }

  collapseMenu() {
    this.isMenuCollapsed = true;
  }

  ngOnDestroy() {
    this.loginSubscriptions.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
};





