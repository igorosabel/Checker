import { Component, Signal, viewChild } from '@angular/core';
import {
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import FooterComponent from '@shared/components/footer/footer.component';
import HeaderComponent from '@shared/components/header/header.component';
import MenuComponent from '@shared/components/menu/menu.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenavContent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export default class MapComponent {
  menu: Signal<MenuComponent> = viewChild.required<MenuComponent>('menu');

  showMenu(): void {
    this.menu().sidenav().toggle();
  }
}
