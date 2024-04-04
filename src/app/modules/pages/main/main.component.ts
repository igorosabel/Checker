import { Component, OnInit, Signal, inject, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatActionList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
} from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { CheckinType } from '@app/model/checkintype.model';
import { ClassMapperService } from '@app/services/class-mapper.service';
import { UserService } from '@app/services/user.service';
import { CheckinsResult } from '@interfaces/checkins.interfaces';
import { Checkin } from '@model/checkin.model';
import { ApiService } from '@services/api.service';
import FooterComponent from '@shared/components/footer/footer.component';
import HeaderComponent from '@shared/components/header/header.component';
import MenuComponent from '@shared/components/menu/menu.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatCard,
    MatCardContent,
    MatActionList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    MatListItemMeta,
    MatIconButton,
    MatIcon,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent implements OnInit {
  as: ApiService = inject(ApiService);
  cms: ClassMapperService = inject(ClassMapperService);
  us: UserService = inject(UserService);

  opened: boolean = false;
  sidenav: Signal<MatSidenav> = viewChild.required('sidenav');

  checkinTypes: CheckinType[] = [];
  checkins: Checkin[] = [];

  ngOnInit(): void {
    this.loadCheckins();
  }

  loadCheckins(): void {
    this.checkinTypes = this.us.checkinTypeList;

    this.as.getCheckins().subscribe((result: CheckinsResult): void => {
      this.checkins = this.cms.getCheckins(result.list);
      for (const c of this.checkins) {
        const ind: number = this.checkinTypes.findIndex(
          (ct: CheckinType): boolean => {
            return ct.id === c.idType;
          }
        );
        c.ct = this.checkinTypes[ind];
      }
      console.log(this.checkins);
    });
  }

  showMenu(): void {
    this.sidenav().toggle();
  }

  checkinSaved(): void {
    this.loadCheckins();
  }

  openDetail(c: Checkin): void {
    console.log(c);
  }
}
