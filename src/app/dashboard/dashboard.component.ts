import {Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {
  RegisterSale,
  sortSales,
  DashboardPeriods,
  generateDashboard,
  generateTopSaleProducts,
  TopSaleProducts
} from 'pos-models';
import Chart from 'chart.js';
import format from '../shared/utils/format';

import {AppState} from '../core';
import * as actions from '../stores/actions/sales.actions';
import {cloneDeep} from '../shared/utils/lang';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chartElement: ElementRef;

  period: DashboardPeriods = DashboardPeriods.Today;
  chartInstance: any = null;
  sales: RegisterSale[] = [];
  recentSales: RegisterSale[] = [];
  topSaleProducts: TopSaleProducts;
  summary: any;
  unsubscribe$ = new Subject();
  formatDate = format;

  constructor(private cdr: ChangeDetectorRef,
              private appState: AppState, private store: Store<any>) {
  }

  ngOnInit() {
    this.store.select('sales')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(sales => {
        if (sales) {
          this.sales = cloneDeep(sales);
          this.recentSales = this.sales.sort((a, b) =>
            new Date(b.salesDate).getTime() - new Date(a.salesDate).getTime()
          ).slice(0, 5);
          this.initDashboard();
          this.cdr.detectChanges();
        } else {
          this.store.dispatch(new actions.LoadSales());
        }
      });


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
      const summary: any = sortSales(this.sales, this.period);
      summary.current = generateDashboard(summary.salesInCurrentPeriod);
      summary.previous = generateDashboard(summary.salesInPreviousPeriod);
      this.topSaleProducts = generateTopSaleProducts(summary.current.products, summary.previous.products);
      this.summary = summary;
      // this.renderChart();
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
            lineTension: 0.3,
            fill: false
          },
          {
            label: this.legendLabel[1],
            data: data.map(s => s.salesAmountPreviousPeriod),
            borderColor: '#E0E0E0',
            backgroundColor: '#E0E0E0',
            borderWidth: 1,
            lineTension: 0.3,
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
                  return value.toLocaleString(this.appState.currentStore.locale);
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
                return `${chartData[index].tooltipCurrent}: ${tooltipItem.yLabel.toLocaleString(this.appState.currentStore.locale)}`;
              } else {
                return `${chartData[index].tooltipPrevious}: ${tooltipItem.yLabel.toLocaleString(this.appState.currentStore.locale)}`;
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
