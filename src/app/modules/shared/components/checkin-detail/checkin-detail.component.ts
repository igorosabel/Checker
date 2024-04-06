import { Component } from '@angular/core';

@Component({
  selector: 'app-checkin-detail',
  standalone: true,
  imports: [],
  templateUrl: './checkin-detail.component.html',
  styleUrl: './checkin-detail.component.scss',
})
export default class CheckinDetailComponent {
  // https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:-2.938149,43.252342&zoom=15.1&marker=lonlat:-2.9382791346525323,43.25256072882107;color:%23ff0000;size:medium;text:A&apiKey=YOUR_API_KEY
  // https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:-2.938149,43.252342&zoom=15.1&marker=lonlat:-2.9382791346525323,43.25256072882107;color:%23ff0000;size:medium;text:A|lonlat:-2.9356564208548264,43.253493962965564;color:%23ff0000;size:medium;text:B&apiKey=ccb2447acbd8411ca67c538de4930cf5
}
