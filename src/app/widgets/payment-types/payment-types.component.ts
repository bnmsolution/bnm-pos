import {ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, ElementRef, OnChanges} from '@angular/core';
import Chart from 'chart.js';

@Component({
  selector: 'app-payment-types',
  templateUrl: './payment-types.component.html',
  styleUrls: ['./payment-types.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentTypesComponent implements OnInit, OnChanges {
  @Input() paymentRates;
  @ViewChild('chart') chartElement: ElementRef;
  chartInstance;

  ngOnInit() {
  }

  ngOnChanges() {
    const {cash, credit, other} = this.paymentRates;
    const chartData = {
      datasets: [{
        data: [cash, credit, other],
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(201, 203, 207)'
        ]
      }],
      labels: [
        '현금',
        '신용카드',
        '기타'
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
              return value ? value + '%': '';
            }
          }
        }
      }
    });
  }

}
