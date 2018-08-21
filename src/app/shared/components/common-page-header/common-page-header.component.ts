import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-common-page-header',
  templateUrl: './common-page-header.component.html',
  styleUrls: ['./common-page-header.component.scss']
})
export class CommonPageHeaderComponent {
  @Input() title: string;
  @Input() desc: string;
  @Input() buttonTitle: string;
  @Input() buttonLink: string;
  @Output() buttonClick = new EventEmitter();
}
