import { NgModule } from '@angular/core';

import { SharedModule } from '../shared';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { VariantOptionsComponent } from './variant-options/variant-options.component';
import { VariantGridComponent } from './variant-grid/variant-grid.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductResolverService } from './product-resolver.service';
import { ImportProductDialogComponent } from './import-product-dialog/import-product-dialog.component';
import { ProductAddonsComponent } from './product-addons/product-addons.component';
import { VariantListComponent } from './variant-list/variant-list.component';
import { CategoryModule } from '../category/category.module';
import { AddCategoryDialogComponent } from '../category/add-category-dialog/add-category-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule,
    CategoryModule
  ],
  declarations: [
    AddProductComponent,
    ProductListComponent,
    VariantOptionsComponent,
    VariantGridComponent,
    ProductFilterComponent,
    ImportProductDialogComponent,
    ProductAddonsComponent,
    VariantListComponent
  ],
  providers: [
    ProductResolverService
  ],
  entryComponents: [
    ImportProductDialogComponent,
    AddCategoryDialogComponent
  ]
})
export class ProductModule {
}
