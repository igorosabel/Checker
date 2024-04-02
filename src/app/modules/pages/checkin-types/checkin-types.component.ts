import { Component, OnInit, inject } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import { CheckinTypesResult } from '@interfaces/checkins.interfaces';
import { CheckinType } from '@model/checkintype.model';
import { ApiService } from '@services/api.service';
import { ClassMapperService } from '@services/class-mapper.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'app-checkin-types',
  standalone: true,
  imports: [
    HeaderComponent,
    MatCard,
    MatCardContent,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    MatFabButton,
    MatIcon,
  ],
  templateUrl: './checkin-types.component.html',
  styleUrl: './checkin-types.component.scss',
})
export default class CheckinTypesComponent implements OnInit {
  as: ApiService = inject(ApiService);
  cms: ClassMapperService = inject(ClassMapperService);

  checkinTypes: CheckinType[] = [];

  ngOnInit(): void {
    this.as.getCheckinTypes().subscribe((result: CheckinTypesResult): void => {
      this.checkinTypes = this.cms.getCheckinTypes(result.list);
    });
  }
}
