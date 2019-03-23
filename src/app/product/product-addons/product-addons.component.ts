import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

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
        price: null
      })
    );
    this.dataSource.data = this.addonsControl.value;
  }

  removeAddon(index: number) {
    this.addonsControl.removeAt(index);
    this.dataSource.data = this.addonsControl.value;
  }
}
