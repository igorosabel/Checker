import { Provider } from '@angular/core';
import ApiService from '@services/api.service';
import AuthService from '@services/auth.service';
import ClassMapperService from '@services/class-mapper.service';
import UserService from '@services/user.service';
import CustomDateAdapter from '@shared/custom-date-adapter';

export default function provideCore(): Provider[] {
  return [ApiService, AuthService, ClassMapperService, CustomDateAdapter, UserService];
}
