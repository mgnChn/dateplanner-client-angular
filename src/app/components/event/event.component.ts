import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map, catchError, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit {

  private subscription: Subscription = new Subscription();

  @Input() event: any;
  @Output() close = new EventEmitter<void>(); // for child-to-parent communication

  constructor(private http: HttpClient) {
  }


  ngOnInit() {
    console.log('event passed from Itinerary to Event component: ', this.event);
  }

  closeEvent() {
    this.close.emit(); // emit the close event. Itinerary will be listening for this event
  }


  onSubmit() {
    // Create JSON request object
    const eventData = {
      id: this.event.id,
      title: this.event.title,
      startTime: this.event.startTime,
      endTime: this.event.endTime,
      description: this.event.description,
      latitude: this.event.latitude,
      longitude: this.event.longitude
    };

    console.log('JSON request:', JSON.stringify(eventData));

    // Send HTTP request here
    this.saveEvent(eventData);
    this.close.emit();
  }

  saveEvent(eventData: any) {
    this.subscription.add(
      this.http.put('http://localhost:8080/api/event/' + eventData.id, eventData, {
        observe: 'response'  // This gives you the full HttpResponse
      }).pipe(
        catchError((error) => {
          console.error('Error saving event:', error);
          return of(null);
        })
      ).subscribe((response) => {
        if (response && response.status === 200) {
          //this.showSuccessPopup('Event saved successfully!');
          console.log('Successful update response:', response);
        }
      })
    );
  }

}
