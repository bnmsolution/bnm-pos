import {Component, OnInit, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {RegisterSale, RegisterSaleStatus, PaymentType, Product, Customer} from 'pos-models';
import {isSameDay, startOfMonth, endOfMonth, isWithinInterval} from 'date-fns';

import {detailExpand} from '../shared/utils/animation';
import * as salesListActions from '../stores/actions/sales.actions';
import * as salesActions from '../stores/actions/register-sale.actions';
import {CustomerService} from '../services/customer.service';
import {AppState} from '../core';
import {FilterPeriod} from '../shared/utils/filter-period';


// export enum FilterPeriod {
//   Today, ThisWeek, ThisMonth, ThisYear, OneWeek, OneMonth, OneYear, Custom
// }

export interface SalesFilter {
  status: RegisterSaleStatus;
  customerId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  period: FilterPeriod;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  animations: detailExpand
})
export class SalesComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<RegisterSale>;
  desc: string;
  filter: SalesFilter;
  filterChange = new Subject();
  unsubscribe$ = new Subject();
  displayedColumns = ['salesDate', 'employeeName', 'customerName', 'totalPrice', 'status'];
  salesStatus: any = RegisterSaleStatus;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    private customerService: CustomerService,
    private appState: AppState) {
    this.filter = this.getEmptyFilter();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.route.queryParams
      .subscribe(params => {
        const customerId = params.customerId;
        if (customerId) {
          this.filter.customerId = customerId;
          this.setFilter();
          this.customerService.getItemById(customerId)
            .subscribe((customer: Customer) => {
              this.desc = `(고객명: ${customer.name} 연락처: ${customer.phone})`;
            });
        }
      });

    this.store.select('sales')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(sales => {
        this.dataSource.data = sales || [];
        this.setFilter();
      });
    this.store.dispatch(new salesListActions.LoadSales());

    this.initFilter();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  continueSale(sale: RegisterSale) {
    this.store.dispatch(new salesActions.ContinueSale({sale}));
    this.router.navigate(['./register']);
  }

  returnSale(sale: RegisterSale) {
    const appState = this.appState.appState$.getValue();
    this.store.dispatch(new salesActions.ReturnSale({sale}));
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

  private initFilter() {
    this.filterChange.subscribe(filter => this.setFilter());

    // custom filter function
    this.dataSource.filterPredicate = (sale: RegisterSale, filter: string) => {
      const filterObject: SalesFilter = JSON.parse(filter);
      const {startDate, endDate, status, customerId} = filterObject;

      if (!isWithinInterval(sale.salesDate, {start: startDate, end: endDate})) {
        return false;
      }

      if (status && status !== sale.status) {
        return false;
      }

      if (customerId && sale.customerId !== customerId) {
        return false;
      }

      return true;
    };
  }

  private setFilter() {
    this.dataSource.filter = JSON.stringify(this.filter);
  }

  private getEmptyFilter(): SalesFilter {
    return {
      status: null,
      customerId: '',
      userId: '',
      startDate: startOfMonth(new Date()),
      endDate: new Date(),
      period: FilterPeriod.ThisMonth
    };
  }
}
