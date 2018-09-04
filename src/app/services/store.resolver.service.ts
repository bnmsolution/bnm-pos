import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {tap, filter, take} from 'rxjs/operators';
import {PosStore} from 'pos-models';

import * as StoresActions from 'src/app/stores/actions/store.actions';

@Injectable()
export class StoreResolverService {

  constructor(private store: Store<any>) {
  }

  public resolve(): Observable<PosStore[]> {
    return this.store.select('stores')
      .pipe(
        tap(stores => {
          if (!stores) {
            this.store.dispatch(new StoresActions.LoadStores());
          }
        }),
        filter(stores => stores),
        take(1)
      );
  }
}

