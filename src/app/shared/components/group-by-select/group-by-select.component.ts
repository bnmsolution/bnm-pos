import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DateTimeGroup } from '../../enums/date-time-groups';

@Component({
  selector: 'app-group-by-select',
  templateUrl: './group-by-select.component.html',
  styleUrls: ['./group-by-select.component.scss']
})
export class GroupBySelectComponent implements OnInit {

  @Input() groupValue: DateTimeGroup;
  @Input() placeholder = '그룹';

  @Output() groupChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onGroupChange(groupValue: DateTimeGroup) {
    this.groupValue = groupValue;
    this.groupChange.emit(groupValue);
  }
}
