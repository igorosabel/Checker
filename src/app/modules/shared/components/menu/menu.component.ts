import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatActionList,
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import UserService from '@services/user.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'app-menu',
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
export default class MenuComponent implements OnInit {
  private readonly us: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  username: WritableSignal<string | null> = signal<string | null>(null);

  ngOnInit(): void {
    if (this.us.user) {
      this.username.set(this.us.user.name);
    }
  }

  logout(): void {
    this.us.logout();
    this.router.navigate(['/']);
  }
}
