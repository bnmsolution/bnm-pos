import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {tap, filter, take} from 'rxjs/operators';
import {Tax} from 'pos-models';

import * as TaxActions from 'src/app/stores/actions/tax.actions';

@Injectable()
export class TaxResolverService {

  constructor(private store: Store<any>) {
  }

  public resolve(): Observable<Tax[]> {
    console.log('resolving taxes');
    return this.store.select('taxes')
      .pipe(
        tap(taxes => {
          if (!taxes) {
            this.store.dispatch(new TaxActions.LoadTaxes());
          }
        }),
        filter(taxes => taxes),
        take(1)
      );
  }
}

