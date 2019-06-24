import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { generateProductReports, RegisterSale, Product } from 'pos-models';
import { isWithinInterval, format } from 'date-fns';


import * as salesListActions from 'src/app/stores/actions/sales.actions';
import * as productListActions from 'src/app/stores/actions/product.actions';
import { FilterPeriod, Period, getPeriodDates, FilterPeriodChage } from 'src/app/shared/utils/filter-period';
import { PrinterService, headerStyle, formatNumber, formatString, divider, normalStyle } from 'src/app/services/printer.service';
import { AppState } from 'src/app/core';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

  unsubscribe$ = new Subject();
  sales: RegisterSale[];
  products: Product[];
  data;
  totals;

  periodDates: Period = {
    startDate: null,
    endDate: null
  };

  // Mat table
  dataSource: MatTableDataSource<Product>;
  displayedColumns = ['productName', 'categoryName', 'vendorName', 'totalQuantity', 'grossSales', 'totalDiscount',
    'totalReturns', 'netSales', 'totalTax'];
  displayedColumnsForTotals = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  tableInitiated = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private store: Store<any>,
    private printerService: PrinterService,
    private appState: AppState
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.store.select('sales')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(sales => {
        if (sales) {
          this.sales = sales;
          this.generateReports();
        } else {
          this.store.dispatch(new salesListActions.LoadSales());
        }
      });

    this.store.select('products')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(products => {
        if (products) {
          this.products = products;
          this.generateReports();
        } else {
          this.store.dispatch(new productListActions.LoadProducts());
        }
      });
  }


  /**
   * Generate dashboard when sales and products data are ready.
   */
  generateReports() {
    const reportType = this.router.url.split('/report/')[1];

    if (this.sales && this.products) {
      const filteredSales = this.filterSalesByDates();
      const reports = generateProductReports(filteredSales, this.products);
      let key = 'byProducts';
      switch (reportType) {
        case 'salesByCategory': {
          key = 'byCategories';
          this.displayedColumns = ['categoryName', 'totalQuantity', 'grossSales', 'totalDiscount',
            'totalReturns', 'netSales', 'totalTax'];
          this.displayedColumnsForTotals = ['1', '4', '5', '6', '7', '8', '9'];
          break;
        }
        case 'salesByVendor': {
          this.displayedColumns = ['vendorName', 'totalQuantity', 'grossSales', 'totalDiscount',
            'totalReturns', 'netSales', 'totalTax'];
          this.displayedColumnsForTotals = ['1', '4', '5', '6', '7', '8', '9'];
          key = 'byVendors';
        }
      }
      this.totals = reports[key].total;
      delete reports[key].total;
      this.data = Object.values(reports[key]);
      this.initTable();
    }
  }

  periodChange(change: FilterPeriodChage) {
    this.periodDates = change.period;
    this.generateReports();
  }

  filterSalesByDates() {
    const { startDate, endDate } = this.periodDates;
    if (startDate && endDate) {
      return this.sales.filter(s => isWithinInterval(new Date(s.salesDate), { start: new Date(startDate), end: new Date(endDate) }));
    }

    return this.sales;
  }

  /* tslint:disable */
  printReport() {
    const { startDate, endDate } = this.periodDates;
    const reportType = this.router.url.split('/report/')[1];
    const reportPeriod = startDate === null ? '전체' : `${format(new Date(startDate), 'yyyy-MM-dd HH:mm:ss')} ~ ${format(new Date(endDate), 'yyyy-MM-dd HH:mm:ss')}`;
    const reportTitle = {
      salesByProduct: '상품별 판매 현황',
      salesByCategory: '카테고리별 판매 현황',
      salesByVendor: '거래처별 판매 현황'
    }
    const data = [];
    let totalCount = 0;
    let totalSales = 0;

    data.push([reportTitle[reportType], ...headerStyle]);
    data.push([`기간: ${reportPeriod}`, ...normalStyle])
    data.push([divider, ...normalStyle])
    this.data.forEach(d => {
      totalCount += d.totalQuantity;
      totalSales += d.netSales;
      data.push([`${formatString(d.productName, 24, false)} ${formatString(this.formatNumber(d.totalQuantity), 5)} ${formatString(this.formatNumber(d.netSales), 13)}`, ...normalStyle]);
    });
    data.push([divider, ...normalStyle])
    data.push([`${formatString('합계', 24, false)} ${formatString(this.formatNumber(totalCount), 5)} ${formatString(this.formatNumber(totalSales), 13)}`, ...normalStyle]);

    console.log(data);
    this.printerService.print(data);
  }

  formatNumber(value: number | string = ''): string {
    return formatNumber(this.appState.currentStore.locale, value);
  }

  private initTable() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.data;
    this.tableInitiated = true;
  }


}
