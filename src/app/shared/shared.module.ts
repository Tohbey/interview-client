import {ButtonComponent} from "./components/button/button.component";
import {GxModalComponent} from "./components/gx-modal/gx-modal.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import { DynamicFormInputComponent } from './components/dynamic-form-input/dynamic-form-input.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ContentComponent } from './components/content/content.component';

const COMPONENTS:any[] = [
  ButtonComponent,
  GxModalComponent,
  DynamicFormInputComponent, DynamicFormComponent,
  BreadcrumbComponent, ContentComponent
]

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations:[...COMPONENTS],
  exports: [...COMPONENTS]
})

export class SharedModule{

}
