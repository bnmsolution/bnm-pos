import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  Product, Category, Vendor, Tax, PosStore,
  getProductPriceFromRetailPrice, getProductPriceFromMarkup, getMarkup, ProductVariant
} from 'pos-models';

import { AppState, ProductService } from '../../core';
import { getProductFrom, updateProductFromArrays } from '../product.form';
import * as actions from '../../stores/actions/product.actions';
import { ProductEffects } from 'src/app/stores/effects/product.effects';
import { VariantOptionsComponent } from '../variant-options/variant-options.component';
import { cloneDeep } from 'src/app/shared/utils/lang';
import { ProductAddonsComponent } from '../product-addons/product-addons.component';
import { getOptions } from 'src/app/shared/config/currency-mask.config';
import { AddCategoryDialogComponent } from 'src/app/category/add-category-dialog/add-category-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-add-product',
  templateUrl: '../product.form.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  @ViewChild(VariantOptionsComponent, { static: false })
  variantOptionComponent: VariantOptionsComponent;

  @ViewChild(ProductAddonsComponent, { static: false })
  addonComponent: ProductAddonsComponent;

  productForm: FormGroup;
  isNewProduct = true;
  readonly = false;
  formType = 'add';
  formErrorMessages: string[] = [];
  variantErrorMessages: string[] = [];
  isFormSubmitted = false;
  currencyMaskOptions = getOptions;

  editProduct: Product;
  viewProduct: Product;

  // references
  categories: Category[] = [];
  vendors: Vendor[] = [];
  taxes: Tax[] = [];
  settings: PosStore;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private store: Store<any>,
    private productEffects: ProductEffects,
    private productService: ProductService,
    private appState: AppState) {
  }

  get title(): string {
    const title = {
      view: '상품 정보',
      edit: '상품 수정',
      add: '상품 추가'
    };
    return title[this.formType];
  }

  ngOnInit() {
    this.route.data
      .subscribe((data) => {
        this.categories = data.categories;
        this.vendors = data.vendors;
        this.taxes = data.taxes;
        this.settings = data.settings[0];

        if (data.viewProduct) {
          this.initViewProduct(data.viewProduct);
        } else if (data.editProduct) {
          this.initEditProduct(data.editProduct);
        } else {
          this.initAddProduct();
        }
      });
  }

  initViewProduct(product: Product) {
    this.readonly = true;
    this.viewProduct = product;
    this.createForm(product, true);
    this.setProduc(product);
    this.formType = 'view';
  }

  initEditProduct(product: Product) {
    this.editProduct = product;
    this.createForm(product);
    this.setProduc(product);
    this.formType = 'edit';
  }

  initAddProduct() {
    this.createForm();
    this.productForm.patchValue({ taxId: this.settings.defaultTaxId });
  }

  createForm(product?: Product, readOnly = false) {
    this.productForm = this.fb.group(getProductFrom(this.fb, this.productService, product, readOnly));

    const controls = this.productForm.controls;
    controls.retailPrice.valueChanges.subscribe(() => this.onPriceChange('retailPrice'));
    controls.supplyPrice.valueChanges.subscribe(() => this.onPriceChange('supplyPrice'));
    controls.markup.valueChanges.subscribe(() => this.onPriceChange('markup'));

    controls.trackInventory.valueChanges.subscribe(trackInventory => {
      if (trackInventory) {
        controls.count.enable();
        controls.reOrderPoint.enable();
        controls.reOrderCount.enable();
      } else {
        controls.count.disable();
        controls.reOrderPoint.disable();
        controls.reOrderCount.disable();
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

  private setControlValue(name: string, value: any) {
    const options = { emitEvent: false };
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

  private setCopyProduct(product) {
    // todo
    // this.product = createNewProduct(product);
    this.productForm.patchValue(product);
  }


  private setProduc(product: Product) {
    this.isNewProduct = false;
    this.productForm.patchValue(product);
    updateProductFromArrays(this.fb, this.productForm, product);
  }

  getFormControlValidity(controlName: string, validationName: string): boolean {
    const errors = this.productForm.controls[controlName].errors;
    if (errors && errors[validationName]) {
      return false;
    }
    return true;
  }


  onSubmit(): void {
    // this.setVariantErrorMessages(product);
    // this.setFormErrorMessages();

    this.scrollToError();

    if (this.productForm.valid && this.variantErrorMessages.length === 0) {
      merge(this.productEffects.addProduct$, this.productEffects.updateProduct$)
        .pipe(
          filter(action1 => action1.type === actions.ADD_PRODUCT_SUCCESS || action1.type === actions.UPDATE_PRODUCT_SUCCESS),
          take(1)
        )
        .subscribe(action2 => {
          const message = action2.type === actions.ADD_PRODUCT_SUCCESS ? '상품이 추가되었습니다' : '상품이 업데이트 되었습니다';
          this.snackBar.open(message, '확인', { duration: 2000 });
          this.router.navigate(['./product']);
        });

      if (this.isNewProduct) {
        const newProduct = cloneDeep(this.productForm.value);
        // todo: Currently only supporting a single store
        newProduct.storeId = this.appState.currentStore.id;
        this.store.dispatch(new actions.AddProduct(newProduct));
      } else {
        const updateProduct = { ...this.editProduct, ...this.productForm.value };
        this.store.dispatch(new actions.UpdateProduct(updateProduct));
      }
    }

    this.isFormSubmitted = true;
  }


  /** Generates form error messages */
  setFormErrorMessages() {
    const messages = [];
    const controls = this.productForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        switch (name) {
          case 'name': {
            messages.push('상품명은 필수입니다.');
            break;
          }
          case 'sku': {
            messages.push('이미 사용중인 재고관리코드 입니다.');
            break;
          }
          case 'barcode': {
            messages.push('이미 사용중인 바코드 입니다.');
            break;
          }
          case 'retailPrice': {
            messages.push('판매가는 필수입니다.');
            break;
          }
        }
      }
    }
    this.formErrorMessages = messages;
  }

  /** Generates variant error meesages **/
  setVariantErrorMessages(product: Product) {
    this.productService.getAllProducts(false)
      .subscribe(products => {
        const errors = [];
        // build all barcodes and all skus array
        const allBarcodes = [this.productForm.value.barcode];
        const allSKUs = [this.productForm.value.sku];
        for (let i = 0; i < products.length; i++) {
          const cur = products[i];
          if (cur.barcode) {
            allBarcodes.push(cur.barcode.trim().toLowerCase());
          }

          if (cur.sku) {
            allSKUs.push(cur.sku.trim().toLowerCase());
          }
        }

        // check barcode and sku uniqueness
        product.variants.forEach((variant: ProductVariant, i: number) => {
          const { retailPrice, barcode, sku } = variant;
          if (variant.retailPrice == null) {
            errors.push(`옵션라인 ${i + 1}: 판매가는 필수입니다.`);
          }

          if (barcode) {
            if (this.isUnique(allBarcodes, barcode)) {
              allBarcodes.push(barcode);
            } else {
              errors.push(`옵션라인 ${i + 1}: 중복되는 바코드(${variant.barcode}) 입니다.`);
            }
          }

          if (sku) {
            if (this.isUnique(allSKUs, sku)) {
              allSKUs.push(sku);
            } else {
              errors.push(`옵션라인 ${i + 1}: 중복되는 재고관리코드(${variant.sku}) 입니다.`);
            }
          }
        });

        this.variantErrorMessages = errors;
      });
  }

  isUnique(searchTarget: string[], searchValue: string) {
    searchValue = searchValue.trim().toLowerCase();
    for (let i = 0; i < searchTarget.length; i++) {
      if (searchTarget[i] === searchValue) {
        return false;
      }
    }
    return true;
  }

  /**
   * Open 'Add Category Dialog'.
   */
  addCategory() {
    this.dialog
      .open(AddCategoryDialogComponent)
      .afterClosed()
      .subscribe(category => {
        if (category) {
          this.categories = [...this.categories, category];
          this.productForm.controls.categoryId.setValue(category.id);
        }
      });
  }

  canDeactivate() {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '레지스터 설정',
        message: '이 페이지를 벗어나면 마지막 저장 후 수정된 내용은 저장되지 않습니다.'
      }
    }).afterClosed();
  }


  scrollToError(): void {
    const firstElementWithError: any = document.querySelector('.mat-form-field-invalid');
    if (firstElementWithError) {
      firstElementWithError.scrollIntoView({ behavior: 'smooth' });
      firstElementWithError.focus();
    }
  }

}
