import {Component, Input, OnInit} from '@angular/core';
import {SalesFilter} from '../sales.component';
import {Subject} from 'rxjs';
import {RegisterSaleStatus} from 'pos-models';
import {startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, subYears} from 'date-fns';
import {FilterPeriod, getPeriodDates} from '../../shared/utils/filter-period';

@Component({
  selector: 'app-sales-filter',
  templateUrl: './sales-filter.component.html',
  styleUrls: ['./sales-filter.component.scss']
})
export class SalesFilterComponent implements OnInit {

  @Input() filter: SalesFilter;
  @Input() filterChange: Subject<any>;

  salesStatus: any = RegisterSaleStatus;

  ngOnInit() {

  }

  get dateRange() {
    return {begin: this.filter.startDate, end: this.filter.endDate};
  }

  isFilterEmpty(): boolean {
    return true;
    // return this.filter === null ||
    //   (this.filter.searchValue.trim().length === 0 && this.filter.categoryId === '' && this.filter.vendorId === '');
  }

  periodChange(value) {
    const periodDates = getPeriodDates(value);
    this.filter.startDate = periodDates.startDate;
    this.filter.endDate = periodDates.endDate;
    this.filterChange.next(this.filter);
  }

  changeDate(value) {
    this.filter.startDate = value.begin;
    this.filter.endDate = value.end;
    this.filterChange.next(this.filter);
  }
}
