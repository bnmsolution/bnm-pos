import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-payment-types',
  templateUrl: './payment-types.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentTypesComponent implements OnInit, OnChanges {
  @Input() paymentData;
  @ViewChild('chart', { static: true }) chartElement: ElementRef;
  chartInstance;

  ngOnInit() {
  }

  ngOnChanges() {
    const { cash, creditCard, points } = this.paymentData.current;
    const total = cash + creditCard + points;
    const cashRate = Math.round(cash / total * 100);
    const creditRate = Math.round(creditCard / total * 100);
    const pointsRate = 100 - cashRate - creditRate;
    const chartData = {
      datasets: [{
        data: [cashRate, creditRate, pointsRate],
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(201, 203, 207)'
        ]
      }],
      labels: [
        '현금',
        '신용카드',
        '포인트'
      ],
    };
    this.renderChart(chartData);
  }

  renderChart(chartData) {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.chartInstance = new Chart(this.chartElement.nativeElement, {
      type: 'doughnut',
      data: chartData,
      options: {
        aspectRatio: 1.4,
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
              return value ? value + '%' : '';
            }
          }
        }
      }
    });
  }

}
