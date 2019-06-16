import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { startOfDay, endOfDay } from 'date-fns';


import { FilterPeriod, getPeriodDates, Period, FilterPeriodChage } from 'src/app/shared/utils/filter-period';

@Component({
  selector: 'app-period-select',
  templateUrl: './period-select.component.html',
  styleUrls: ['./period-select.component.scss']
})
export class PeriodSelectComponent implements OnInit {

  @Input() filterPeriod: FilterPeriod;
  @Input() placeholder = '기간';
  @Input() exclude: number[] = [];

  @Output() periodChange = new EventEmitter<FilterPeriodChage>();

  displayOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  optionLabels = ['전체', '오늘', '어제', '이번주', '지난주', '이번달', '지난달',
    this.currentYear + '년', this.currentYear - 1 + '년', '7일', '30일', '1년', '직접선택'];
  periodDates: Period;

  constructor() { }

  ngOnInit() {
    this.periodDates = getPeriodDates(this.filterPeriod);
    this.displayOptions = this.displayOptions.filter(o => this.exclude.indexOf(o) === -1);
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  get dateRange() {
    return { begin: this.periodDates.startDate, end: this.periodDates.endDate };
  }

  onPeriodChange(period: FilterPeriod) {
    this.periodDates = getPeriodDates(period);
    this.filterPeriod = period;

    if (period !== FilterPeriod.Custom) {
      this.periodChange.emit({ period: this.periodDates, filterPeriod: this.filterPeriod });
    }
  }

  // Event handler for date range input
  changeDateRange({ begin, end }) {
    this.periodDates = {
      startDate: startOfDay(begin),
      endDate: endOfDay(end)
    };
    this.periodChange.emit({ period: this.periodDates, filterPeriod: this.filterPeriod });
  }

  trackByFnction(index: number) {
    return index;
  }
}
