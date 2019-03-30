import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { ReportRoutingModule } from './report-routing.module';
import { ReportListComponent } from './report-list/report-list.component';


@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule
  ],
  declarations: [
    ReportListComponent
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class ReportModule { }
