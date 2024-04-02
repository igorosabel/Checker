import { Utils } from '@app/modules/shared/utils.class';
import { CheckinTypeInterface } from '@interfaces/checkins.interfaces';

export class CheckinType {
  constructor(
    public id: number | null = null,
    public name: string | null = null,
    public icon: string | null = null,
    public hasMessage: boolean = false,
    public hasValue: boolean = false,
    public num: number | null = null,
    public lastUsed: string | null = null
  ) {}

  fromInterface(ct: CheckinTypeInterface): CheckinType {
    this.id = ct.id;
    this.name = Utils.urldecode(ct.name);
    this.icon = Utils.urldecode(ct.icon);
    this.hasMessage = ct.hasMessage;
    this.hasValue = ct.hasValue;
    this.num = ct.num;
    this.lastUsed = ct.lastUsed;

    return this;
  }

  toInterface(): CheckinTypeInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
      icon: Utils.urlencode(this.icon),
      hasMessage: this.hasMessage,
      hasValue: this.hasValue,
      num: this.num,
      lastUsed: this.lastUsed,
    };
  }
}
