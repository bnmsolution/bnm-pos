import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopSaleProductsComponent } from './top-sale-products/top-sale-products.component';
import { SharedModule } from '../shared';
import { PosMaterialModule } from '../app.material.module';
import { SalesByCustomerComponent } from './sales-by-customer/sales-by-customer.component';
import { CustomerCountWidgetComponent } from './customer-count-widget/customer-count-widget.component';
import { PaymentTypesComponent } from './payment-types/payment-types.component';
import { SalesWidgetComponent } from './sales-widget/sales-widget.component';
import { CustomerSaleCountWidgetComponent } from './customer-sale-count-widget/customer-sale-count-widget.component';
import { LineChartWidgetComponent } from './line-chart-widget/line-chart-widget.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PosMaterialModule
  ],
  exports: [
    TopSaleProductsComponent,
    SalesByCustomerComponent,
    PaymentTypesComponent,
    CustomerCountWidgetComponent,
    SalesWidgetComponent,
    CustomerSaleCountWidgetComponent,
    LineChartWidgetComponent,
  ],
  declarations: [
    TopSaleProductsComponent,
    SalesByCustomerComponent,
    CustomerCountWidgetComponent,
    PaymentTypesComponent,
    SalesWidgetComponent,
    CustomerSaleCountWidgetComponent,
    LineChartWidgetComponent
  ]
})
export class WidgetsModule {
}
