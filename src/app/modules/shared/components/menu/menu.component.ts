import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatActionList,
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '@services/user.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    HeaderComponent,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatActionList,
    RouterLink,
    MatIcon,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export default class MenuComponent {
  us: UserService = inject(UserService);
  router: Router = inject(Router);

  logout(): void {
    this.us.logout();
    this.router.navigate(['/']);
  }
}
