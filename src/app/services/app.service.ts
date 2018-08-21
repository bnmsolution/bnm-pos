import { Injectable } from '@angular/core';

// export type InternalStateType = {
//   [key: string]: any,
//   currentUser: Employee
// };

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
      displaySymbol: true
    },
    dateFormat: 'YYYY-MM-DD A hh:mm:ss'
  };


  public get currentStore() {
    return this._clone(this._currentStore);
  }

  public get currentUser() {
    return this._clone(this._currentUser);
  }

  public get config() {
    return this._clone(this._config);
  }

  private _clone(object: any) {
    return JSON.parse(JSON.stringify(object));
  }

  constructor() {
    window.__localeId__ = this._config.locale;
  }
}
