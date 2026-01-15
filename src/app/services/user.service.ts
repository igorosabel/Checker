import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { CheckinTypeInterface } from '@interfaces/checkins.interfaces';
import { LoginResult } from '@interfaces/user.interfaces';
import CheckinType from '@model/checkintype.model';
import User from '@model/user.model';
import ClassMapperService from '@services/class-mapper.service';

@Injectable({
  providedIn: 'root',
})
export default class UserService {
  private readonly cms: ClassMapperService = inject(ClassMapperService);

  logged: boolean = false;
  user: User | null = null;
  checkinTypeList: WritableSignal<CheckinType[]> = signal<CheckinType[]>([]);

  loadLogin(): void {
    const loginStr: string | null = localStorage.getItem('login');
    if (loginStr === null) {
      this.logout();
      return;
    }
    const loginObj: LoginResult = JSON.parse(loginStr);
    if (loginObj === null) {
      this.logout();
      return;
    }
    this.logged = true;
    this.user = this.cms.getUser(loginObj.user);
    this.checkinTypeList.set(this.cms.getCheckinTypes(loginObj.checkinTypeList));
  }

  saveLogin(): void {
    if (this.user === null) {
      return;
    }
    const loginObj: LoginResult = {
      status: 'ok',
      user: this.user.toInterface(),
      checkinTypeList: this.checkinTypeList().map((ct: CheckinType): CheckinTypeInterface => {
        return ct.toInterface();
      }),
    };
    localStorage.setItem('login', JSON.stringify(loginObj));
  }

  logout(): void {
    this.logged = false;
    this.user = null;
    this.checkinTypeList.set([]);
    localStorage.removeItem('login');
  }
}
