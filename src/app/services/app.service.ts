import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs';
import {PosStore} from 'pos-models';

import {cloneDeep} from '../shared/utils/lang';
import * as actions from '../stores/actions/store.actions';

declare const window: any;

@Injectable()
export class AppState {
  private _currentStore = {
    id: '4536a4bf-3e00-4db5-ac17-08b88ce492f5',
    name: 'myStore'
  };
  private _currentUser = {
    id: '15b3b1ce-482c-43b2-a708-c90b100f8fd1',
    employeeCode: '0000',
    name: '김지현',
    email: 'bill.jh.kim@gmail.com'
  };
  private _config = {
    locale: 'ko',
    product: {
      price: {
        taxIncluded: true
      }
    },
    currency: {
      symbol: 'KRW',
      displaySymbol: false
    },
    dateFormat: 'YYYY-MM-DD A hh:mm:ss'
  };

  private settings = {};
  appState$ = new BehaviorSubject<any>({});


  get currentStore() {
    return cloneDeep(this._currentStore);
  }

  get currentUser() {
    return cloneDeep(this._currentUser);
  }

  get config() {
    return cloneDeep(this.settings);
  }

  constructor(private store: Store<any>) {
    this.store.select('settings')
      .subscribe((settings: PosStore) => {
        this.settings = settings ? settings[0] : {};
        this.appState$.next({
          store: this._currentStore,
          user: this._currentUser,
          settings: this.settings
        });
      });
    this.store.dispatch(new actions.LoadStores());
    window.__localeId__ = this._config.locale;
  }
}
