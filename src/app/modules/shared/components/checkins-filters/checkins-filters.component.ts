import {
  Component,
  OnInit,
  OutputEmitterRef,
  WritableSignal,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { CheckinsFiltersInterface } from '@interfaces/checkins.interfaces';
import CheckinType from '@model/checkintype.model';
import UserService from '@services/user.service';
import CustomDateAdapter from '@shared/custom-date-adapter';

@Component({
  selector: 'app-checkins-filters',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatIconButton,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSuffix,
    MatInput,
  ],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
  templateUrl: './checkins-filters.component.html',
  styleUrl: './checkins-filters.component.scss',
})
export default class CheckinsFiltersComponent implements OnInit {
  private readonly us: UserService = inject(UserService);

  showModal: WritableSignal<boolean> = signal<boolean>(false);
  checkinTypeList: CheckinType[] = [];
  checkinFilters: CheckinsFiltersInterface = {
    idType: null,
    start: null,
    end: null,
    page: 1,
  };

  filtersChanged: OutputEmitterRef<CheckinsFiltersInterface> = output<CheckinsFiltersInterface>();

  ngOnInit(): void {
    this.checkinTypeList = this.us.checkinTypeList();
  }

  open(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  cleanFilters(): void {
    this.checkinFilters.idType = null;
    this.checkinFilters.start = null;
    this.checkinFilters.end = null;

    this.filtersChanged.emit(this.checkinFilters);
    this.closeModal();
  }

  checkForm(): void {
    this.filtersChanged.emit(this.checkinFilters);
    this.closeModal();
  }
}
