import { Component, Signal, inject, viewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatActionList,
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '@services/user.service';
import FooterComponent from '@shared/components/footer/footer.component';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    HeaderComponent,
    FooterComponent,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatActionList,
    RouterLink,
    MatIcon,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent {
  opened: boolean = false;
  sidenav: Signal<MatSidenav> = viewChild.required('sidenav');

  us: UserService = inject(UserService);
  router: Router = inject(Router);

  showMenu(): void {
    this.sidenav().toggle();
  }

  logout(): void {
    this.us.logout();
    this.router.navigate(['/']);
  }
}
