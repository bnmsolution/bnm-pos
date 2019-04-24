import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { ReportRoutingModule } from './report-routing.module';
import { ReportListComponent } from './report-list/report-list.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SalesByTimeComponent } from './sales-by-time/sales-by-time.component';
import { CustomerCountReportComponent } from './customer-count-report/customer-count-report.component';
import { CustomerSalesReportComponent } from './customer-sales-report/customer-sales-report.component';


@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule
  ],
  declarations: [
    ReportListComponent,
    SalesReportComponent,
    SalesByTimeComponent,
    CustomerCountReportComponent,
    CustomerSalesReportComponent
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class ReportModule { }
