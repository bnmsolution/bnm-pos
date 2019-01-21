import { ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import Chart from 'chart.js';

@Component({
  selector: 'app-line-chart-widget',
  templateUrl: './line-chart-widget.component.html',
  styleUrls: ['./line-chart-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartWidgetComponent implements OnInit, OnChanges {

  @Input() chartData;
  @Input() chartOptions;
  @ViewChild('chart') chartElement: ElementRef;
  chartInstance;

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.chartInstance = new Chart(this.chartElement.nativeElement, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions
    });
  }
}

