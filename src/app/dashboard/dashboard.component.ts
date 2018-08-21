import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {RegisterSale, PaymentType, Customer, sortSales, getDashboardDates, DashboardPeriods, generateDashboard} from 'pos-models';
import Chart from 'chart.js';
import format from '../shared/utils/format';

import {AppState} from '../core';
import * as actions from '../stores/actions/sales.actions';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chartElement: ElementRef;

  period: DashboardPeriods = DashboardPeriods.Today;
  chartInstance: any = null;
  sales = [];
  summary: any;
  unsubscribe$ = new Subject();
  formatDate = format;

  constructor(private appState: AppState, private store: Store<any>) {
  }

  ngOnInit() {
    this.store.select('sales')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(sales => {
        this.sales = sales || [];
        this.initDashboard();
      });
    this.store.dispatch(new actions.LoadSales());

    this.store.select('customers')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(customers => {

      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  get performanceLabel() {
    switch (this.period) {
      case DashboardPeriods.Today: {
        return ['오늘 매출', `지난주 ${format(this.summary.dates.endDate, 'iiii')}`];
      }
      case DashboardPeriods.ThisWeek: {
        return ['이번주 매출', `지난주`];
      }
      case DashboardPeriods.ThisMonth: {
        return ['이번달 매출', `지난달`];
      }
    }
  }

  get salesDiff() {
    const {current, previous} = this.summary;
    const salesAmountDiff = current.salesAmount - previous.salesAmount;
    const avgDiff = current.avgPerSaleAmount - previous.avgPerSaleAmount;
    return {
      totalSalesAmountDiff: salesAmountDiff,
      averageSaleAmountDiff: avgDiff
    };
  }

  periodChange(period: DashboardPeriods) {
    this.period = period;
    this.initDashboard();
  }

  initDashboard() {
    if (this.sales.length > 0) {
      this.summary = sortSales(this.sales, this.period);
      this.summary.current = generateDashboard(this.summary.salesInCurrentPeriod);
      this.summary.previous = generateDashboard(this.summary.salesToCompare);
      this.renderChart();
    }
  }

  renderChart() {
    const data = this.summary.chartData;
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.chartInstance = new Chart(this.chartElement.nativeElement, {
      type: 'line',
      data: {
        labels: data.map(s => s.label),
        datasets: [
          {
            label: this.legendLabel[0],
            data: data.map(s => s.salesAmount),
            borderColor: '#3F51B5',
            backgroundColor: '#3F51B5',
            borderWidth: 1,
            lineTension: 0,
            fill: false
          },
          {
            label: this.legendLabel[1],
            data: data.map(s => s.salesAmountPreviousPeriod),
            borderColor: '#E0E0E0',
            backgroundColor: '#E0E0E0',
            borderWidth: 1,
            lineTension: 0,
            fill: false
          },
        ]
      },
      options: {
        responsive: false,
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
        tooltips: {
          mode: 'index',
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
        }
      }
    });
  }

}
