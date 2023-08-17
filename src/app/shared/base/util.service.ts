import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import { Subject } from 'rxjs';
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {DataResponse, IDataResponse} from "../data/data-response";
import {Message, Severity} from "../data/message";
import {NotificationService} from "./notification.service";
import {KeyValuePair} from "../data/model";
import * as numeral from 'numeral';

export class AuthError {
  error!: boolean;
  errorCode!: string;
}

declare global {
  /**
   * Current Typescript version doesn't include the types `msSaveBlob` & `msSaveOrOpenBlob` on the Navigator class.
   * See {@link https://github.com/microsoft/TypeScript/issues/45612 Navigator interface no longer extends MSFileSaver}
   * and {@link https://stackoverflow.com/a/69491367/8265811 missing types on Navigator}
   */
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
    msSaveOrOpenBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

@Injectable()
export class UtilService {
  public tokenExpiredSubject: Subject<AuthError> = new Subject<AuthError>();

  getTokenExpirationObservable() {
    return this.tokenExpiredSubject.asObservable();
  }

  static toDataResponse(value: any): any | IDataResponse<any> {
    if(!value.data && value.responseData) {
      value['data'] = value.responseData;
      value = Object.assign(new IDataResponse(), value);
    }
    return value;
  }

  static error(message: any, value?: any) {
    if (!environment.production) {
      console.error(message, value);
    }
  }

  static showMessages(messages: Message[], notificationService$?: NotificationService, severity?: string) {
    if (messages && messages.length && notificationService$) {
      messages.forEach((message, index) => {
        if(message && (typeof message == "object") ) {
          if(severity && !message.severity)
            message.severity = severity;
          if(notificationService$){
            notificationService$.showMessage(message);
          } else {
            console.info(message.summary, message.detail, message.severity);
          }
        } else if (typeof message == 'string'){
          console.log(message);
          const msg: Message = <Message>{
            severity: severity || 'INFO',
            summary: 'Message:',
            detail: message
          };
          notificationService$.showMessage(msg);
        } else if(!message && severity == Severity.ERROR) {
          notificationService$.error('An error occurred!');
        }
      });
    }
  }

  //For Api Integration Service
  static showMessage(message: string, notificationService$?: NotificationService, severity?: string) {
    if (message && message.length && notificationService$) {
      const msg: Message = <Message>{
        severity: severity || 'INFO',
        summary: 'Message:',
        detail: message
      };
      notificationService$.showMessage(msg);
    }
  }

  static isEmptyObject(obj: { constructor?: any; }) {
    if (!obj) return true;
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }

  static isValidNumberInput(event: any, acceptDecimal?: boolean){
    const otherValidKeys = [8, 9, 37, 39];
    if(acceptDecimal){
      otherValidKeys.push(46)
    }
    const keyCode = event.keyCode || event.charCode;
    if((keyCode > 47 && keyCode < 58) || otherValidKeys.find(obj => obj == keyCode)) {
      return true;
    } else {
      return false;
    }
  }

  static enforceTwoDecimalInput(event: any) {
    if (event && event.target && event.target.value) {
      let value = parseFloat(event.target.value);
      let valueStr = value.toFixed(2);
      event.target.value = valueStr;
    }
  }

  static confirmNumericValue(event :any) {
    if(!UtilService.isNullOrUndefined(event.target.value)) {
      const numeralObj = numeral(event.target.value);
      if(UtilService.isNumber(numeralObj.value())) {
        event.target.value = numeralObj.value();
      }
    }
  }

  getFormattedDateOptions(dateModel: any) {
    console.log('date', dateModel);
    if (UtilService.isEmptyObject(dateModel)) return null;
    if (typeof dateModel === 'string') {
      return dateModel;
    }
    const date = dateModel.date || dateModel;
    return `${date.year}-${date.month}-${date.day}`;
  }



  public static removeDisabledAttribute(submitButtonId: string){
    const subButton = document.getElementById(submitButtonId);
    setTimeout(() => {
      if(subButton) {
        subButton.removeAttribute('disabled');
      }
    }, 10);
  }

  public static addTargetDisabledAttribute(event: any){
    if(event.target)
      event.target.setAttribute('disabled', 'disabled');
  }

  public static removeTargetDisabledAttribute(event: any){
    setTimeout(() => {
      if(event.target) {
        event.target.removeAttribute('disabled');
      }
    }, 10);
  }

  public static renderReportPdf(b64reportData: string){
    const file = UtilService.base64ToBlob(b64reportData,'application/pdf');
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }


  public static base64ToBlob(b64Data: string, contentType?: string, sliceSize?: number) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }


  public static getFileFormat(extension: any){
    switch (extension){
      case 'pdf':
        return 'application/pdf'
      case 'jpg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'jpeg':
        return 'image/jpeg'
      case 'csv':
        return 'application/vnd.ms-excel'
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      case 'xls':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      case 'txt':
        return 'text/plain'
      case 'doc':
        return 'application/msword'
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      default:
        return ""
    }
  }
  public static getFileType(type: string) {
    if (type.includes('pdf')) {
      return 'pdf';
    } else if (type.includes('doc') || type == 'application/msword') {
      return 'doc'
    } else if (type.includes('png')) {
      return 'png'
    } else if (type.includes('jpg') || type.includes('jpeg')) {
      return 'jpg'
    } else if (type.includes('text/plain')) {
      return 'txt';
    } else if (type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'xls'
    } else if (type == 'application/vnd.ms-excel') {
      return 'csv'
    }else{
      return ""
    }
  }


  public static appendServiceIp(url: string, prefix?: string){
    if(prefix){
      return environment.interviewerApiIp.replace('API_PATH_PREFIX', prefix) + ((url.startsWith('/') ? url.substr(1) : url));
    }
    return environment.interviewerApiIp.replace('API_PATH_PREFIX', 'api') + ((url.startsWith('/') ? url.substr(1) : url));
  }

  public static toggleOverlay(){
    if($('.page-overlay').hasClass('sidebar-overlay-visible')){
      // this.loadingBarService.complete();
      $('.page-overlay').removeClass('sidebar-overlay-visible');
    } else {
      // this.loadingBarService.start();
      $('.page-overlay').addClass('sidebar-overlay-visible');
    }
  }

  public static removeAppOverlay(){
    if($('.page-overlay').hasClass('sidebar-overlay-visible')) {
      $('.page-overlay').removeClass('sidebar-overlay-visible');
    }
  }

  public static initializeTooltip(){
    setTimeout(() => {
      $(document).ready(() =>{
        $('[data-toggle="tooltip"]')['tooltip']();
      });
      $('[data-toggle="tooltip"]').on('click', () => {
        $('[data-toggle="tooltip"]')['tooltip']('hide');
      });
    },200);

  }
  public static sendMessageToWorker(message: any){
    if(navigator.serviceWorker){
      if(navigator.serviceWorker.controller){
        if(message == null)
          message = 'null';

        if(typeof message !== 'string'){
          message = JSON.stringify(message);
        }
        navigator.serviceWorker.controller.postMessage('hm-sw'+message);
      }
    }
  }

  public static togglePasswordVisibility(event: any, elementId: string){
    const element = <HTMLInputElement>document.getElementById(elementId);
    const eventTarget = <HTMLElement>event.target;
    if(eventTarget.classList.contains('fa-eye')) {
      eventTarget.classList.remove('fa-eye');
      eventTarget.classList.add('fa-eye-slash');
      eventTarget.setAttribute('title','Show Password');
    } else {
      eventTarget.classList.add('fa-eye');
      eventTarget.classList.remove('fa-eye-slash');
      eventTarget.setAttribute('title','Hide Password');
    }
    if(element.type == "password") {
      element.setAttribute('type', 'text');
    } else {
      element.setAttribute('type', 'password');
    }
  }
  public static getResponseMessage(response: DataResponse<any>) {
    if(response.messages && response.messages.length) {
      return response.messages[0].summary;
    } else
      return ''
  }

  public static showApiErrorMessage(error: string, notificationService: NotificationService) {
    //TODO: Implement user friendly error responses
    if(error instanceof HttpErrorResponse && error.error) {
      notificationService.error('Error: ' + error.statusText, error.error.message);
    }
  }

  static resetErrors(controls: { [key: string]: AbstractControl }) {
    if (controls) {
      Object.keys(controls).forEach((key) => {
        const control = controls[key];
        control.reset();
        control.setErrors(null);
        if (control instanceof FormGroup) {
          this.resetErrors((<FormGroup>control).controls);
        }
      });
    }
  }

  static isNullOrUndefined (value: any) {
    return (value === null) || (value === undefined);
  }
  static isNumber (value: any) {
    return typeof value === "number";
  }

  static isNullorEmpty(value: any){
    return (value === null) || (value === "");
  }

}
