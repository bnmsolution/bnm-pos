import {Component, Input, OnInit} from '@angular/core';
import {SalesFilter, FilterPeriod} from '../sales.component';
import {Subject} from 'rxjs';
import {RegisterSaleStatus} from 'pos-models';
import {startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, subYears} from 'date-fns';

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
    const today = new Date();
    switch (value) {
      case FilterPeriod.Today: {
        this.filter.startDate = startOfDay(today);
        this.filter.endDate = endOfDay(today);
        break;
      }
      case  FilterPeriod.ThisWeek: {
        this.filter.startDate = startOfWeek(today);
        this.filter.endDate = endOfWeek(today);
        break;
      }
      case FilterPeriod.ThisMonth: {
        this.filter.startDate = startOfMonth(today);
        this.filter.endDate = endOfMonth(today);
        break;
      }
    }
    this.filterChange.next(this.filter);
  }

  changeDate(value) {
    this.filter.startDate = value.begin;
    this.filter.endDate = value.end;
    this.filterChange.next(this.filter);
  }
}
