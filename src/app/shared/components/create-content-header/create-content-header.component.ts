import { Component, EventEmitter, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-create-content-header',
  templateUrl: './create-content-header.component.html',
  styleUrls: ['./create-content-header.component.scss']
})
export class CreateContentHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() returnUrl: string;
  @Input() canSubmit: boolean;

  constructor() { }

  ngOnInit() {
  }
}
