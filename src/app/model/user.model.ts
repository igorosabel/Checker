import { UserInterface } from '@interfaces/user.interfaces';
import { Utils } from '@shared/utils.class';

export class User {
  constructor(
    public id: number | null = null,
    public name: string | null = null,
    public email: string | null = null,
    public token: string | null = null
  ) {}

  fromInterface(u: UserInterface): User {
    this.id = u.id;
    this.name = Utils.urldecode(u.name);
    this.email = Utils.urldecode(u.email);
    this.token = u.token;

    return this;
  }

  toInterface(): UserInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
      email: Utils.urlencode(this.email),
      token: this.token,
    };
  }
}
