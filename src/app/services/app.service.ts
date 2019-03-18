import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PosStore, Employee } from 'pos-models';
import * as moment from 'moment';

import { cloneDeep } from '../shared/utils/lang';
import * as actions from '../stores/actions/store.actions';
import { EmployeeService } from './employee.service';

declare const window: any;

@Injectable()
export class AppState {
  isSynced = false;
  currentUser: Employee;
  currentStore: PosStore;
  appState$ = new BehaviorSubject<any>({});

  constructor(private employeeService: EmployeeService, private store: Store<any>) {
  }

  inistStore(): Observable<any> {
    const subject = new Subject();
    this.store.select('stores')
      .subscribe((stores: PosStore[]) => {
        if (stores && stores.length) {
          this.currentStore = stores[0];
          this.notify();
          window.__localeId__ = this.currentStore.locale;
          // moment.locale(this.currentStore.locale);
          subject.next('');
          subject.complete();
        }
      });
    this.store.dispatch(new actions.LoadStores());
    this.setUser();
    return subject;
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
