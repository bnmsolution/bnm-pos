import {Validators} from '@angular/forms';
import * as uuid from 'uuid/v1';

export const productForm = {
  id: uuid(),
  name: ['', Validators.required],
  sku: '',
  barcode: '',
  description: '',

  taxId: '',
  categoryId: '',
  vendorId: '',

  supplyPrice: null,
  markup: null,
  retailPrice: [null, Validators.required],
  taxAmount: [{value: null, disabled: true}],
  productPrice: [{value: null, disabled: true}],

  trackInventory: false,
  count: [{value: null, disabled: true}],
  reOrderPoint: [{value: null, disabled: true}],
  reOrderCount: [{value: null, disabled: true}],
};
