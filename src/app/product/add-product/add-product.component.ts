import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Store} from '@ngrx/store';
import {merge} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {Product, Category, Vendor, Tax, Settings, getProductPriceFromRetailPrice, getProductPriceFromMarkup, getMarkup} from 'pos-models';

import {productForm} from '../product.form';
import * as actions from '../../stores/actions/product.actions';
import {ProductEffects} from 'src/app/stores/effects/product.effects';

@Component({
  selector: 'app-add-product',
  templateUrl: '../product.form.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;
  isNewProduct = true;
  product = {} as Product;
  categories: Category[] = [];
  vendors: Vendor[] = [];
  taxes: Tax[] = [];
  settings: Settings;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<any>,
    private productEffets: ProductEffects) {
    this.createForm();
  }

  get title(): string {
    return this.isNewProduct ? '상품 추가' : '상품 수정';
  }

  ngOnInit() {
    this.route.data
      .subscribe((data) => {
        this.categories = data.categories;
        this.vendors = data.vendors;
        this.taxes = data.taxes;
        this.settings = data.settings[0];

        if (data.editProduct) {
          this.setProductForEdit(data.editProduct);
        }
      });
  }

  createForm() {
    this.productForm = this.fb.group(productForm);

    this.productForm.controls.retailPrice.valueChanges.subscribe(() => this.onPriceChange('retailPrice'));
    this.productForm.controls.supplyPrice.valueChanges.subscribe(() => this.onPriceChange('supplyPrice'));
    this.productForm.controls.markup.valueChanges.subscribe(() => this.onPriceChange('markup'));

    this.productForm.controls.trackInventory.valueChanges.subscribe(trackInventory => {
      if (trackInventory) {
        this.productForm.controls.count.enable();
        this.productForm.controls.reOrderPoint.enable();
        this.productForm.controls.reOrderCount.enable();
      } else {
        this.productForm.controls.count.disable();
        this.productForm.controls.reOrderPoint.disable();
        this.productForm.controls.reOrderCount.disable();
      }
    });
  }

  private onPriceChange(property: string) {
    const tax = this.taxes.find(t => t.id === this.getControlValue('taxId'));
    const supplyPrice = this.getControlValue('supplyPrice');
    let retailPrice = this.getControlValue('retailPrice');
    let productPrice = this.getControlValue('productPrice');
    let markup = this.getControlValue('markup');
    let taxAmount = this.getControlValue('taxAmount');

    if (supplyPrice > 0) {
      switch (property) {
        case 'retailPrice': {
          productPrice = getProductPriceFromRetailPrice(retailPrice, tax.rate);
          taxAmount = retailPrice - productPrice;
          markup = getMarkup(productPrice, supplyPrice);
          break;
        }
        case 'supplyPrice': {
          if (retailPrice > 0) {
            markup = getMarkup(productPrice, supplyPrice);
          }
          break;
        }
        case 'markup': {
          productPrice = getProductPriceFromMarkup(supplyPrice, markup);
          taxAmount = productPrice * tax.rate;
          retailPrice = productPrice + taxAmount;
          break;
        }
      }

      this.setControlValue('productPrice', productPrice);
      this.setControlValue('taxAmount', taxAmount);
      this.setControlValue('retailPrice', retailPrice);
      this.setControlValue('markup', markup);
    }
  }

  private setControlValue(name: string, value: any) {
    const options = {emitEvent: false};
    const control = this.productForm.get(name);
    if (control) {
      control.setValue(value, options);
    } else {
      throw new Error(`Cannot find control ${name}`);
    }
  }

  private getControlValue(name: string) {
    const control = this.productForm.get(name);
    if (control) {
      return control.value;
    } else {
      throw new Error(`Cannot find control ${name}`);
    }
  }

  setProductForEdit(product) {
    this.isNewProduct = false;
    this.product = product;
    this.productForm.patchValue(product);
  }

  onSubmit(): void {
    Object.assign(this.product, this.productForm.value);

    if (this.productForm.valid) {
      merge(this.productEffets.addProduct$, this.productEffets.updateProduct$)
        .pipe(
          filter(action1 => action1.type === actions.ADD_PRODUCT_SUCCESS || action1.type === actions.UPDATE_PRODUCT_SUCCESS),
          take(1)
        )
        .subscribe(action2 => {
          const message = action2.type === actions.ADD_PRODUCT_SUCCESS ? '상품이 추가되었습니다' : '상품이 업데이트 되었습니다';
          this.snackBar.open(message, '확인', {duration: 2000});
          this.router.navigate(['./product']);
        });

      const action = this.isNewProduct ?
        new actions.AddProduct(this.product) : new actions.UpdateProduct(this.product);
      this.store.dispatch(action);
    }
  }
}
