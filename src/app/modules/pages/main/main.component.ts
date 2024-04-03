import { Component, Signal, viewChild } from '@angular/core';
import {
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import FooterComponent from '@shared/components/footer/footer.component';
import HeaderComponent from '@shared/components/header/header.component';
import MenuComponent from '@shared/components/menu/menu.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenavContent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent {
  menu: Signal<MenuComponent> = viewChild.required<MenuComponent>('menu');

  showMenu(): void {
    this.menu().sidenav().toggle();
  }
}
