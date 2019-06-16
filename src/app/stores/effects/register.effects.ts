import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { share, mergeMap, map, filter } from 'rxjs/operators';

import { RegisterService } from 'src/app/core';
import * as registerActions from '../actions/register.actions';

@Injectable()
export class RegisterEffects {

  @Effect() getRegisters$ = this.actions$
    .pipe(
      ofType(registerActions.LOAD_REGISTERS),
      mergeMap((action: registerActions.LoadRegisters) => {
        return this.registerService.getAll();
      }),
      map(registers => new registerActions.LoadRegistersSuccess(registers))
    );


  @Effect() addRegister$ = this.actions$
    .pipe(
      ofType(registerActions.ADD_REGISTER),
      mergeMap((action: registerActions.AddRegister) => {
        return this.registerService.addItem(action.payload);
      }),
      map(register => new registerActions.AddRegisterSuccess(register)),
      share()
    );

  @Effect() updateRegister$ = this.actions$
    .pipe(
      ofType(registerActions.UPDATE_REGISTER),
      mergeMap((action: registerActions.UpdateRegister) => {
        return this.registerService.updateItem(action.payload);
      }),
      map(register => new registerActions.UpdateRegisterSuccess(register)),
      share()
    );

  @Effect() deleteRegister$ = this.actions$
    .pipe(
      ofType(registerActions.DELETE_REGISTER),
      mergeMap((action: registerActions.DeleteRegister) => {
        return this.registerService.deleteItem(action.payload);
      }),
      map(registerId => new registerActions.DeleteRegisterSuccess(registerId)),
      share()
    );

  @Effect() changeStream$ = this.registerService.getChangeStream()
    .pipe(
      filter((changes: any) => changes.indexOf('register_') > -1),
      map(() => new registerActions.LoadRegisters())
    );
  constructor(
    private actions$: Actions,
    private registerService: RegisterService
  ) {
  }
}
