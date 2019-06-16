import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs/operators';

import * as taxActions from '../actions/tax.actions';
import { TaxService } from 'src/app/core';

@Injectable()
export class TaxEffects {

  @Effect() getCategories$ = this.actions$
    .pipe(
      ofType(taxActions.LOAD_TAXES),
      mergeMap(() => this.taxService.getAll()),
      map(taxes => new taxActions.LoadTaxesSuccess(taxes))
    );

  constructor(
    private actions$: Actions,
    private taxService: TaxService
  ) {
  }
}
