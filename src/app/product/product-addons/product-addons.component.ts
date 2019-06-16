import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { getOptions } from 'src/app/shared/config/currency-mask.config';

@Component({
  selector: 'app-product-addons',
  templateUrl: './product-addons.component.html',
  styleUrls: ['./product-addons.component.scss']
})
export class ProductAddonsComponent implements OnInit {
  @Input() productForm: FormGroup;
  @Input() readonly: boolean;

  // Mat table
  displayedColumns: string[] = ['name', 'price', 'actions'];
  dataSource: MatTableDataSource<any>;

  currencyMaskOptions = getOptions;

  get addonsControl(): FormArray {
    return this.productForm.controls.addons as FormArray;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.addonsControl.value);
  }

  addAddon() {
    this.addonsControl.push(
      this.fb.group({
        name: [''],
        price: 0
      })
    );
    this.dataSource.data = this.addonsControl.value;
  }

  removeAddon(index: number) {
    this.addonsControl.removeAt(index);
    this.dataSource.data = this.addonsControl.value;
  }
}
