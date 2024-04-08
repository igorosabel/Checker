import { environment } from '@env/environment';
import { CheckinInterface } from '@interfaces/checkins.interfaces';
import { Utils } from '@shared/utils.class';
import { CheckinType } from './checkintype.model';

export class Checkin {
  photo: string | null = null;
  ct: CheckinType | null = null;
  letter: string | null = null;

  constructor(
    public id: number | null = null,
    public idType: number | null = null,
    public message: string | null = null,
    public value: number | null = null,
    public locationLat: number | null = null,
    public locationLon: number | null = null,
    public idPhoto: number | null = null,
    public createdAt: string | null = null
  ) {}

  get map(): string {
    return `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${
      this.locationLon
    },${this.locationLat}&zoom=15.1&marker=lonlat:${this.locationLon},${
      this.locationLat
    };color:%23ff0000;size:medium;text:${
      this.letter !== null ? this.letter : 'A'
    }&apiKey=${environment.geoapifyApiKey}`;
  }

  get photoUrl(): string | null {
    if (this.idPhoto === null) {
      return null;
    }
    return `${environment.photosUrl}${this.idPhoto}.webp`;
  }

  fromInterface(c: CheckinInterface): Checkin {
    this.id = c.id;
    this.idType = c.idType;
    this.message = Utils.urldecode(c.message);
    this.value = c.value;
    this.locationLat = c.locationLat;
    this.locationLon = c.locationLon;
    this.idPhoto = c.idPhoto;
    this.createdAt = c.createdAt;

    return this;
  }

  toInterface(): CheckinInterface {
    return {
      id: this.id,
      idType: this.idType,
      message: Utils.urlencode(this.message),
      value: this.value,
      locationLat: this.locationLat,
      locationLon: this.locationLon,
      idPhoto: this.idPhoto,
      createdAt: this.createdAt,
      photo: this.photo,
    };
  }
}
