import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { generateProductReports, RegisterSale, Product } from 'pos-models';

import * as salesListActions from 'src/app/stores/actions/sales.actions';
import * as productListActions from 'src/app/stores/actions/product.actions';
import { FilterPeriod, Period, getPeriodDates } from 'src/app/shared/utils/filter-period';
import { isWithinInterval } from 'date-fns';
import { Router } from '@angular/router';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private store: Store<any>,
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

  periodChange(periodDates: Period) {
    this.periodDates = periodDates;
    this.generateReports();
  }

  filterSalesByDates() {
    const { startDate, endDate } = this.periodDates;
    if (startDate && endDate) {
      return this.sales.filter(s => isWithinInterval(new Date(s.salesDate), { start: new Date(startDate), end: new Date(endDate) }));
    }

    return this.sales;
  }

  private initTable() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.data;
    this.tableInitiated = true;
  }

}
