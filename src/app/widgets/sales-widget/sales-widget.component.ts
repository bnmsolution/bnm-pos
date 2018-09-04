import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import Chart from 'chart.js';
import {DashboardPeriods, getChangeRateData} from 'pos-models';

import format from '../../shared/utils/format';
import {AppState} from '../../core';

export enum SalesChartTypes {
  Total, Average, Count
}

@Component({
  selector: 'app-sales-widget',
  templateUrl: './sales-widget.component.html',
  styleUrls: ['./sales-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesWidgetComponent implements OnInit, OnChanges {
  @Input() period: DashboardPeriods;
  @Input() summary: any;
  @Input() chartType: any;
  @ViewChild('chart') chartElement: ElementRef;
  chartInstance;
  displayValue: number;
  changeRateData;

  constructor(private appState: AppState) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.renderChart();
    this.setChangeRateData();
  }

  setChangeRateData() {
    const {current, previous} = this.summary;
    switch (this.chartType) {
      case SalesChartTypes.Total: {
        this.displayValue = current.salesAmount;
        this.changeRateData = getChangeRateData(current.salesAmount, previous.salesAmount);
        break;
      }
      case SalesChartTypes.Average: {
        this.displayValue = current.avgPerSaleAmount;
        this.changeRateData = getChangeRateData(current.avgPerSaleAmount, previous.avgPerSaleAmount);
        break;
      }
      case SalesChartTypes.Count: {
        this.displayValue = current.salesCount;
        this.changeRateData = getChangeRateData(current.salesCount, previous.salesCount);
        break;
      }
    }
  }

  get legendLabel() {
    switch (this.period) {
      case DashboardPeriods.Today: {
        return ['오늘', format(this.summary.dates.startDate, '지난주 iiii')];
      }
      case DashboardPeriods.ThisWeek: {
        return ['이번주', '지난주'];
      }
      case DashboardPeriods.ThisMonth: {
        return ['이번달', '지난달'];
      }
    }
  }

  getCurrentData() {
    const data = this.summary.chartData;
    switch (this.chartType) {
      case SalesChartTypes.Total: {
        return data.map(s => s.salesAmount);
      }
      case SalesChartTypes.Average: {
        return data.map(s => s.salesAmount !== null ? s.sales.length === 0 ? 0 : Math.round(s.salesAmount / s.sales.length) : null);
      }
      case SalesChartTypes.Count: {
        return data.map(s => s.salesAmount !== null ? s.sales.length : null);
      }
    }
  }

  getPreviousData() {
    const data = this.summary.chartData;
    switch (this.chartType) {
      case SalesChartTypes.Total: {
        return data.map(s => s.salesAmountPreviousPeriod);
      }
      case SalesChartTypes.Average: {
        return data.map(s => s.salesAmountPreviousPeriod !== null ? s.salesPrevious.length === 0 ? 0 : Math.round(s.salesAmountPreviousPeriod / s.salesPrevious.length) : null);
      }
      case SalesChartTypes.Count: {
        return data.map(s => s.salesAmountPreviousPeriod !== null ? s.salesPrevious.length : null);
      }
    }
  }

  getLabels() {
    const data = this.summary.chartData;
    switch (this.period) {
      case DashboardPeriods.Today: {
        return data.map((d, i) => i % 4 === 0 ? d.label : '');
      }
      case DashboardPeriods.ThisWeek: {
        return data.map((d, i) => i % 2 === 0 ? d.label : '');
      }
      case DashboardPeriods.ThisMonth: {
        return data.map((d, i) => i % 2 === 0 ? d.label : '');
      }
    }
  }

  renderChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.chartInstance = new Chart(this.chartElement.nativeElement, {
      type: 'line',
      data: {
        labels: this.getLabels(),
        datasets: [
          {
            label: this.legendLabel[0],
            data: this.getCurrentData(),
            borderColor: '#3F51B5',
            backgroundColor: '#3F51B5',
            borderWidth: 1,
            lineTension: 0.3,
            fill: false,
            pointRadius: 1,
            pointHoverRadius: 3,
          },
          {
            label: this.legendLabel[1],
            data: this.getPreviousData(),
            borderColor: '#E0E0E0',
            backgroundColor: '#E0E0E0',
            borderWidth: 1,
            lineTension: 0.3,
            fill: false,
            pointRadius: 1,
            pointHoverRadius: 3,
          },
        ]
      },
      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 20
          }
        },
        scales: {
          yAxes: [
            {
              type: 'linear',
              position: 'left',
              ticks: {
                callback: (value, index, values) => {
                  return value.toLocaleString(this.appState.config.locale);
                }
              }
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        hover: {
          intersect: false
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          bodySpacing: 5,
          callbacks: {
            label: (tooltipItem) => {
              const index = tooltipItem.index;
              const chartData = this.summary.chartData;
              if (tooltipItem.datasetIndex === 0) {
                return `${chartData[index].tooltipCurrent}: ${tooltipItem.yLabel.toLocaleString(this.appState.config.locale)}`;
              } else {
                return `${chartData[index].tooltipPrevious}: ${tooltipItem.yLabel.toLocaleString(this.appState.config.locale)}`;
              }
            },
            title: (tooltipItem, data) => {
              return '';
            }
          }
        },
        plugins: {
          datalabels: {
            display: false
          }
        }
      }
    });
  }
}
