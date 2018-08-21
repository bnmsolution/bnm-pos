import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {mergeMap, map, filter} from 'rxjs/operators';


import * as SettingsActions from '../actions/settings.actions';
import {SettingsService} from 'src/app/core';

@Injectable()
export class SettingsEffects {

  @Effect() getSettings$ = this.actions$
    .ofType(SettingsActions.LOAD_SETTINGS)
    .pipe(
      mergeMap(() => this.settingsService.getAll()),
      map(settings => new SettingsActions.LoadSettingsSuccess(settings))
    );

  @Effect() updateSettings$ = this.actions$
    .ofType(SettingsActions.UPDATE_SETTINGS)
    .pipe(
      mergeMap((action: SettingsActions.UpdateSettings) => {
        return this.settingsService.updateItem(action.payload);
      }),
      map(settings => new SettingsActions.UpdateSettingsSuccess(settings))
    );

  @Effect() changeStream$ = this.settingsService.getChangeStream()
    .pipe(
      filter(changes => changes.indexOf('settings_') > -1),
      map(() => new SettingsActions.LoadSettings())
    );

  constructor(
    private actions$: Actions,
    private settingsService: SettingsService
  ) {
  }
}
