import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AddVendorComponent} from './add-vendor/add-vendor.component';
import {VendorListComponent} from './vendor-list/vendor-list.component';
import {ViewVendorComponent} from './view-vendor/view-vendor.component';
import {VendorResolverService} from './vendor-resolver.service';

const routes: Routes = [
  {
    path: 'add',
    component: AddVendorComponent
  },
  {
    path: 'edit/:id',
    component: AddVendorComponent,
    resolve:{
      vendor: VendorResolverService
    }
  },
  {
    path: 'detail/:id',
    component: ViewVendorComponent,
    resolve:{
      vendor: VendorResolverService
    }
  },
  {
    path: '',
    component: VendorListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule {
}
