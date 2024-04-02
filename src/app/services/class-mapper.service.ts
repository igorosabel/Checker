import { Injectable } from '@angular/core';
import {
  CheckinInterface,
  CheckinTypeInterface,
} from '@interfaces/checkins.interfaces';
import { UserInterface } from '@interfaces/user.interfaces';
import { Checkin } from '@model/checkin.model';
import { CheckinType } from '@model/checkintype.model';
import { User } from '@model/user.model';

@Injectable({
  providedIn: 'root',
})
export class ClassMapperService {
  constructor() {}

  getUser(u: UserInterface): User {
    return new User().fromInterface(u);
  }

  getCheckinType(ct: CheckinTypeInterface): CheckinType {
    return new CheckinType().fromInterface(ct);
  }

  getCheckinTypes(cts: CheckinTypeInterface[]): CheckinType[] {
    return cts.map((ct: CheckinTypeInterface): CheckinType => {
      return this.getCheckinType(ct);
    });
  }

  getCheckin(c: CheckinInterface): Checkin {
    return new Checkin().fromInterface(c);
  }

  getCheckins(cs: CheckinInterface[]): Checkin[] {
    return cs.map((c: CheckinInterface): Checkin => {
      return this.getCheckin(c);
    });
  }
}
