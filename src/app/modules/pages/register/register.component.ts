import { Component, WritableSignal, inject, signal } from '@angular/core';
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
import { Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { ClassMapperService } from '@app/services/class-mapper.service';
import { DialogService } from '@app/services/dialog.service';
import { UserService } from '@app/services/user.service';
import {
  LoginResult,
  RegisterData,
  RegisterValidation,
} from '@interfaces/user.interfaces';
import HeaderComponent from '@shared/components/header/header.component';
import { Utils } from '@shared/utils.class';

@Component({
  selector: 'app-register',
  standalone: true,
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
    MatButton,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export default class RegisterComponent {
  as: ApiService = inject(ApiService);
  us: UserService = inject(UserService);
  cms: ClassMapperService = inject(ClassMapperService);
  ds: DialogService = inject(DialogService);
  router: Router = inject(Router);

  registerData: RegisterData = {
    name: null,
    email: null,
    pass: null,
    conf: null,
  };
  validation: RegisterValidation = {
    name: false,
    email: false,
    emailFormat: false,
    pass: false,
    conf: false,
    passMatch: false,
  };
  loading: WritableSignal<boolean> = signal<boolean>(false);

  resetValidation(): void {
    this.validation.name = false;
    this.validation.email = false;
    this.validation.emailFormat = false;
    this.validation.pass = false;
    this.validation.conf = false;
    this.validation.passMatch = false;
  }

  checkValidations(): boolean {
    return (
      !this.validation.name &&
      !this.validation.email &&
      !this.validation.emailFormat &&
      !this.validation.pass &&
      !this.validation.conf &&
      !this.validation.passMatch
    );
  }

  checkForm(): void {
    this.resetValidation();

    if (!this.registerData.name) {
      this.validation.name = true;
    }
    if (!this.registerData.email) {
      this.validation.email = true;
    }
    if (
      this.registerData.email !== null &&
      !Utils.validateEmail(this.registerData.email)
    ) {
      this.validation.emailFormat = true;
    }
    if (!this.registerData.pass) {
      this.validation.pass = true;
    }
    if (!this.registerData.conf) {
      this.validation.conf = true;
    }
    if (
      this.registerData.pass !== null &&
      this.registerData.conf !== null &&
      this.registerData.pass !== this.registerData.conf
    ) {
      this.validation.passMatch = true;
    }

    if (this.checkValidations()) {
      this.loading.set(true);
      this.as
        .register(this.registerData)
        .subscribe((result: LoginResult): void => {
          this.loading.set(false);
          if (result.status === 'ok') {
            this.us.logged = true;
            this.us.user = this.cms.getUser(result.user);
            this.us.checkinTypeList = [];
            this.us.saveLogin();
            this.router.navigate(['/home']);
          }
          if (result.status === 'error-email') {
            this.ds.alert({
              title: 'Error',
              content:
                'El email introducido ya está en uso. ¿Has olvidado tu usuario o contraseña?',
              ok: 'Continuar',
            });
          }
          if (result.status === 'error-name') {
            this.ds.alert({
              title: 'Error',
              content:
                'El usuario introducido ya está en uso. ¿Has olvidado tu usuario o contraseña?',
              ok: 'Continuar',
            });
          }
          if (result.status === 'error') {
            this.ds.alert({
              title: 'Error',
              content: 'Ocurrió un error al registrarte.',
              ok: 'Continuar',
            });
          }
        });
    }
  }
}
