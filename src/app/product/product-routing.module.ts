import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AddProductComponent} from './add-product/add-product.component';
import {ViewProductComponent} from './view-product/view-product.component';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductResolverService} from 'src/app/product/product-resolver.service';
import {CategoryResolverService} from 'src/app/services/category-resolver.service';
import {TaxResolverService} from 'src/app/services/tax-resolver.service';
import {SettingsResolverService} from 'src/app/services/settings.resolver.service';
import {VendorResolverService} from 'src/app/services/vendor-resolver.service';

const routes: Routes = [
  {
    path: 'add',
    component: AddProductComponent,
    resolve: {
      categories: CategoryResolverService,
      vendors: VendorResolverService,
      taxes: TaxResolverService,
      settings: SettingsResolverService
    }
  },
  {
    path: 'edit/:id',
    component: AddProductComponent,
    resolve: {
      categories: CategoryResolverService,
      vendors: VendorResolverService,
      taxes: TaxResolverService,
      settings: SettingsResolverService,
      editProduct: ProductResolverService
    }
  },
  {
    path: 'detail/:id',
    component: ViewProductComponent,
    resolve: {
      categories: CategoryResolverService,
      vendors: VendorResolverService,
      taxes: TaxResolverService,
      product: ProductResolverService
    }
  },
  {
    path: '',
    component: ProductListComponent,
    resolve: {
      categories: CategoryResolverService,
      vendors: VendorResolverService,
      taxes: TaxResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
}
