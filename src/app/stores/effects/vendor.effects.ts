import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {filter, map, mergeMap, share} from 'rxjs/operators';


import {VendorService} from 'src/app/core';
import * as vendorActions from '../actions/vendor.actions';

@Injectable()
export class VendorEffects {

  @Effect() getVendors$ = this.actions$
    .ofType(vendorActions.LOAD_VENDORS)
    .pipe(
      mergeMap(() => this.vendorService.getAllVendors()),
      map(vendors => new vendorActions.LoadVendorsSuccess(vendors))
    );


  @Effect() addVendor$ = this.actions$
    .ofType(vendorActions.ADD_VENDOR)
    .pipe(
      mergeMap((action: vendorActions.AddVendor) => {
        return this.vendorService.addItem(action.payload);
      }),
      map(vendor => new vendorActions.AddVendorSuccess(vendor)),
      share()
    );

  @Effect() updateVendor$ = this.actions$
    .ofType(vendorActions.UPDATE_VENDOR)
    .pipe(
      mergeMap((action: vendorActions.UpdateVendor) => {
        return this.vendorService.updateItem(action.payload);
      }),
      map(vendor => new vendorActions.UpdateVendorSuccess(vendor)),
      share()
    );

  @Effect() deleteVendor$ = this.actions$
    .ofType(vendorActions.DELETE_VENDOR)
    .pipe(
      mergeMap((action: vendorActions.DeleteVendor) => {
        return this.vendorService.deleteItem(action.payload);
      }),
      map(vendorId => new vendorActions.DeleteVendorSuccess(vendorId)),
      share()
    );

  @Effect() changeStream$ = this.vendorService.getChangeStream()
    .pipe(
      filter((changes: any) => changes.indexOf('vendor_') > -1),
      map(() => new vendorActions.LoadVendors())
    );

  constructor(
    private actions$: Actions,
    private vendorService: VendorService
  ) {
  }
}
