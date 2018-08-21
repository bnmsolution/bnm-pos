import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {tap, filter, take} from 'rxjs/operators';
import {Vendor} from 'pos-models';

import * as VendorActions from 'src/app/stores/actions/vendor.actions';

@Injectable()
export class VendorResolverService {

  constructor(private store: Store<any>) {
  }

  public resolve(): Observable<Vendor[]> {
    return this.store.select('vendors')
      .pipe(
        tap(vendors => {
          if (!vendors) {
            this.store.dispatch(new VendorActions.LoadVendors());
          }
        }),
        filter(vendors => vendors),
        take(1)
      );
  }
}

