import { NgClass } from '@angular/common';
import {
  Component,
  OutputEmitterRef,
  WritableSignal,
  inject,
  output,
  signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { CheckinType } from '@app/model/checkintype.model';
import { UserService } from '@app/services/user.service';
import { Checkin } from '@model/checkin.model';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [
    NgClass,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIconButton,
    MatIcon,
    MatSelect,
    MatOption,
  ],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss',
})
export default class CheckinComponent {
  us: UserService = inject(UserService);

  checkinTypeList: CheckinType[] = this.us.checkinTypeList;

  showModal: WritableSignal<boolean> = signal<boolean>(false);
  modalTitle: string = '';
  selectedCheckin: Checkin = new Checkin();
  //nameBox: Signal<ElementRef> = viewChild.required<ElementRef>('nameBox');

  saved: OutputEmitterRef<void> = output();

  load(c: Checkin): void {
    this.selectedCheckin = c;
    if (c.id === null) {
      this.modalTitle = 'Nuevo Checkin';
    } else {
      this.modalTitle = 'Checkin';
    }
    this.showModal.set(true);
    //window.setTimeout((): void => {
    //this.nameBox().nativeElement.focus();
    //}, 100);
  }

  closeModal(): void {
    this.showModal.set(false);
  }
}
