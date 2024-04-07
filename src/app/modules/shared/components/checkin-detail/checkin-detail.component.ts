import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '@app/services/user.service';
import { Checkin } from '@model/checkin.model';
import { CheckinType } from '@model/checkintype.model';

@Component({
  selector: 'app-checkin-detail',
  standalone: true,
  imports: [
    NgClass,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './checkin-detail.component.html',
  styleUrl: './checkin-detail.component.scss',
})
export default class CheckinDetailComponent implements OnInit {
  us: UserService = inject(UserService);

  // https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:-2.938149,43.252342&zoom=15.1&marker=lonlat:-2.9382791346525323,43.25256072882107;color:%23ff0000;size:medium;text:A&apiKey=YOUR_API_KEY
  // https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:-2.938149,43.252342&zoom=15.1&marker=lonlat:-2.9382791346525323,43.25256072882107;color:%23ff0000;size:medium;text:A|lonlat:-2.9356564208548264,43.253493962965564;color:%23ff0000;size:medium;text:B&apiKey=ccb2447acbd8411ca67c538de4930cf5
  selectedCheckin: Checkin = new Checkin();
  showModal: WritableSignal<boolean> = signal<boolean>(false);

  checkinTypeList: CheckinType[] = [];
  selectedCT: CheckinType | null = null;

  ngOnInit(): void {
    this.checkinTypeList = this.us.checkinTypeList();
  }

  load(c: Checkin): void {
    this.selectedCheckin = c;
    const ind: number = this.checkinTypeList.findIndex(
      (ct: CheckinType): boolean => {
        return ct.id === c.idType;
      }
    );
    if (ind !== -1) {
      this.selectedCT = this.checkinTypeList[ind];
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }
}
