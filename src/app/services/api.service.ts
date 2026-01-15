import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import {
  CheckinInterface,
  CheckinTypeInterface,
  CheckinTypesResult,
  CheckinsFiltersInterface,
  CheckinsResult,
} from '@interfaces/checkins.interfaces';
import { StatusResult } from '@interfaces/interfaces';
import { LoginData, LoginResult, RegisterData } from '@interfaces/user.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export default class ApiService {
  private readonly http: HttpClient = inject(HttpClient);

  register(data: RegisterData): Observable<LoginResult> {
    return this.http.post<LoginResult>(environment.apiUrl + '/register', data);
  }

  login(data: LoginData): Observable<LoginResult> {
    return this.http.post<LoginResult>(environment.apiUrl + '/login', data);
  }

  getCheckinTypes(): Observable<CheckinTypesResult> {
    return this.http.post<CheckinTypesResult>(environment.apiUrl + '/get-checkin-types', {});
  }

  saveCheckinType(ct: CheckinTypeInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + '/save-checkin-type', ct);
  }

  deleteCheckinType(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + '/delete-checkin-type', { id });
  }

  getCheckins(filters: CheckinsFiltersInterface): Observable<CheckinsResult> {
    return this.http.post<CheckinsResult>(environment.apiUrl + '/get-checkins', filters);
  }

  saveCheckin(c: CheckinInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + '/save-checkin', c);
  }

  deleteCheckin(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + '/delete-checkin', { id });
  }

  updateProfile(data: RegisterData): Observable<StatusResult> {
    return this.http.post<StatusResult>(environment.apiUrl + '/update-profile', data);
  }
}
