import { NgClass } from '@angular/common';
import {
  Component,
  InputSignal,
  OutputEmitterRef,
  Signal,
  input,
  output,
  viewChild,
} from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import CheckinComponent from '@shared/components/checkin/checkin.component';

@Component({
  selector: 'app-footer',
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
  saved: OutputEmitterRef<void> = output<void>();

  addCheckin(): void {
    this.c().load();
  }

  checkinSaved(): void {
    this.saved.emit();
  }
}
