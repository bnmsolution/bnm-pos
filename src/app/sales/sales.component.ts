import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isWithinInterval, endOfDay, startOfDay } from 'date-fns';
import { RegisterSale, RegisterSaleStatus, PaymentType } from 'pos-models';

import * as salesListActions from '../stores/actions/sales.actions';
import * as salesActions from '../stores/actions/register-sale.actions';
import { detailExpand } from '../shared/utils/animation';
import { CustomerService } from '../services/customer.service';
import { AppState } from '../core';
import { FilterPeriod } from '../shared/utils/filter-period';

export interface SalesFilter {
  search: string;
  status: RegisterSaleStatus | string;
  customerId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  period: FilterPeriod;
}

export const defaultFilter = {
  search: '',
  status: '',
  customerId: '',
  userId: '',
  startDate: startOfDay(new Date()),
  endDate: endOfDay(new Date()),
  period: FilterPeriod.Today
};

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  animations: detailExpand
})
export class SalesComponent implements OnInit, OnDestroy {

  desc: string;
  unsubscribe$ = new Subject();
  salesStatus: any = RegisterSaleStatus;

  // properties for mat-table
  dataSource: MatTableDataSource<RegisterSale>;
  displayedColumns = ['salesDate', 'employeeName', 'customerName', 'totalPrice', 'status'];
  filter$: BehaviorSubject<SalesFilter>;
  tableInitiated = false;
  expandedElement;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    private customerService: CustomerService,
    private appState: AppState) {
    this.filter$ = new BehaviorSubject(defaultFilter);
  }

  ngOnInit() {
    this.store.select('sales')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(sales => {
        sales ? this.initTable(sales) : this.store.dispatch(new salesListActions.LoadSales());
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  continueSale(sale: RegisterSale) {
    this.store.dispatch(new salesActions.ContinueSale({ sale }));
    this.router.navigate(['./register']);
  }

  returnSale(sale: RegisterSale) {
    const appState = this.appState.appState$.getValue();
    this.store.dispatch(new salesActions.ReturnSale({ sale }));
    this.router.navigate(['./register']);
  }

  // Temporary code
  getTypeNameKo(paymentType: PaymentType) {
    switch (paymentType) {
      case PaymentType.Cash:
        return '현금';
      case PaymentType.CreditCard:
        return '신용카드';
      case PaymentType.GiftCard:
        return '기프트카드';
      case PaymentType.StorePoint:
        return '포인트';
    }
  }

  private initTable(data) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.saleFilterFunction;
    this.dataSource.data = data;
    this.tableInitiated = true;
    this.filter$.subscribe(filter => {
      this.dataSource.filter = JSON.stringify(filter);
    });
  }

  /**
  * Filter funtion for string search.
  * @param sale
  * @param filter
  */
  private saleFilterFunction(sale: RegisterSale, filter: string): boolean {
    const filterObject: SalesFilter = JSON.parse(filter);
    const { startDate, endDate, status, customerId } = filterObject;

    if (!isWithinInterval(new Date(sale.salesDate), { start: new Date(startDate), end: new Date(endDate) })) {
      return false;
    }

    if (status && status !== sale.status) {
      return false;
    }

    if (customerId && sale.customerId !== customerId) {
      return false;
    }

    return true;
  }
}
