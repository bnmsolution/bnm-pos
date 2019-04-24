import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { startOfDay, endOfDay } from 'date-fns';


import { FilterPeriod, getPeriodDates, Period } from 'src/app/shared/utils/filter-period';

@Component({
  selector: 'app-period-select',
  templateUrl: './period-select.component.html',
  styleUrls: ['./period-select.component.scss']
})
export class PeriodSelectComponent implements OnInit {

  @Input() period: FilterPeriod;
  @Input() placeholder = '기간';

  @Output() periodChange = new EventEmitter();

  periodDates: Period;

  constructor() { }

  ngOnInit() {
    this.periodDates = getPeriodDates(this.period);
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  get dateRange() {
    return { begin: this.periodDates.startDate, end: this.periodDates.endDate };
  }

  onPeriodChange(period: FilterPeriod) {
    this.periodDates = getPeriodDates(period);
    this.period = period;

    if (period !== FilterPeriod.Custom) {
      this.periodChange.emit(this.periodDates);
    }
  }

  // Event handler for date range input
  changeDateRange({ begin, end }) {
    this.periodDates = {
      startDate: startOfDay(begin),
      endDate: endOfDay(end)
    };
    this.periodChange.emit(this.periodDates);
  }
}
