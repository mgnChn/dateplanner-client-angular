import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit {

  @Input() event: any;

  ngOnInit() {
    console.log('event passed from Itinerary to Event component: ', this.event);
  }




}
