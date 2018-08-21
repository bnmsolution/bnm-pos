import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {tap, filter, take} from 'rxjs/operators';
import {Settings} from 'pos-models';

import * as SettingsActions from 'src/app/stores/actions/settings.actions';

@Injectable()
export class SettingsResolverService {

  constructor(private store: Store<any>) {
  }

  public resolve(): Observable<Settings[]> {
    return this.store.select('settings')
      .pipe(
        tap(settings => {
          if (!settings) {
            this.store.dispatch(new SettingsActions.LoadSettings());
          }
        }),
        filter(settings => settings),
        take(1)
      );
  }
}

