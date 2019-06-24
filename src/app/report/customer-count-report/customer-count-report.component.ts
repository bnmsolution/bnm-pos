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

interface CustomerCountReportLine extends ReportLine {
  index: number;
  label: string;
  returningCustomersCount: number;
  newCustomersCount: number;
  nonCustomersCount: number;
}

@Component({
  selector: 'app-customer-count-report',
  templateUrl: './customer-count-report.component.html',
  styleUrls: ['./customer-count-report.component.scss']
})
export class CustomerCountReportComponent implements OnInit {

  unsubscribe$ = new Subject();
  sales: RegisterSale[];
  products: Product[];
  report;
  totals;

  periodDates: Period = {
    startDate: null,
    endDate: null
  };
  groupValue: DateTimeGroup = DateTimeGroup.ByMonth;

  // Mat table
  dataSource: MatTableDataSource<Product>;
  displayedColumns = ['index', 'type', 'count'];
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


  generateReports() {
    const filteredSales = this.filterSalesByDates();
    this.report = this.flatData(generateSalesGroupData(this.groupValue, filteredSales, this.getEmptyTotals, this.accumulateCustomerSales));
    this.totals = this.report.map(d => d.count).reduce((a, b) => a + b, 0);
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


  private accumulateCustomerSales(reportLine: CustomerCountReportLine, sale: RegisterSale) {
    if (sale.status === RegisterSaleStatus.Completed) {
      if (sale.isNewCustomer) {
        reportLine.newCustomersCount++;
      } else if (sale.customer) {
        reportLine.returningCustomersCount++;
      } else {
        reportLine.nonCustomersCount++;
      }
    }
  }

  private getEmptyTotals(): CustomerCountReportLine {
    return {
      index: 0,
      label: '',
      returningCustomersCount: 0,
      newCustomersCount: 0,
      nonCustomersCount: 0,
    };
  }

  private flatData(report: CustomerCountReportLine[]) {
    const flattedData = [];
    report.forEach(r => {
      flattedData.push({
        index: r.index,
        label: r.label,
        type: '새고객',
        count: r.newCustomersCount
      });
      flattedData.push({
        index: r.index,
        label: r.label,
        type: '기존고객',
        count: r.returningCustomersCount
      });
      flattedData.push({
        index: r.index,
        label: r.label,
        type: '비고객',
        count: r.nonCustomersCount
      });
    });

    return flattedData;
  }

  private initTable() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.report;
    this.tableInitiated = true;
  }

}
