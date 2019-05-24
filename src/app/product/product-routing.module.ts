import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductResolverService } from 'src/app/product/product-resolver.service';
import { CategoryResolverService } from 'src/app/services/category-resolver.service';
import { TaxResolverService } from 'src/app/services/tax-resolver.service';
import { StoreResolverService } from 'src/app/services/store.resolver.service';
import { VendorResolverService } from 'src/app/services/vendor-resolver.service';

const routes: Routes = [
  {
    path: 'add',
    component: AddProductComponent,
    resolve: {
      categories: CategoryResolverService,
      vendors: VendorResolverService,
      taxes: TaxResolverService,
      settings: StoreResolverService
    }
  },
  {
    path: 'edit/:id',
    component: AddProductComponent,
    resolve: {
      categories: CategoryResolverService,
      vendors: VendorResolverService,
      taxes: TaxResolverService,
      settings: StoreResolverService,
      editProduct: ProductResolverService
    }
  },
  {
    path: 'detail/:id',
    component: AddProductComponent,
    resolve: {
      categories: CategoryResolverService,
      vendors: VendorResolverService,
      taxes: TaxResolverService,
      settings: StoreResolverService,
      viewProduct: ProductResolverService
    }
  },
  {
    path: '',
    component: ProductListComponent,
    // resolve: {
    //   categories: CategoryResolverService,
    //   vendors: VendorResolverService,
    //   taxes: TaxResolverService
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
}
