import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusResult } from '@app/interfaces/interfaces';
import { environment } from '@env/environment';
import {
  CheckinTypeInterface,
  CheckinTypesResult,
} from '@interfaces/checkins.interfaces';
import {
  LoginData,
  LoginResult,
  RegisterData,
} from '@interfaces/user.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<LoginResult> {
    return this.http.post<LoginResult>(environment.apiUrl + '/register', data);
  }

  login(data: LoginData): Observable<LoginResult> {
    return this.http.post<LoginResult>(environment.apiUrl + '/login', data);
  }

  getCheckinTypes(): Observable<CheckinTypesResult> {
    return this.http.post<CheckinTypesResult>(
      environment.apiUrl + '/get-checkin-types',
      {}
    );
  }

  saveCheckinType(ct: CheckinTypeInterface): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + '/save-checkin-type',
      ct
    );
  }

  deleteCheckinType(id: number): Observable<StatusResult> {
    return this.http.post<StatusResult>(
      environment.apiUrl + '/delete-checkin-type',
      { id }
    );
  }

  getCheckins(): Observable<LoginResult> {
    return this.http.post<LoginResult>(
      environment.apiUrl + '/get-checkins',
      {}
    );
  }
}
