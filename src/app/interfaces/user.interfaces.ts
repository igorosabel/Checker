import { CheckinTypeInterface } from '@interfaces/checkins.interfaces';

export interface LoginData {
  name: string | null;
  pass: string | null;
}

export interface UserInterface {
  id: number | null;
  name: string | null;
  email: string | null;
  token: string | null;
}

export interface LoginResult {
  status: string;
  user: UserInterface;
  checkinTypeList: CheckinTypeInterface[];
}

export interface RegisterData {
  name: string | null;
  email: string | null;
  pass: string | null;
  conf: string | null;
}

export interface RegisterValidation {
  name: boolean;
  email: boolean;
  emailFormat: boolean;
  pass: boolean;
  conf: boolean;
  passMatch: boolean;
}
