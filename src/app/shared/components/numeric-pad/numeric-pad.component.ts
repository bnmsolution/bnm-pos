import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-numeric-pad',
  templateUrl: './numeric-pad.component.html',
  styleUrls: ['./numeric-pad.component.scss']
})
export class NumericPadComponent implements OnInit, OnChanges {

  @Input() value: number;
  @Output() change = new EventEmitter();

  _value = '';

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this._value = '';
  }

  handleClick(value) {
    switch (value) {
      case '00':
      case '0': {
        if (value !== '') {
          this._value += value;
        }
        break;
      }
      case 'backspace': {
        this._value = this._value.slice(0, this._value.length - 1);
        break;
      }
      default: {
        this._value += value;
      }
    }

    this.change.emit(parseInt(this._value, 10));
  }

  handleTouch(event, value) {
    event.preventDefault();
    this.handleClick(value);
  }

}
