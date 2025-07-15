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

  private loginSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Subscribe to login state changes
    this.loginSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
      }
    );
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
};





