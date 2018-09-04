import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {RegisterRoutingModule} from './register-routing.module';
import {RegisterComponent} from './register.component';
import {RegisterSaleComponent} from './sale/register-sale.component';
import {RegisterConfigComponent} from './register-config/register-config.component';
import {CheckoutComponent} from './sale/checkout/checkout.component';
import {SingleProductEditDialogComponent} from './quick-products/single-product-edit-dialog/single-product-edit-dialog.component';
import {GroupProductEditDialogComponent} from './quick-products/group-product-edit-dialog/group-product-edit-dialog.component';
import {ProductTabsComponent} from './sale/product-tabs/product-tabs.component';
import {RegisterSearchComponent} from './sale/search/register-search.component';
import {ReceiptComponent} from './sale/receipt/receipt.component';
import {PaymentComponent} from './sale/payment/payment.component';
import {QuickProductsComponent} from './quick-products/quick-products.component';
import {QuickProductComponent} from './quick-products/quick-product/quick-product.component';
import {LineItemComponent} from './sale/checkout/line-item/line-item.component';
import {TotalsComponent} from './sale/checkout/totals/totals.component';
import {TabEditDialogComponent} from './quick-products/tab-edit-dialog/tab-edit-dialog.component';
import {AddCustomerDialogComponent} from './sale/add-customer-dialog/add-customer-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    RegisterRoutingModule
  ],
  declarations: [
    RegisterComponent,
    RegisterConfigComponent,
    // OpenShiftComponent,
    // ProductViewDialogComponent,

    // Checkout components
    // CheckoutComponent,

    // Quick product components
    QuickProductsComponent,
    QuickProductComponent,
    GroupProductEditDialogComponent,
    SingleProductEditDialogComponent,
    TabEditDialogComponent,

    // Register sale components
    RegisterSaleComponent,
    CheckoutComponent,
    PaymentComponent,
    ProductTabsComponent,
    ReceiptComponent,
    RegisterSearchComponent,
    LineItemComponent,
    TotalsComponent,
    // VariantSelectDialogComponent,
    AddCustomerDialogComponent
  ],
  entryComponents: [
    // ProductViewDialogComponent,
    GroupProductEditDialogComponent,
    SingleProductEditDialogComponent,
    TabEditDialogComponent,
    // VariantSelectDialogComponent,
    // TabEditDialogComponent,
    AddCustomerDialogComponent
  ],
  providers: [
    // ShiftGuardService,
    // RegisterConfigGuardService,
    // RegisterGuardService,
    // RegisterResolverService
  ]
})
export class RegisterModule {
}
