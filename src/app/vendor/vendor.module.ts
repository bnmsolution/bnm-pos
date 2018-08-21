import {NgModule} from '@angular/core';

import {SharedModule} from '../shared';
import {VendorListComponent} from './vendor-list/vendor-list.component';
import {VendorRoutingModule} from './vendor-routing.module';
import {DeleteVendorDialogComponent} from './delete-vendor-dialog/delete-vendor-dialog.component';
import {AddVendorComponent} from 'src/app/vendor';
import {ViewVendorComponent} from './view-vendor/view-vendor.component';
import {VendorResolverService} from './vendor-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    VendorRoutingModule
  ],
  declarations: [
    VendorListComponent,
    AddVendorComponent,
    DeleteVendorDialogComponent,
    ViewVendorComponent
  ],
  entryComponents: [
    DeleteVendorDialogComponent
  ],
  providers: [
    VendorResolverService
  ]
})
export class VendorModule {
}
