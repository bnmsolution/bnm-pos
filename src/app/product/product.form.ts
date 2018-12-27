import { Validators } from '@angular/forms';

export const productForm = {
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
  taxAmount: [{ value: null, disabled: true }],
  productPrice: [{ value: null, disabled: true }],

  trackInventory: false,
  count: [{ value: null, disabled: true }],
  reOrderPoint: [{ value: null, disabled: true }],
  reOrderCount: [{ value: null, disabled: true }],
};
