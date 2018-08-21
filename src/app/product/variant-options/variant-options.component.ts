import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {ENTER} from '@angular/cdk/keycodes';
// import {VariantOption} from 'pos-models';

const COMMA = 188;

@Component({
  selector: 'app-variant-options',
  templateUrl: './variant-options.component.html',
  styleUrls: ['./variant-options.component.scss']
})
export class VariantOptionsComponent implements OnInit {
  // @Input() public variantOptions: VariantOption[];
  @Output() public variantAdd = new EventEmitter<any>();
  @Output() public variantRemove = new EventEmitter<any>();
  @Output() public optionUpdated = new EventEmitter<any>();

  selectable = true;
  removable = true;

  public separatorKeysCodes = [ENTER, COMMA];

  constructor() {
  }

  ngOnInit() {
  }

  addVariant() {
    this.variantAdd.emit();
  }

  removeVariant() {
    this.variantRemove.emit();
  }

  add(vo: any, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    if (value.length > 0 && vo.values.indexOf(value) === -1) {
      vo.values.push(value);
      this.optionUpdated.emit();
    }

    if (input) {
      input.value = '';
    }
  }
}
