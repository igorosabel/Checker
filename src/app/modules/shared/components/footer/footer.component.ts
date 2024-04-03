import { NgClass } from '@angular/common';
import {
  Component,
  InputSignal,
  Signal,
  input,
  viewChild,
} from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Checkin } from '@app/model/checkin.model';
import CheckinComponent from '@shared/components/checkin/checkin.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconButton,
    MatFabButton,
    MatIcon,
    RouterLink,
    NgClass,
    CheckinComponent,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export default class FooterComponent {
  selected: InputSignal<string> = input.required<string>();
  c: Signal<CheckinComponent> = viewChild.required<CheckinComponent>('c');

  addCheckin(): void {
    this.c().load(new Checkin());
  }
}
