import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Category, Product, Tax, Vendor} from 'pos-models';

import {productForm} from '../product.form';

@Component({
  selector: 'app-view-product',
  templateUrl: '../product.form.html'
})
export class ViewProductComponent implements OnInit {

  productForm: FormGroup;
  title = '상품 정보';
  product: Product = {} as Product;
  categories: Category[] = [];
  vendors: Vendor[] = [];
  taxes: Tax[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.route.data
      .subscribe((data) => {
        this.product = data.product;
        this.categories = data.categories;
        this.vendors = data.vendors;
        this.taxes = data.taxes;
        this.productForm.patchValue(this.product);
      });
  }

  createForm() {
    this.productForm = this.fb.group(productForm);
    this.productForm.disable();
  }

  onSubmit() {
  }
}
