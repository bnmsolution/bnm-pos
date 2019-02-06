import { Validators } from '@angular/forms';
import { ProductValidator } from '../shared/validators/product.validator';
import { ProductService } from '../core';

export const getProductFrom = (productService: ProductService, readOnly = false) => {

  const skuValidators = readOnly ? [] : [ProductValidator.isUniqueSKU(productService)];
  const barcodeValidators = readOnly ? [] : [ProductValidator.isUniqueBarcode(productService)];

  return {
    name: ['', Validators.required],
    sku: ['', [], skuValidators],
    barcode: ['', [], barcodeValidators],
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
};

