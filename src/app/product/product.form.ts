import { Validators } from '@angular/forms';
import * as uuid from 'uuid/v1';

import { ProductValidator } from 'src/app/shared/validators/product.validator';
import { ProductService } from 'src/app/core';

export const getProductFrom = (productService: ProductService, readOnly = false) => {

  const skuValidators = readOnly ? [] : [ProductValidator.isUniqueSKU(productService)];
  const barcodeValidators = readOnly ? [] : [ProductValidator.isUniqueBarcode(productService)];

  return {
    id: [uuid()],
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

    variantOptions: [[]],
    variants: [[]],
    addons: [[]]
  };
};

