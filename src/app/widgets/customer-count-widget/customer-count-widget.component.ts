import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { format } from 'date-fns';

import { DashboardData } from 'src/app/dashboard/dashboard-data-generator';
import { FilterPeriod, Period } from 'src/app/shared/utils/filter-period';
import { getChangeRateData } from 'pos-models';
import { getDefaultDataset, getDefaultOptions, getDateTimeFormat, DatasetColors } from '../chart-common';

@Component({
  selector: 'app-customer-count',
  templateUrl: './customer-count-widget.component.html',
  styleUrls: ['./customer-count-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerCountWidgetComponent implements OnChanges {
  @Input() period: Period;
  @Input() filterPeriod: FilterPeriod;
  @Input() dashboardData: DashboardData;
  @Input() height = 200;
  @ViewChild('chart', { static: true }) chartElement: ElementRef;

  chartInstance;
  displayValue: number;
  changeRateData;

  chartDataForCurrent: any[];
  chartDataForPrevious: any[];

  ngOnChanges() {
    this.initData();
    this.renderChart();
    this.setChangeRateData();
  }

  setChangeRateData() {
    const summaryCurrent = this.dashboardData.customers.current;
    const summaryPrevious = this.dashboardData.customers.previous;
    this.displayValue = summaryCurrent.newCustomerCount;
    this.changeRateData = getChangeRateData(summaryCurrent.newCustomerCount, summaryPrevious.newCustomerCount);
  }


  initData() {
    this.chartDataForCurrent = Object.values(this.dashboardData.customers.current.data);
    this.chartDataForPrevious = Object.values(this.dashboardData.customers.previous.data);
  }

  getLabels() {
    return this.chartDataForCurrent.map((d: any) => format(new Date(d.timestamp), getDateTimeFormat(this.filterPeriod)));
  }

  setCanvasHeight() {
    const ctx = this.chartElement.nativeElement.getContext('2d');
    ctx.canvas.height = this.height;
  }

  renderChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.setCanvasHeight();
    this.chartInstance = new Chart(this.chartElement.nativeElement, {
      type: 'line',
      data: {
        labels: this.getLabels(),
        datasets: [
          {
            ...getDefaultDataset(DatasetColors.Current),
            label: '새고객',
            data: this.chartDataForCurrent.map(d => d.newCustomerCount),
            fill: true
          },
          {
            ...getDefaultDataset('#00BCD4'),
            label: '재방문 고객',
            data: this.chartDataForCurrent.map(d => d.returningCustomerCount),
            fill: true
          },
          {
            ...getDefaultDataset(DatasetColors.Previous),
            label: '비고객',
            data: this.chartDataForCurrent.map(d => d.nonCustomerCount),
            fill: true
          },
        ]
      },
      options: {
        ...getDefaultOptions()
      }
    });
  }
}
