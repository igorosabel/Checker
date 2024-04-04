import { Component, Signal, viewChild } from '@angular/core';
import {
  MatSidenav,
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
    MatSidenav,
    MatSidenavContent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export default class MapComponent {
  opened: boolean = false;
  sidenav: Signal<MatSidenav> = viewChild.required('sidenav');

  showMenu(): void {
    this.sidenav().toggle();
  }

  checkinSaved(): void {}
}
