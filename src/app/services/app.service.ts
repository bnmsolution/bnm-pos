import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs';
import {PosStore, Employee} from 'pos-models';

import {cloneDeep} from '../shared/utils/lang';
import * as actions from '../stores/actions/store.actions';
import {EmployeeService} from './employee.service';

declare const window: any;

@Injectable()
export class AppState {
  currentUser: Employee;
  currentStore: PosStore;
  appState$ = new BehaviorSubject<any>({});

  constructor(private employeeService: EmployeeService, private store: Store<any>) {
    this.store.select('stores')
      .subscribe((stores: PosStore) => {
        this.currentStore = stores ? stores[0] : {};
        this.notify();
        window.__localeId__ = this.currentStore.locale;
      });
    this.store.dispatch(new actions.LoadStores());
    this.setUser();
  }

  setUser() {
    this.employeeService.findEmployeeByCode('0000')
      .subscribe(employee => {
        this.currentUser = employee;
        this.notify();
      });
  }

  notify() {
    this.appState$.next({
      store: this.currentStore,
      user: this.currentUser
    });
  }
}
