import { Component, NgModule, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserDTO } from '../../../models/userdata';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { };

  private userDataSubscription: Subscription = new Subscription();
  userData: UserDTO | null = null;

  ngOnInit() {
    this.userDataSubscription = this.authService.userData$.subscribe(
      (data) => {
        this.userData = data;
        console.log('User data updated in profile component:', this.userData);
      }
    );
  }

  ngOnDestroy() {
    this.userDataSubscription.unsubscribe();
  }

}
