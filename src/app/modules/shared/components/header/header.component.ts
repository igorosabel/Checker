import {
  Component,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatIconButton, MatIcon, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export default class HeaderComponent {
  back: InputSignal<string> = input<string>('');
  menu: InputSignal<boolean> = input<boolean>(false);
  menuClicked: OutputEmitterRef<boolean> = output<boolean>();
  title: InputSignal<string> = input.required<string>();

  menuClick(): void {
    this.menuClicked.emit(true);
  }
}
