import {Message, Severity} from './message';

abstract class ResponseCode {
  static readonly SUCCESSFUL: string = '00';
  static readonly FAILED: string = '99';
}

export interface DataResponse<M> {

  valid: boolean;

  data: Array<M>;

  messages: Array<Message>;

  responseCode?: string;

  responseData?: Array<M>;

  totalRecords: number;
}


export class IDataResponse<M> implements DataResponse<M> {
  totalRecords!: number;

  private _valid!: boolean;

  private _data!: Array<M>;

  private _messages!: Array<Message>;

  private _responseCode!: string;

  private _responseData!: Array<M>;

  private _responseMsg!: string;
  get valid(): boolean {
    return this._valid;
  }

  set valid(value: boolean) {
    if (value && !this._responseCode) {
      this._responseCode = value ? ResponseCode.SUCCESSFUL : ResponseCode.FAILED;
    }
    this._valid = value;
  }

  get data(): Array<M> {
    return this._data;
  }

  set data(value: Array<M>) {
    if (value && !this._responseData) {
      this._responseData = value;
    }
    this._data = value;
  }

  get messages(): Array<Message> {
    return this._messages;
  }

  set messages(value: Array<Message>) {
    if (value && value.length && !this._responseMsg) {
      if(value[0]){
        this._responseMsg = value[0].summary || value[0].detail;
      }
    }
    this._messages = value;
  }

  get responseCode(): string {
    return this._responseCode;
  }

  set responseCode(value: string) {
    if (value && !this._valid) {
      this._valid = value === ResponseCode.SUCCESSFUL;
    }
    this._responseCode = value;
  }

  get responseData(): Array<M> {
    return this._responseData;
  }

  set responseData(value: Array<M>) {
    if (value && !this._data) {
      this._data = value;
    }
    this._responseData = value;
  }

  get responseMsg(): string {
    return this._responseMsg;
  }

  set responseMsg(value: string) {
    if (value && !this._messages) {
      this._messages = [{summary: '', detail: value, severity: Severity.ERROR}];
    }
    this._responseMsg = value;
  }

}

