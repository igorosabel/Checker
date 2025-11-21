import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, Field, form, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { LoginData, LoginResult } from '@interfaces/user.interfaces';
import { DialogService } from '@osumi/angular-tools';
import { ApiService } from '@services/api.service';
import { ClassMapperService } from '@services/class-mapper.service';
import { UserService } from '@services/user.service';
import HeaderComponent from '@shared/components/header/header.component';

@Component({
  selector: 'app-login',
  imports: [
    HeaderComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    FormsModule,
    RouterLink,
    MatButton,
    Field,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit {
  as: ApiService = inject(ApiService);
  us: UserService = inject(UserService);
  cms: ClassMapperService = inject(ClassMapperService);
  ds: DialogService = inject(DialogService);
  router: Router = inject(Router);

  loginModel: WritableSignal<LoginData> = signal<LoginData>({
    name: '',
    pass: '',
  });
  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.pass);
    disabled(schemaPath.name, (): boolean => this.loading());
    disabled(schemaPath.pass, (): boolean => this.loading());
  });
  isValid: Signal<boolean> = computed(
    (): boolean =>
      this.loginForm.name().errors().length === 0 && this.loginForm.pass().errors().length === 0
  );
  loading: WritableSignal<boolean> = signal<boolean>(false);
  submitted: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.us.loadLogin();
    if (this.us.user) {
      this.router.navigate(['/home']);
    }
  }

  checkForm(): void {
    this.submitted.set(true);
    if (!this.isValid()) {
      return;
    }

    this.loading.set(true);
    this.as.login(this.loginModel()).subscribe({
      next: (result: LoginResult): void => {
        if (result.status === 'ok') {
          this.us.logged = true;
          this.us.user = this.cms.getUser(result.user);
          this.us.checkinTypeList.set(this.cms.getCheckinTypes(result.checkinTypeList));
          this.us.saveLogin();
          this.router.navigate(['/home']);
        }
        if (result.status === 'error') {
          this.loading.set(false);
          this.ds.alert({
            title: 'Error',
            content: 'Nombre de usuario o contraseña incorrectos.',
            ok: 'Continuar',
          });
        }
      },
      error: (): void => {
        this.loading.set(false);
        this.ds.alert({
          title: 'Error',
          content: 'Ocurrió un error, vuelvelo a intentarlo más tarde.',
          ok: 'Continuar',
        });
      },
    });
  }
}
