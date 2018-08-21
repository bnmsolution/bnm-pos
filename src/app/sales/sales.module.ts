import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { SalesComponent } from './sales.component';
import { SalesFilterComponent } from './sales-filter/sales-filter.component';
import { SalesRoutingModule } from './sales-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SalesRoutingModule
  ],
  declarations: [
    SalesComponent,
    SalesFilterComponent
  ],
  exports: [
    SalesComponent
  ],
  providers: [
  ]
})
export class SalesModule { }
