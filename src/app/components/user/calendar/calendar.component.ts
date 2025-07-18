import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDTO } from '../../../models/userdata';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private http: HttpClient) { };

  private userDataSubscription: Subscription = new Subscription();
  private userData: UserDTO | null = null;
  public itineraries: any[] = []; // Store the itineraries for the template

  ngOnInit() {
    this.userDataSubscription.add(
      this.authService.userData$.subscribe(
        (userData) => {
          this.userData = userData;

          // Make HTTP request AFTER userData is available
          if (userData?.id) {
            this.fetchUserItineraries(userData.id);
          }
        }
      )
    );
  }

  private fetchUserItineraries(userId: number) {
    this.userDataSubscription.add(
      this.http.get('http://localhost:8080/api/useritinerary/itinerariesuid/' + userId).pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching itineraries:', error);
          return of([]);
        })
      ).subscribe(
        (itineraries) => {
          // Store the response in the component variable
          this.itineraries = itineraries || [];
          console.log('Itineraries associated with user:', this.itineraries);
        }
      )
    );
  }

  onItineraryClick(itinerary: any) {
    console.log('Clicked itinerary:', itinerary);
    // Handle the click - you can navigate to detail page or show more info
  }

  ngOnDestroy() {
    this.userDataSubscription.unsubscribe();
  }

}
