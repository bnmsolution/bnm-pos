import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  RegisterSale,
  RegisterSaleStatus,
  Product
} from 'pos-models';
import format from '../shared/utils/format';

import { AppState } from '../core';

import { cloneDeep } from '../shared/utils/lang';
import { Period, getPeriodDates, FilterPeriod, FilterPeriodChage } from '../shared/utils/filter-period';
import { _filterSalesByPeriod } from '../shared/operators/filter-sales-by-period';
import { generateDashboardData, DashboardData } from './dashboard-data-generator';
import { DateTimeGroup } from '../shared/enums/date-time-groups';

import * as actions from '../stores/actions/sales.actions';
import * as productActions from '../stores/actions/product.actions';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chart', { static: false }) chartElement: ElementRef;

  filterPeriod: FilterPeriod;
  period: Period;
  groupValue: DateTimeGroup;

  chartInstance: any = null;
  sales: RegisterSale[] = [];
  recentSales: RegisterSale[] = [];
  // topSaleProducts: TopSaleProducts;
  summary: any;
  unsubscribe$ = new Subject();
  formatDate = format;
  dashboardData: DashboardData;

  products: Product[];

  constructor(private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private appState: AppState,
    private store: Store<any>) {
    this.loadDashboardSettings();
  }

  ngOnInit() {
    this.store.select('sales')
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(sales => {
        if (sales) {
          this.sales = cloneDeep(sales);
          this.recentSales = this.sales.sort((a, b) =>
            new Date(b.salesDate).getTime() - new Date(a.salesDate).getTime()
          ).slice(0, 10);
          // this.initDashboard();
          this.dashboardData = generateDashboardData(this.period, this.filterPeriod, sales);
          this.cdr.detectChanges();
        } else {
          this.store.dispatch(new actions.LoadSales());
        }
      });


    this.store.select('customers')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(customers => {

      });

    this.store.select('products')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(products => {
        products ? this.products = products : this.store.dispatch(new productActions.LoadProducts());
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadDashboardSettings() {
    const lastUsedFilterPeriod = parseInt(localStorage.getItem('dashboard-filterPeriod'), 10);
    if (FilterPeriod[lastUsedFilterPeriod] !== undefined) {
      this.filterPeriod = lastUsedFilterPeriod;
    } else {
      this.filterPeriod = FilterPeriod.ThisMonth;
    }
    this.period = getPeriodDates(this.filterPeriod);
  }

  // get legendLabel() {
  //   switch (this.period) {
  //     case DashboardPeriods.Today: {
  //       return ['오늘', format(this.summary.dates.startDate, '지난주 iiii')];
  //     }
  //     case DashboardPeriods.ThisWeek: {
  //       return ['이번주', '지난주'];
  //     }
  //     case DashboardPeriods.ThisMonth: {
  //       return ['이번달', '지난달'];
  //     }
  //   }
  // }


  get salesDiff() {
    const { current, previous } = this.summary;
    const salesAmountDiff = current.salesAmount - previous.salesAmount;
    const avgDiff = current.avgPerSaleAmount - previous.avgPerSaleAmount;
    return {
      totalSalesAmountDiff: salesAmountDiff,
      averageSaleAmountDiff: avgDiff
    };
  }

  periodChange(change: FilterPeriodChage) {
    if (change.filterPeriod === FilterPeriod.All) {
      this.period.endDate = this.sales[0].salesDate;
      this.period.startDate = this.sales[this.sales.length - 1].salesDate;
    } else {
      this.period = change.period;
    }

    this.filterPeriod = change.filterPeriod;
    localStorage.setItem('dashboard-filterPeriod', this.filterPeriod + '');
    this.dashboardData = generateDashboardData(this.period, this.filterPeriod, this.sales);
  }

  initDashboard() {
    // if (this.sales.length > 0) {
    //   const summary: any = sortSales(this.sales, this.period, format);
    //   summary.current = generateDashboard(summary.salesInCurrentPeriod);
    //   summary.previous = generateDashboard(summary.salesInPreviousPeriod);
    //   this.topSaleProducts = generateTopSaleProducts(summary.current.products, summary.previous.products);
    //   this.summary = summary;
    // }
  }

  periodStr() {
    return {
      start: new Date(this.period.startDate).toString(),
      end: new Date(this.period.endDate).toString(),
      prevStart: new Date(this.period.prevStartDate).toString(),
      prevEnd: new Date(this.period.prevEndDate).toString()
    };
  }

  accumulateSales(data: any, sale: RegisterSale) {
    if (sale.status === RegisterSaleStatus.Completed) {
      data.count++;
      data.total += sale.totalPrice;
    }
  }

  groupChange(groupValue: DateTimeGroup) {
    this.groupValue = groupValue;
  }

  getEmptySalesData(): any {
    return {
      label: '',
      index: 0,
      count: 0,
      total: 0,
      avg: 0
    };
  }



}

