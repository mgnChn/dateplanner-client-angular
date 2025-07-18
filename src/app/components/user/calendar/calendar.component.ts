import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDTO } from '../../../models/userdata';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  constructor(private authService: AuthService) { };

  private userDataSubscription: Subscription = new Subscription();
  private userData: UserDTO | null = null;

  ngOnInit() {
    this.userDataSubscription.add(
      this.authService.userData$.subscribe(
        (userData) => {
          this.userData = userData;
        }
      )
    );
  }

}
