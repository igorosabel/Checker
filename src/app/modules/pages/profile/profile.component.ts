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
import { DialogService } from '@app/services/dialog.service';
import {
  LoginResult,
  RegisterData,
  RegisterValidation,
} from '@interfaces/user.interfaces';
import { ApiService } from '@services/api.service';
import { UserService } from '@services/user.service';
import HeaderComponent from '@shared/components/header/header.component';
import { Utils } from '@shared/utils.class';

@Component({
  selector: 'app-profile',
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
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export default class ProfileComponent implements OnInit {
  us: UserService = inject(UserService);
  as: ApiService = inject(ApiService);
  ds: DialogService = inject(DialogService);

  profileData: RegisterData = {
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

  ngOnInit(): void {
    if (this.us.user !== null) {
      this.profileData.name = this.us.user.name;
      this.profileData.email = this.us.user.email;
    }
  }

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

    if (!this.profileData.name) {
      this.validation.name = true;
    }
    if (!this.profileData.email) {
      this.validation.email = true;
    }
    if (
      this.profileData.email !== null &&
      !Utils.validateEmail(this.profileData.email)
    ) {
      this.validation.emailFormat = true;
    }
    if (!this.profileData.pass) {
      this.validation.pass = true;
    }
    if (!this.profileData.conf) {
      this.validation.conf = true;
    }
    if (
      this.profileData.pass !== null &&
      this.profileData.conf !== null &&
      this.profileData.pass !== this.profileData.conf
    ) {
      this.validation.passMatch = true;
    }

    if (this.checkValidations()) {
      this.loading.set(true);
      this.as
        .register(this.profileData)
        .subscribe((result: LoginResult): void => {
          this.loading.set(false);
          if (result.status === 'ok' && this.us.user !== null) {
            this.us.user.name = this.profileData.name;
            this.us.user.email = this.profileData.email;
            this.us.saveLogin();
          }
          if (result.status === 'error-email') {
            this.ds.alert({
              title: 'Error',
              content: 'El email introducido ya está en uso.',
              ok: 'Continuar',
            });
          }
          if (result.status === 'error-name') {
            this.ds.alert({
              title: 'Error',
              content: 'El usuario introducido ya está en uso.',
              ok: 'Continuar',
            });
          }
          if (result.status === 'error') {
            this.ds.alert({
              title: 'Error',
              content: 'Ocurrió un error al guardar los datos.',
              ok: 'Continuar',
            });
          }
        });
    }
  }
}
