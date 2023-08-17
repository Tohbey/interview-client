import {Injectable} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {take} from "rxjs/operators";
import {Message} from "../data/message";


@Injectable()
export class NotificationService {

  private toastClasses:any = {
    danger: 'toast-error',
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  };

  constructor(public toastr: ToastrService) {
  }

  info(summary: string, detail?: string, clickFunction?: any, disableTimeOut?: boolean) {
    this.toastr.info(detail, summary, {closeButton: true, disableTimeOut: !!disableTimeOut})
      .onTap
      .pipe(take(1))
      .subscribe(() => {
        clickFunction();
      });
  }

  success(summary: string, detail?: string) {
    this.toastr.success(detail, summary, {closeButton: true});
  }

  warning(summary: string, detail?: string) {
    this.toastr.warning(detail, summary, {closeButton: true});
  }

  error(summary: string, detail?: string) {
    this.toastr.error(detail, summary, {closeButton: true});
  }

  public showMessage(message: Message){
    if(message.severity == 'ACCESS_DENIED' || message.severity == 'FATAL' || message.severity == 'DANGER'){
      message.severity = 'error';
    }
    this.toastr.show(message.detail, message.summary, {closeButton: true, timeOut: 6000}, this.toastClasses[message.severity ? message.severity.toLowerCase() || 'info' : 'info'] );
  }

  public showMessageWithOptions(message: Message, options = {}){
    this.toastr.show(message.detail,message.summary, Object.assign({}, {closeButton: true, timeOut: 6000}, options), this.toastClasses[message.severity ? message.severity.toLowerCase() || 'info' : 'info']);
  }

}
