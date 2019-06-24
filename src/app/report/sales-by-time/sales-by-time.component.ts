import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RegisterSale, Product, RegisterSaleStatus } from 'pos-models';
import { isWithinInterval } from 'date-fns';

import * as salesListActions from 'src/app/stores/actions/sales.actions';
import { Period, FilterPeriodChage } from 'src/app/shared/utils/filter-period';
import { DateTimeGroup } from 'src/app/shared/enums/date-time-groups';
import { ReportLine, generateSalesGroupData } from '../group-data-generator';

interface SalesByTimeReportLine extends ReportLine {
  index: number;
  label: string;
  salesCount: number;
  grossSales: number;
  totalDiscount: number;
  totalReturns: number;
  netSales: number;
  totalTax: number;
}

@Component({
  selector: 'app-sales-by-time',
  templateUrl: './sales-by-time.component.html',
  styleUrls: ['./sales-by-time.component.scss']
})
export class SalesByTimeComponent implements OnInit {

  unsubscribe$ = new Subject();
  sales: RegisterSale[];
  products: Product[];
  report;
  totals;

  periodDates: Period = {
    startDate: null,
    endDate: null
  };
  groupValue: DateTimeGroup = DateTimeGroup.ByDate;

  // Mat table
  dataSource: MatTableDataSource<Product>;
  displayedColumns = ['index', 'salesCount', 'grossSales', 'totalDiscount',
    'totalReturns', 'netSales', 'totalTax'];
  tableInitiated = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
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
  }


  /**
   * Generate dashboard when sales and products data are ready.
   */
  generateReports() {
    const filteredSales = this.filterSalesByDates();
    this.report = this.calcGroupSales(filteredSales);
    this.totals = this.calcTotals(this.report);
    this.initTable();
  }

  periodChange(change: FilterPeriodChage) {
    this.periodDates = change.period;
    this.generateReports();
  }

  groupChange(groupValue: DateTimeGroup) {
    this.groupValue = groupValue;
    this.generateReports();
  }

  filterSalesByDates() {
    const { startDate, endDate } = this.periodDates;
    let filteredSales = this.sales;

    if (startDate && endDate) {
      filteredSales = this.sales.filter(s =>
        isWithinInterval(new Date(s.salesDate), { start: new Date(startDate), end: new Date(endDate) }));
    }

    return filteredSales;
  }

  getDate(daysNumber: number) {
    return new Date(daysNumber);
  }

  private calcGroupSales(sales: RegisterSale[]) {
    return generateSalesGroupData(this.groupValue, sales, this.getEmptyTotals, this.accumulateSales, true);
  }

  private calcTotals(groupData: any[]) {
    const totals = this.getEmptyTotals();
    groupData.forEach(d => {
      totals.salesCount += d.salesCount;
      totals.grossSales += d.grossSales;
      totals.totalDiscount += d.totalDiscount;
      totals.totalReturns += d.totalReturns;
      totals.netSales += d.netSales;
      totals.totalTax += d.totalTax;
    });
    return totals;
  }

  private accumulateSales(reportLine: SalesByTimeReportLine, sale: RegisterSale) {
    if (sale.status === RegisterSaleStatus.Completed) {
      reportLine.salesCount++;
      reportLine.grossSales += sale.totalPrice + sale.totalDiscount;
      reportLine.totalDiscount += sale.totalDiscount;
      reportLine.netSales += sale.totalPrice;
      reportLine.totalTax += sale.totalTax;
    }

    if (sale.status === RegisterSaleStatus.ReturnCompleted) {
      reportLine.totalReturns += sale.totalPrice;
    }
  }

  private getEmptyTotals(): SalesByTimeReportLine {
    return {
      index: 0,
      label: '',
      salesCount: 0,
      grossSales: 0,
      totalDiscount: 0,
      totalReturns: 0,
      netSales: 0,
      totalTax: 0,
    };
  }

  private initTable() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.report;
    this.tableInitiated = true;
  }

}
