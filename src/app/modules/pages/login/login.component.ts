import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import {
  LoginData,
  LoginResult,
  LoginValidation,
} from '@interfaces/user.interfaces';
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

  loginData: LoginData = {
    name: null,
    pass: null,
  };
  validation: LoginValidation = {
    name: false,
    pass: false,
  };
  loading: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.us.loadLogin();
    if (this.us.user) {
      this.router.navigate(['/home']);
    }
  }

  resetValidation(): void {
    this.validation.name = false;
    this.validation.pass = false;
  }

  checkValidations(): boolean {
    return !this.validation.name && !this.validation.pass;
  }

  checkForm(): void {
    this.resetValidation();

    if (!this.loginData.name) {
      this.validation.name = true;
    }
    if (!this.loginData.pass) {
      this.validation.pass = true;
    }

    if (this.checkValidations()) {
      this.loading.set(true);
      this.as.login(this.loginData).subscribe({
        next: (result: LoginResult): void => {
          this.loading.set(false);
          if (result.status === 'ok') {
            this.us.logged = true;
            this.us.user = this.cms.getUser(result.user);
            this.us.checkinTypeList.set(
              this.cms.getCheckinTypes(result.checkinTypeList)
            );
            this.us.saveLogin();
            this.router.navigate(['/home']);
          }
          if (result.status === 'error') {
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
}
