import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SalesByTimeComponent } from './sales-by-time/sales-by-time.component';
import { CustomerCountReportComponent } from './customer-count-report/customer-count-report.component';
import { CustomerSalesReportComponent } from './customer-sales-report/customer-sales-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportListComponent
  },
  {
    path: 'salesByProduct',
    component: SalesReportComponent
  },
  {
    path: 'salesByCategory',
    component: SalesReportComponent
  },
  {
    path: 'salesByVendor',
    component: SalesReportComponent
  },
  {
    path: 'salesByTime',
    component: SalesByTimeComponent
  },
  {
    path: 'customersByTime',
    component: CustomerCountReportComponent
  },
  {
    path: 'customerSalesByTime',
    component: CustomerSalesReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
