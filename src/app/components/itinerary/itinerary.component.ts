import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of, Subscription } from 'rxjs';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { EventComponent } from "../event/event.component";


@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [NgIf, NgFor, CdkDrag, CdkDropList, DatePipe, EventComponent],
  templateUrl: './itinerary.component.html',
  styleUrl: './itinerary.component.css'
})
export class ItineraryComponent {

  private itineraryId: string | null = null;
  itineraryTitle: string | null = null;
  private subscription: Subscription = new Subscription();
  events: any[] = [];
  hours: Date[] = [];
  itinerary: any[] = Array.from({ length: 288 }, () => []); // 24 hrs * 12 * 5-minute intervals
  showEvent = false;
  selectedEvent: any | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    for (let i = 0; i < 24; i++) { // 24 hours
      const hour = new Date();
      hour.setHours(i, 0, 0, 0); // Set hour, minutes, seconds, milliseconds
      this.hours.push(hour);
    }
  }


  ngOnInit() {
    this.itineraryId = this.route.snapshot.paramMap.get('id');
    this.itineraryTitle = this.route.snapshot.paramMap.get('title');
    this.fetchItinEvents(this.itineraryId);
  }

  fetchItinEvents(id: string | null) {
    this.subscription.add(
      this.http.get('http://localhost:8080/api/itineraryevent/events/' + id).pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching itineraries:', error);
          return of([]);
        })
      ).subscribe((events) => {
        this.events = events || [];
        console.log('Events for itinerary:', events);

        if (this.events.length > 0) {
          for (const ev of this.events) {
            const startTime = new Date(ev.startTime);
            const endTime = new Date(ev.endTime);
            while (startTime < endTime) {
              this.itinerary[startTime.getHours() * 12 + Math.floor(startTime.getMinutes() / 5)].push(ev);
              startTime.setMinutes(startTime.getMinutes() + 5);
            }
          }
          // console.log(this.itinerary);
        }
      })
    );


  }

  getTimeFromIndex(index: number): string {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start at midnight

    const timeInMinutes = index * 5; // Each index represents 5 minutes
    const hours = Math.floor(timeInMinutes / 60);

    const time = new Date(startOfDay);
    time.setHours(hours, 0);

    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',

      hour12: true
    });
  }

  getEventTop(event: any): number {
    const start = new Date(event.startTime);
    const minutes = start.getHours() * 60 + start.getMinutes();
    return (minutes / 1440) * 100;
    //  Calculates percentage of the way through the day
    // 1440: # mins in a day. Multiply by 100 to get %
  }

  getEventHeight(event: any): number {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const duration = (end.getTime() - start.getTime()) / 60000; // minutes
    return (duration / 1440) * 100;
  }

  editEvent(event: any) {
    this.selectedEvent = event;
    this.showEvent = true;
  }


}

