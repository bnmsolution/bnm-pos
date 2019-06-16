import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, filter } from 'rxjs/operators';


import * as StoreActions from '../actions/store.actions';
import { PosStoreService } from 'src/app/core';

@Injectable()
export class StoreEffects {

  @Effect() getStore$ = this.actions$
    .pipe(
      ofType(StoreActions.LOAD_STORE),
      mergeMap(() => this.storeService.getAll()),
      map(store => new StoreActions.LoadStoresSuccess(store))
    );

  @Effect() updateStore$ = this.actions$
    .pipe(
      ofType(StoreActions.UPDATE_STORE),
      mergeMap((action: StoreActions.UpdateStore) => {
        return this.storeService.updateItem(action.payload);
      }),
      map(store => new StoreActions.UpdateStoreSuccess(store))
    );

  @Effect() changeStream$ = this.storeService.getChangeStream()
    .pipe(
      filter(changes => changes.indexOf('store_') > -1),
      map(() => new StoreActions.LoadStores())
    );

  constructor(
    private actions$: Actions,
    private storeService: PosStoreService
  ) {
  }
}
