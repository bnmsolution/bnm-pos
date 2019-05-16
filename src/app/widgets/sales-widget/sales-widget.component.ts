import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js';
import { format } from 'date-fns';

import { AppState } from '../../core';
import { DashboardData } from 'src/app/dashboard/dashboard-data-generator';
import { FilterPeriod, Period } from 'src/app/shared/utils/filter-period';
import { getChangeRateData } from 'pos-models';

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
  @Input() period: Period;
  @Input() filterPeriod: FilterPeriod;
  @Input() dashboardData: DashboardData;
  @Input() chartType: SalesChartTypes;
  @Input() height = 200;
  @ViewChild('chart') chartElement: ElementRef;
  chartInstance;
  displayValue: number;
  changeRateData;

  chartDataForCurrent: any[];
  chartDataForPrevious: any[];

  constructor(private appState: AppState) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.initData();
    this.renderChart();
    this.setChangeRateData();
  }

  setChangeRateData() {
    const summaryCurrent = this.dashboardData.sales.current;
    const summaryPrevious = this.dashboardData.sales.previous;
    switch (this.chartType) {
      case SalesChartTypes.Total: {
        this.displayValue = summaryCurrent.total;
        this.changeRateData = getChangeRateData(summaryCurrent.total, summaryPrevious.total);
        break;
      }
      case SalesChartTypes.Average: {
        this.displayValue = summaryCurrent.avg;
        this.changeRateData = getChangeRateData(summaryCurrent.avg, summaryPrevious.avg);
        break;
      }
      case SalesChartTypes.Count: {
        this.displayValue = summaryCurrent.count;
        this.changeRateData = getChangeRateData(summaryCurrent.count, summaryPrevious.count);
        break;
      }
    }
  }

  get legendLabel() {
    switch (this.filterPeriod) {
      case FilterPeriod.Today: return ['어제', '오늘'];
      case FilterPeriod.Yesterday: return ['그제', '어제'];
      case FilterPeriod.ThisWeek: return ['지난주', '이번주'];
      case FilterPeriod.LastWeek: return ['지지난주', '지난주'];
      case FilterPeriod.OneWeek: return ['그제', '일주일'];
      case FilterPeriod.ThisMonth: return ['지난달', '이번달'];
      case FilterPeriod.LastMonth: return ['지지난달', '지난달'];
      case FilterPeriod.ThrityDays: return ['그제', '어제'];
      case FilterPeriod.ThisYear: return ['그제', '어제'];
      case FilterPeriod.LastYear: return ['그제', '어제'];
      case FilterPeriod.OneYear: return ['그제', '어제'];
    }
  }


  get dateTimeFormat(): string {
    switch (this.filterPeriod) {
      case FilterPeriod.Today:
      case FilterPeriod.Yesterday: {
        return 'H';
      }
      case FilterPeriod.ThisWeek:
      case FilterPeriod.LastWeek:
      case FilterPeriod.OneWeek: {
        return 'EEEEE';
      }
      case FilterPeriod.ThisMonth:
      case FilterPeriod.LastMonth:
      case FilterPeriod.ThrityDays: {
        return 'MMM d';
      }
      case FilterPeriod.ThisYear:
      case FilterPeriod.LastYear:
      case FilterPeriod.OneYear: {
        return 'yy MMM';
      }
    }
  }

  initData() {
    this.chartDataForCurrent = Object.values(this.dashboardData.sales.current.data);
    this.chartDataForPrevious = Object.values(this.dashboardData.sales.previous.data);
  }

  getData(data: any[]) {
    switch (this.chartType) {
      case SalesChartTypes.Total: {
        return data.map(s => s.total);
      }
      case SalesChartTypes.Average: {
        return data.map(s => s.avg);
      }
      case SalesChartTypes.Count: {
        return data.map(s => s.count);
      }
    }
  }

  getValueByChatType(data: any) {
    switch (this.chartType) {
      case SalesChartTypes.Total: {
        return data.total;
      }
      case SalesChartTypes.Average: {
        return data.avg;
      }
      case SalesChartTypes.Count: {
        return data.count;
      }
    }
  }

  getLabels() {
    return this.chartDataForCurrent.map((d: any) => format(new Date(d.timestamp), this.dateTimeFormat));
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
            label: this.legendLabel[0],
            data: this.getData(this.chartDataForCurrent),
            borderColor: '#3F51B5',
            backgroundColor: '#3F51B5',
            borderWidth: 2,
            lineTension: 0,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 3,
          },
          {
            label: this.legendLabel[1],
            data: this.getData(this.chartDataForPrevious),
            borderColor: '#E0E0E0',
            backgroundColor: '#E0E0E0',
            borderWidth: 2,
            lineTension: 0,
            fill: false,
            pointRadius: 0,
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
                maxTicksLimit: 4,
                callback: (value, index, values) => {
                  // return value.toLocaleString(this.appState.currentStore.locale);
                  return this.chartType === SalesChartTypes.Count ? value : Math.floor(value / 10000);
                }
              }
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                display: true,
                // autoSkip: true,
                maxTicksLimit: 4
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
              const data = tooltipItem.datasetIndex === 0 ?
                this.chartDataForCurrent[index] : this.chartDataForPrevious[index];
              const date = new Date(data.timestamp);
              return `${format(date, this.dateTimeFormat)}: ${this.getValueByChatType(data)}`;
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
