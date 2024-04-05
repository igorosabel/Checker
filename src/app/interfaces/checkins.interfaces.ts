export interface CheckinTypeInterface {
  id: number | null;
  name: string | null;
  icon: string | null;
  hasMessage: boolean;
  hasValue: boolean;
  num: number | null;
  lastUsed: string | null;
}

export interface CheckinTypesResult {
  status: string;
  list: CheckinTypeInterface[];
}

export interface CheckinInterface {
  id: number | null;
  idType: number | null;
  message: string | null;
  value: number | null;
  locationLat: number | null;
  locationLon: number | null;
  idPhoto: number | null;
  createdAt: string | null;
  photo?: string | null;
}

export interface CheckinsResult {
  status: string;
  list: CheckinInterface[];
  pages: number;
  total: number;
}

export interface CheckinsFiltersInterface {
  idType: number | null;
  start: string | null;
  end: string | null;
  page: number;
}
