import { NgClass } from '@angular/common';
import { Component, InputSignal, input } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

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
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export default class FooterComponent {
  selected: InputSignal<string> = input.required<string>();
}
