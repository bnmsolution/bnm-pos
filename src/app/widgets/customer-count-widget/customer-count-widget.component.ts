import {Component, OnInit, Input, OnChanges, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {isWithinInterval} from 'date-fns';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Customer, DashboardPeriods, getChangeRateData} from 'pos-models';

import * as actions from '../../stores/actions/customer.actions';

@Component({
  selector: 'app-customer-count',
  templateUrl: './customer-count-widget.component.html',
  styleUrls: ['./customer-count-widget.component.scss']
})
export class CustomerCountWidgetComponent implements OnInit, OnChanges, OnDestroy {
  @Input() period: DashboardPeriods;
  @Input() summary: any;
  customers: Customer[] = [];
  newCustomerCount: number = 0;
  displayData;
  unsubscribe$ = new Subject();

  constructor(
    private store: Store<any>
  ) {
    this.store.select('customers')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((customers: Customer[]) => {
        if (customers) {
          this.customers = customers;
          this.setNewCustomerCount();
        }
      });
    this.store.dispatch(new actions.LoadCustomers());
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.setNewCustomerCount();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setNewCustomerCount() {
    if (this.summary) {
      const {startDate, endDate, prevStartDate, prevEndDate} = this.summary.dates;
      const currentPeriod = {start: new Date(startDate), end: new Date(endDate)};
      const prevPeriod = {start: new Date(prevStartDate), end: new Date(prevEndDate)};
      const previousCount = this.customers.filter(c => isWithinInterval(new Date(c.dateOfJoin), prevPeriod)).length;
      this.newCustomerCount = this.customers.filter(c => isWithinInterval(new Date(c.dateOfJoin), currentPeriod)).length;
      this.displayData = getChangeRateData(this.newCustomerCount, previousCount);
    }
  }


}
