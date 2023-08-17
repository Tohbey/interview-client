import {formControl} from '../../form-control/form-builder';

/*class Flag {
  public static APPROVED = "APPROVED";
  public static NONE = "NONE";
  public static NO = "NO";
  public static YES = "YES";
  public static DISABLED = "DISABLED";
  public static ENABLED = "ENABLED";
  public static INACTIVE = "INACTIVE";
  public static ACTIVE = "ACTIVE";
  public static LOCKED = "LOCKED";
  public static EXPIRED = "EXPIRED";
  public static DELETED = "DELETED";
  public static OPEN = "OPEN";
  public static CLOSED = "CLOSED";
  public static PROCESSING = "PROCESSING";

}*/

/*export function FlagAware(constructor: Function) {
  constructor.prototype.Flag = new Flag();
}*/

export class Flag {
  static readonly clsName = 'Flag';
  @formControl()
  id: number;

  name: string;
}

export enum FlagID {
  DISABLED = 3,
  ENABLED = 4
}

export function FlagIDAware(constructor: Function) {
  constructor.prototype.FlagID = FlagID;
}


/*export class FlagableDTO {
  private _flag: number;

  private _flagName: string;

  constructor() {
  }

  @formControl()
  get flag(): number {
    return (this._flag && this._flag['id']) || this._flag;
  }

  set flag(value: number) {
    this._flag = value;
  }


  get flagName(): string {
    return this._flagName;
  }

  set flagName(value: string) {
    this._flagName = value;
  }
}*/
