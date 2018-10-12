import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {AddProductComponent} from './add-product/add-product.component';
import {ProductListComponent} from './product-list/product-list.component';
import {VariantOptionsComponent} from './variant-options/variant-options.component';
import {VariantGridComponent} from './variant-grid/variant-grid.component';
import {ProductFilterComponent} from './product-filter/product-filter.component';
import {ProductRoutingModule} from './product-routing.module';
import {ProductResolverService} from './product-resolver.service';
import {ViewProductComponent} from './view-product/view-product.component';
import {ImportProductDialogComponent} from './import-product-dialog/import-product-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule
  ],
  declarations: [
    AddProductComponent,
    ProductListComponent,
    VariantOptionsComponent,
    VariantGridComponent,
    ProductFilterComponent,
    ViewProductComponent,
    ImportProductDialogComponent
  ],
  providers: [
    ProductResolverService
  ],
  entryComponents: [
    ImportProductDialogComponent
  ]
})
export class ProductModule {
}
