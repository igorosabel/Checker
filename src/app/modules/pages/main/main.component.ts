import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatActionList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
} from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { CheckinsFiltersInterface, CheckinsResult } from '@interfaces/checkins.interfaces';
import Checkin from '@model/checkin.model';
import CheckinType from '@model/checkintype.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import UserService from '@services/user.service';
import CheckinDetailComponent from '@shared/components/checkin-detail/checkin-detail.component';
import CheckinsFiltersComponent from '@shared/components/checkins-filters/checkins-filters.component';
import FooterComponent from '@shared/components/footer/footer.component';
import HeaderComponent from '@shared/components/header/header.component';
import MenuComponent from '@shared/components/menu/menu.component';

@Component({
  selector: 'app-main',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
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
    CheckinsFiltersComponent,
    CheckinDetailComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent implements OnInit {
  private readonly as: ApiService = inject(ApiService);
  private readonly cms: ClassMapperService = inject(ClassMapperService);
  private readonly us: UserService = inject(UserService);

  opened: boolean = false;
  sidenav: Signal<MatSidenav> = viewChild.required('sidenav');

  checkinTypes: CheckinType[] = [];
  checkins: WritableSignal<Checkin[]> = signal<Checkin[]>([]);

  filters: Signal<CheckinsFiltersComponent> =
    viewChild.required<CheckinsFiltersComponent>('filters');
  checkinFilters: CheckinsFiltersInterface = {
    idType: null,
    start: null,
    end: null,
    page: 1,
  };
  total: number = 0;

  detail: Signal<CheckinDetailComponent> = viewChild.required<CheckinDetailComponent>('detail');

  ngOnInit(): void {
    this.checkinTypes = this.us.checkinTypeList();
    this.loadCheckins();
  }

  loadCheckins(): void {
    this.as.getCheckins(this.checkinFilters).subscribe((result: CheckinsResult): void => {
      const checkins: Checkin[] = this.cms.getCheckins(result.list);
      for (const c of checkins) {
        const ind: number = this.checkinTypes.findIndex((ct: CheckinType): boolean => {
          return ct.id === c.idType;
        });
        c.ct = this.checkinTypes[ind];
      }
      this.checkins.set([...this.checkins(), ...checkins]);
      this.total = result.total;
    });
  }

  showFilters(): void {
    this.filters().open();
  }

  showMenu(): void {
    this.sidenav().toggle();
  }

  reloadCheckins(): void {
    this.checkinFilters.page = 1;
    this.checkins.set([]);
    this.loadCheckins();
  }

  openDetail(c: Checkin): void {
    this.detail().load(c);
  }

  nextPage(): void {
    this.checkinFilters.page++;
    this.loadCheckins();
  }

  filtersChanged(newFilters: CheckinsFiltersInterface): void {
    this.checkinFilters.idType = newFilters.idType;
    this.checkinFilters.start = newFilters.start;
    this.checkinFilters.end = newFilters.end;
    this.reloadCheckins();
  }
}
