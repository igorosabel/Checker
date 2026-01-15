import { CheckinTypeInterface } from '@interfaces/checkins.interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class CheckinType {
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
    this.name = urldecode(ct.name);
    this.icon = urldecode(ct.icon);
    this.hasMessage = ct.hasMessage;
    this.hasValue = ct.hasValue;
    this.num = ct.num;
    this.lastUsed = ct.lastUsed;

    return this;
  }

  toInterface(): CheckinTypeInterface {
    return {
      id: this.id,
      name: urlencode(this.name),
      icon: urlencode(this.icon),
      hasMessage: this.hasMessage,
      hasValue: this.hasValue,
      num: this.num,
      lastUsed: this.lastUsed,
    };
  }
}
