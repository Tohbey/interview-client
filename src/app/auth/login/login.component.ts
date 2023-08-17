import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormField} from "../../shared/models/field.interface";
import {Observable} from "rxjs";
import {FormfieldControlService} from "../../services/formFieldControlService/formfield-control.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm')
  private loginFormElement!: ElementRef;

  @ViewChild('passwordForm', {static: true, read: ElementRef})
  private forgotPasswordFormElement!: ElementRef;

  loginFormFields!: Observable<FormField<any>[]>;
  loginFormConfig: FormField<string>[] = [
    new FormField<string>({
      controlType: "textbox",
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validator: "email",
      order: 1
    }),

    new FormField<string>({
      controlType: "textbox",
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      validator: "password",
      order: 2
    })
  ];

  forgotPasswordFormFields!: Observable<FormField<any>[]>;
  forgotPasswordFormConfig: FormField<string>[] = [
    new FormField<string>({
      controlType: "textbox",
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validator: "email",
      order: 1
    })
  ];
  constructor(service: FormfieldControlService) {
    this.loginFormFields = service.getFormFields(this.loginFormConfig);
    this.forgotPasswordFormFields = service.getFormFields(this.forgotPasswordFormConfig);

  }
  ngOnInit(): void {
  }

  showForgotPassword(){
    if ($) {
      $(this.loginFormElement.nativeElement).slideUp(50, () => {
        $(this.forgotPasswordFormElement.nativeElement).fadeIn(50);
      });
    }
  }

  hideForgotPassword() {
    if ($) {
      $(this.forgotPasswordFormElement.nativeElement).fadeOut(50, () => {
        $(this.loginFormElement.nativeElement).slideDown(50);
      });
    }
  }
}
