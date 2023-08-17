import { FormGroup } from '@angular/forms';
import {Component, Input, OnInit} from "@angular/core";
import {FormField} from "../../models/field.interface";
import {FormfieldControlService} from "../../../services/formFieldControlService/formfield-control.service";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() formFields: FormField<string>[] = [];
  @Input() buttonName: string = '';
  // @Input() buttonConfig
  form!: FormGroup;
  payLoad = '';

  constructor(private formfieldService: FormfieldControlService) { }

  ngOnInit(): void {
    this.form = this.formfieldService.toFormGroup(this.formFields);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
  }

}
