import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import * as Chart from 'chart.js';
import 'chartjs-plugin-datalabels';
import {getDisplayData, RegisterSale} from 'pos-models';

@Component({
  selector: 'app-sales-by-customer',
  templateUrl: './sales-by-customer.component.html',
  styleUrls: ['./sales-by-customer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesByCustomerComponent implements OnInit, OnChanges {

  @Input() salesInCurrentPeriod: RegisterSale[];
  @Input() salesInPreviousPeriod: RegisterSale[];

  @ViewChild('chart', { static: false }) chartElement: ElementRef;
  chartInstance: any = null;
  salesAmountByCustomer = 0;
  salesAmountByNoneCustomer = 0;
  byCustomerDisplayData: any = {};
  byNoneCustomerDisplayData: any = {};

  ngOnInit() {
  }

  ngOnChanges() {
    this.salesAmountByCustomer = this.getTotalPrice(this.salesInCurrentPeriod);
    this.salesAmountByNoneCustomer = this.getTotalPrice(this.salesInCurrentPeriod, false);
    this.calculateDiff(this.salesAmountByCustomer, this.salesAmountByNoneCustomer);
    const total = this.salesAmountByCustomer + this.salesAmountByNoneCustomer;
    const byCustomer = Math.round(this.salesAmountByCustomer / total * 100);
    const byNoneCustomer = 100 - byCustomer;
    const chartData = {
      datasets: [{
        data: [byCustomer, byNoneCustomer],
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(201, 203, 207)'
        ]
      }],
      labels: [
        '고객 매출',
        '비고객 매출'
      ],
    };

    this.renderChart(chartData);
  }

  calculateDiff(amountByCustomer, amountByNoneCustomer) {
    const prevSalesAmountByCustomer = this.getTotalPrice(this.salesInPreviousPeriod);
    const prevSalesNoneAmountByCustomer = this.getTotalPrice(this.salesInPreviousPeriod, false);
    const changeByCustomer = prevSalesAmountByCustomer ?
      (amountByCustomer - prevSalesAmountByCustomer) / prevSalesAmountByCustomer * 100 : null;
    const changeByNoneCustomer = prevSalesNoneAmountByCustomer ?
      (amountByNoneCustomer - prevSalesNoneAmountByCustomer) / prevSalesNoneAmountByCustomer * 100 : null;
    this.byCustomerDisplayData = getDisplayData(changeByCustomer);
    this.byNoneCustomerDisplayData = getDisplayData(changeByNoneCustomer);
  }

  getTotalPrice(sales: RegisterSale[], byCustomer = true): number {
    return sales.filter(s => byCustomer ? s.customerId : !s.customerId)
      .map(s => s.totalPrice)
      .reduce((a, b) => a + b, 0);
  }

  renderChart(chartData) {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.chartInstance = new Chart(this.chartElement.nativeElement, {
      type: 'doughnut',
      data: chartData,
      options: {
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 20
          }
        },
        plugins: {
          datalabels: {
            color: '#ffffff',
            formatter: (value, context) => {
              return value + '%';
            }
          }
        }
      }
    });
  }
}
