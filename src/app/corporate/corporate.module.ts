import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorporateRoutingModule } from './corporate-routing.module';
import { TeamComponent } from './team/team.component';
import { StagesComponent } from './stages/stages.component';
import { JobsComponent } from './jobs/jobs.component';


@NgModule({
  declarations: [
    TeamComponent,
    StagesComponent,
    JobsComponent
  ],
  imports: [
    CommonModule,
    CorporateRoutingModule
  ]
})
export class CorporateModule { }
