import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-line-chart-widget',
  templateUrl: './line-chart-widget.component.html',
  styleUrls: ['./line-chart-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartWidgetComponent implements OnInit, OnChanges {

  @Input() chartData;
  @Input() chartOptions;
  @ViewChild('chart', { static: true }) chartElement: ElementRef;
  chartInstance;

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.applyGradient();
    this.chartInstance = new Chart(this.chartElement.nativeElement, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions
    });
  }

  applyGradient() {
    const { width } = this.chartElement.nativeElement;
    const ctx = this.chartElement.nativeElement.getContext('2d');
    const gradientStroke = ctx.createLinearGradient(width, 0, 0, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, '#f49080');

    const gradientFill = ctx.createLinearGradient(width, 0, 0, 0);
    gradientFill.addColorStop(0, 'rgba(128, 182, 244, 0.2)');
    gradientFill.addColorStop(1, 'rgba(244, 144, 128, 0.2)');

    this.chartData.datasets.forEach(d => {
      d.borderColor = gradientStroke;
      d.pointBorderColor = gradientStroke;
      d.pointBackgroundColor = gradientStroke;
      d.pointHoverBackgroundColor = gradientStroke;
      d.pointHoverBorderColor = gradientStroke;
      d.backgroundColor = gradientFill;
    });
  }
}

